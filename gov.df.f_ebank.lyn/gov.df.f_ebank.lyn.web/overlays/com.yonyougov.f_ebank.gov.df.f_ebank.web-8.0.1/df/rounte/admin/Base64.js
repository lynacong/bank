
/**
 * Base64 encoding/decoding
 * 
 */
var Base64 = new Base64();

function Base64(){
	this.keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	this.encodeUrl = Base64_encodeUrl;
	this.encodeParam = Base64_encodeParam;
	this.encodeUrlAll = Base64_encodeUrl_all;
	this.encode = Base64_encode;
	this.decode = Base64_decode;
	this.unicodetoBytes = Base64_unicodetoBytes;
	this.bytesToUnicode = Base64_bytesToUnicode;
	this.escapeSpecial = Base64_escapeSpecial;
}

function Base64_encodeParam(vsParam){
	var pos = vsParam.indexOf("_APPLUS_STATE");
	if(pos > 0){
		return vsParam;
	}
	return "_APPLUS_STATE=" + this.escapeSpecial(this.encode(vsParam));
}

function Base64_encodeUrl(vsUrl){
	var pos = vsUrl.indexOf("_APPLUS_STATE");
	if(pos > 0){
		return vsUrl;
	}
	
	pos = vsUrl.indexOf("?");
	if(pos > 0){
		var tmp = vsUrl.substring(pos + 1);
		return vsUrl + "&_APPLUS_STATE=" + this.escapeSpecial(this.encode(tmp));
	}
	
	return vsUrl;
}

//qints,2014年4月24日10:41:35
function Base64_encodeUrl_all(vsUrl){
	var pos = vsUrl.indexOf("_APPLUS_STATE");
	if(pos > 0){
		return vsUrl;
	}
	
	pos = vsUrl.indexOf("?");
	if(pos > 0){
		var tmp = vsUrl.substring(pos + 1);
		return vsUrl.substring(0,pos+1) + "_APPLUS_STATE=" + this.escapeSpecial(this.encode(tmp));
	}
	
	return vsUrl;
}

function Base64_encode(input) {
	if(input == null || input == "" || input == undefined){
		return "";
	}
	var output = "";
	var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	var i = 0;
	input = _utf8_encode(input);
	while (i < input.length) {
		chr1 = input.charCodeAt(i++);
		chr2 = input.charCodeAt(i++);
		chr3 = input.charCodeAt(i++);
		enc1 = chr1 >> 2;
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4 = chr3 & 63;
		if (isNaN(chr2)) {
			enc3 = enc4 = 64;
		} else if (isNaN(chr3)) {
			enc4 = 64;
		}
		output = output +
		this.keyStr.charAt(enc1) + this.keyStr.charAt(enc2) +
		this.keyStr.charAt(enc3) + this.keyStr.charAt(enc4);
	}
	return output;
}

// public method for decoding
function Base64_decode(input) {
	if(input == null || input == "" || input == undefined){
		return "";
	}
	var output = "";
	var chr1, chr2, chr3;
	var enc1, enc2, enc3, enc4;
	var i = 0;
	input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
	while (i < input.length) {
		enc1 = this.keyStr.indexOf(input.charAt(i++));
		enc2 = this.keyStr.indexOf(input.charAt(i++));
		enc3 = this.keyStr.indexOf(input.charAt(i++));
		enc4 = this.keyStr.indexOf(input.charAt(i++));
		chr1 = (enc1 << 2) | (enc2 >> 4);
		chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
		chr3 = ((enc3 & 3) << 6) | enc4;
		output = output + String.fromCharCode(chr1);
		if (enc3 != 64) {
			output = output + String.fromCharCode(chr2);
		}
		if (enc4 != 64) {
			output = output + String.fromCharCode(chr3);
		}
	}
	output = _utf8_decode(output);
	return output;
}

// private method for UTF-8 encoding
_utf8_encode = function (string) {
	string = string.replace(/\r\n/g,"\n");
	var utftext = "";
	for (var n = 0; n < string.length; n++) {
		var c = string.charCodeAt(n);
		if (c < 128) {
			utftext += String.fromCharCode(c);
		} else if((c > 127) && (c < 2048)) {
			utftext += String.fromCharCode((c >> 6) | 192);
			utftext += String.fromCharCode((c & 63) | 128);
		} else {
			utftext += String.fromCharCode((c >> 12) | 224);
			utftext += String.fromCharCode(((c >> 6) & 63) | 128);
			utftext += String.fromCharCode((c & 63) | 128);
		}

	}
	return utftext;
}

// private method for UTF-8 decoding
_utf8_decode = function (utftext) {
	var string = "";
	var i = 0;
	var c = c1 = c2 = 0;
	while ( i < utftext.length ) {
		c = utftext.charCodeAt(i);
		if (c < 128) {
			string += String.fromCharCode(c);
			i++;
		} else if((c > 191) && (c < 224)) {
			c2 = utftext.charCodeAt(i+1);
			string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
			i += 2;
		} else {
			c2 = utftext.charCodeAt(i+1);
			c3 = utftext.charCodeAt(i+2);
			string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
			i += 3;
		}
	}
	return string;
}


function Base64_unicodetoBytes(s){

	var result = new Array();

	if (s == null || s == "")
		return result;

	result.push(255); // add "FE" to head
	result.push(254);

	for ( var i = 0; i < s.length; i++)	{
		var c = s.charCodeAt(i).toString(16);
		if (c.length == 1)
			i = "000" + c;
		else if (c.length == 2)
			c = "00" + c;
		else if (c.length == 3)
			c = "0" + c;

		var var1 = parseInt(c.substring(2), 16);
		var var2 = parseInt(c.substring(0, 2), 16);
		result.push(var1);
		result.push(var2);
	}

	return result;
}

function Base64_bytesToUnicode(bs){
	var result = "";
	var offset = 0;
	if (bs.length >= 2 && bs[0] == 255 && bs[1] == 254)
		offset = 2; // delete "FE"

	for ( var i = offset; i < bs.length; i += 2){
		var code = bs[i] + (bs[i + 1] << 8);
		result += String.fromCharCode(code);
	}

	return result;
}

function Base64_escapeSpecial(value) {
	if ("string" != typeof value){
	  	return value;
	}
	if (value == null) return null;
	value = value.replace(/%/g, "%25"); // 必须先做
	// 7 个保留字
	value = value.replace(/&/g, "%26");
	value = value.replace(/\//g, "%2F");
	value = value.replace(/:/g, "%3A");
	value = value.replace(/;/g, "%3B");
	value = value.replace(/=/g, "%3D");
	value = value.replace(/\?/g, "%3F");
	value = value.replace(/@/g, "%40");
	  // 不安全的字符
	value = value.replace(/"/g, "%22");
	value = value.replace(/#/g, "%23");
	value = value.replace(/</g, "%3C");
	value = value.replace(/>/g, "%3E");
	  // 处理加号和空格
	value = value.replace(/\+/g, "%2B");
	value = value.replace(/ /g, "+"); // 必须在 + 之后做
	return value;
}
