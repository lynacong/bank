<template>
  <div class="g-main">
    <!--头部-->
    <div class="his-head clearfix">
      <div class="pull-left item">
        <span class="text">消息记录</span>
        <span class="chat-close" @click="closeHistoryBox">&times;</span>
      </div>
    </div>
    <!--主体-->
    <div class="g-bd" @scroll="getMsgs">
      <ul class="list-unstyled">
        <li class="m-chatItem"
            v-for="msg in msgs"
            :class="{'z-crt': msgId === 1}"
            @click="msgId=1">
          <!--名字-->
          <div class="tt-1" :class="{'tt-1': msg.fromuserid === activeUserId, 'tt-2': msg.fromuserid !== activeUserId}">
            <span v-text="msg.fromuser">严运广</span>
            <span v-text="msg.time">2014/25/48 15:25:12</span>
          </div>
          <!--文字-->
          <one-msg class="txt" :msg="msg" ></one-msg>
        </li>
      </ul>
      <p v-show="!msgs.length && !loading" class="no-txt">无消息记录</p>
      <div v-show="loading" style="text-align: center">
        <loading  :radius="25"
                  :sub-radius="4"></loading>
      </div>
    </div>
    <!--底部-->
    <div class="g-ft">
      <div class="m-calendar">
        <!--图标-->
        <!--<span class="date-icon glyphicon glyphicon-calendar" @click="openDatePicker"></span>-->
        <datepicker
            :wrapper-class="wrapperClass"
            language="zh"
            format="yyyy-MM-dd"
            :input-class="inputClass"
            calendar-button="true"
            :disabled="{from: fromDate}"
            :calendar-button-icon="iconClass"
            :calendar-button="true"
            @selected="selectedDate"
            :calendar-class="calendarClass" v-model="date"></datepicker>
      </div>
    </div>
  </div>
</template>
<script>
  import oneMsg from '../common/one-msg.vue'
  import loading from '../common/loading.vue'
  import {mapState} from 'vuex'
  import Datepicker from 'vuejs-datepicker'
  import {date2Str} from '../../util/util'

  export default {
    props: {
      msgs: {Object, required: true},
    },
    data() {
      let fromDate = new Date()
      fromDate.setDate(fromDate.getDate() - 7)
      return {
        date: fromDate,
        fromDate,
        msgId: 0,
        wrapperClass: {
          'm-date': true,
        },
        inputClass: {
          'u-inp': true,
          'js-u-inp': true,
        },
        calendarClass: {
          'u-calendar': true,
          'imp': true
        },
        iconClass: 'fa fa-calendar',
      }
    },
    computed: {
      ...mapState(['activeUserId']),
      ...mapState('historyMsg', ['allMsgs', 'dateStr']),
      loading() {
        let {loading = false} = (this.allMsgs[this.dateStr] || {})
        return loading
      },
    },
    methods: {
      getMsgs(e) {
        var $this = $(e.target),
          viewH = $this.height(),//可见高度
          contentH = $this.get(0).scrollHeight,//内容高度
          scrollTop = $this.scrollTop();//滚动高度
        if (scrollTop / (contentH - viewH) >= 0.95) { //到达底部100px时,加载新内容
          // 这里加载数据..
          this.loading = true
          this.$store.dispatch('getHistoryMsgByDate')
        }
      },
      selectedDate(date) {
        let dateStr = date2Str(date, 'yyyy-MM-dd')
        this.$store.commit('historyMsg/DATE_STR', dateStr)
        this.$store.dispatch('getHistoryMsgByDate', {dateStr})
      },
      closeHistoryBox() {
        this.$store.dispatch('toggleHistoryBoxState', {show: false})
      },
    },
    components: {oneMsg, Datepicker, loading},
  }
</script>
<style lang="scss">
  .m-date {
    display: inline-block;
    padding-left: 10px;
    /*width: 80px;*/

    /*height: 20px;*/
    /*bottom: 100%;*/
  }

  .u-inp {
    display: inline-block;
    border: none;
    height: 24px;
  }

  .u-calendar.imp {
    bottom: 100%;
    width: 200px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);;
    header {
      line-height: 24px;
    }
    .cell {
      height: 24px;
      line-height: 24px;
      padding: 0;
    }
  }
</style>
<style lang="scss" scoped>
  @import "../../assets/css/variable";

  .g-main {
    display: flex;
    height: 100%;
    flex-direction: column;
  }

  .his-head {
    border-bottom: 1px solid $bdColor;
    .item {
      padding: 3px 5px 5px;
      margin-top: 2px;
      border-right: 1px solid $bdColor;
      position: relative;
      padding-right: 20px;
      color: $gray;
    }
    .chat-close {
      position: absolute;
      right: 3px;
      top: -3px;
      font-size: 24px;
      font-weight: 200;
      color: $gray5;
      &:hover {
        color: $gray7;
        cursor: default;
      }
    }
  }

  .g-bd {
    height: 300px;
    overflow: auto;
    flex: 1;
    .no-txt {
      text-align: center;
      font-size: 13px;
      padding-top: 5px;
    }
  }

  .m-chatItem {
    font-size: 13px;
    padding: 3px 10px;
    .tt-1 {
      color: $font-his-other;
    }
    .tt-2 {
      color: $font-his-self;
    }
    .txt {
      padding-left: 10px;
    }
  }

  .z-crt {
    background: $bgColor-his-font;
  }

  .g-ft {
    height: 30px;
    line-height: 30px;
    border-top: 1px solid $bdColor;
  }

  .m-calendar {
    position: relative;
    .date-icon {
      position: absolute;
      top: 7px;
      left: 5px;
      z-index: 1;
    }
  }
</style>