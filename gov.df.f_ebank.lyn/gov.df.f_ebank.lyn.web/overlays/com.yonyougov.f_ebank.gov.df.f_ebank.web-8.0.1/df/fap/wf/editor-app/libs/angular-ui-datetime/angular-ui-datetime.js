/*global angular */
/*
 jQuery UI datetimepicker plugin wrapper

 @note If ≤ IE8 make sure you have a polyfill for Date.toISOString()
 @param [ui-date] {object} Options to pass to $.fn.datetimepicker() merged onto uiDateTimeConfig
 */

angular.module('ui.datetime', [])

.constant('uiDateTimeConfig', {
	showTimezone: false,
	showSecond: true,
	dateFormat: 'yy-mm-dd',
	separator: ' ',
	timeFormat: 'HH:mm:ss',
	changeYear: true
})

.directive('uiDatetime', ['uiDateTimeConfig', 'uiDateTimeConverter', function (uiDateTimeConfig, uiDateTimeConverter) {
  'use strict';
  var options;
  options = {};
  angular.extend(options, uiDateTimeConfig);
  return {
    require:'ngModel',
    link:function (scope, element, attrs, controller) {
      var getOptions = function () {
        return angular.extend({}, uiDateTimeConfig, scope.$eval(attrs.uiDate));
      };
      var initDateWidget = function () {
        var showing = false;
        var opts = getOptions();

        // If we have a controller (i.e. ngModelController) then wire it up
        if (controller) {

          // Set the view value in a $apply block when users selects
          // (calling directive user's function too if provided)
          var _onSelect = opts.onSelect || angular.noop;
          opts.onSelect = function (value, picker) {
            scope.$apply(function() {
              showing = true;
              controller.$setViewValue(element.datetimepicker('getDate'));
              _onSelect(value, picker);
              element.blur();
            });
          };
          
          var _gotoCurrent = opts.gotoCurrent || angular.noop;
          opts.gotoCurrent = function (value, picker) {
            scope.$apply(function() {
              showing = true;
              controller.$setViewValue(element.datetimepicker('getDate'));
              _onSelect(value, picker);
              element.blur();
            });
          };
          
          var _beforeShow = opts.beforeShow || angular.noop;
          opts.beforeShow = function(input, picker) {
            showing = true;
            _beforeShow(input, picker);
          };

          var _onClose = opts.onClose || angular.noop;
          opts.onClose = function(value, picker) {
            showing = false;
            _onClose(value, picker);
             scope.$apply(function() {
             	scope.closed();
             });
          };
          element.off('blur.datetimepicker').on('blur.datetimepicker', function() {
            if ( !showing ) {
              scope.$apply(function() {
                element.datetimepicker('setDate', element.datetimepicker('getDate'));
                controller.$setViewValue(element.datetimepicker('getDate'));
              });
            }
          });

          // Update the date picker when the model changes
          controller.$render = function () {
            var date = controller.$modelValue;
            if ( angular.isDefined(date) && date !== null && !angular.isDate(date) ) {
                if ( angular.isString(controller.$modelValue) ) {
                    date = uiDateTimeConverter.stringToDate(attrs.uiDateFormat, controller.$modelValue);
                } else {
                    throw new Error('ng-Model value must be a Date, or a String object with a date formatter - currently it is a ' + typeof date + ' - use ui-date-format to convert it from a string');
                }
            }
            element.datetimepicker('setDate', date);
          };
        }
        // Check if the element already has a datetimepicker.
        if (element.data('datetimepicker')) {
            // Updates the datetimepicker options
            element.datetimepicker('option', opts);
            element.datetimepicker('refresh');
        } else {
            // Creates the new datetimepicker widget
            element.datetimepicker(opts);

            //Cleanup on destroy, prevent memory leaking
            element.on('$destroy', function () {
               element.datetimepicker('destroy');
            });
        }

        if ( controller ) {
          // Force a render to override whatever is in the input text box
          controller.$render();
        }
      };
      // Watch for changes to the directives options
      scope.$watch(getOptions, initDateWidget, true);
    }
  };
}
])
.factory('uiDateTimeConverter', ['uiDateTimeFormatConfig', function(uiDateTimeFormatConfig){

    function dateToString(dateFormat, value){
        dateFormat = dateFormat || uiDateTimeFormatConfig;
        if (value) {
            if (dateFormat) {
                return jQuery.datetimepicker.formatDate(dateFormat, value);
            }

            if (value.toISOString) {
                return value.toISOString();
            }
        }
        return null;
    }

    function stringToDate(dateFormat, value) {
        dateFormat = dateFormat || uiDateTimeFormatConfig;
        if ( angular.isString(value) ) {
            if (dateFormat) {
                return jQuery.datetimepicker.parseDate(dateFormat, value);
            }

            var isoDate = new Date(value);
            return isNaN(isoDate.getTime()) ? null : isoDate;
        }
        return null;
    }

    return {
        stringToDate: stringToDate,
        dateToString: dateToString
    };

}])
.constant('uiDateTimeFormatConfig', '')
.directive('uiDatetimeFormat', ['uiDateTimeConverter', function(uiDateTimeConverter) {
  var directive = {
    require:'ngModel',
    link: function(scope, element, attrs, modelCtrl) {
        var datetimeFormat = attrs.uiDatetimeFormat;

        // Use the datetimepicker with the attribute value as the dateFormat string to convert to and from a string
        modelCtrl.$formatters.unshift(function(value) {
            return uiDateTimeConverter.stringToDate(datetimeFormat, value);
        });

        modelCtrl.$parsers.push(function(value){
            return uiDateTimeConverter.dateToString(datetimeFormat, value);
        });

    }
  };

  return directive;
}]);
