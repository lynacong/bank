<template>
  <div class="edit-box" :class="{'bdt-1': !showTextBox}">
    <!--操作-->
    <div class="sel-box">
      <span class="icon text" @click.stop="showTextBox = !showTextBox" title="调整文字大小"></span>
      <span class="icon smile" @click.stop="showEmojiBoxHandler" title="表情"></span>
      <span class="icon chat-img" @click="sendPic" title="发送图片"></span>
      <span class="icon chat-file" @click="sendFile" v-if="userType !== '002'" title="文件"></span>
      <span class="icon chat-cut" @click="cutScreen" title="截图"></span>

      <!--调整文字大小-->
      <div class="text-box bdt-1" v-show="showTextBox"  >
        <div class="text-inner-box" @click.stop="showFontSizeList = !showFontSizeList">
          <span class="pull-left" style="color: rgba(0,0,0,.5); font-size: 13px; padding-top: 3px;">字体大小</span>
          <div class="bd-1 font-menu pull-left">
            <span v-text="fontSize"></span>
            <span class="caret"></span>
            <ul class="list-unstyled" v-show="showFontSizeList">
              <li v-for="size in fontSizeList" v-text="size" @click="changeFontSize(size)"></li>
            </ul>
          </div>
        </div>

      </div>

      <!--emoji图标库-->
      <div class="emoji-box" v-show="showEmojiBox" >
        <ul class="list-inline">
          <li v-for="name in emoji" @click.stop="insertGif(name)">
            <img :src="'/df/fap/messageplatform/chat/assets/emoji/'+name+'.gif'" alt="">
          </li>
        </ul>
      </div>

      <div class="pull-right history" :class="{hover: historyMsgBoxState.show}" @click="showHistory">消息记录</div>

    </div>
    <!--edit-->
    <div  class="edit-area-box">
      <!--<v-edit-div v-model="content" @getPos="getPos"></v-edit-div>-->
      <div id="chat-content" contentEditable="true" class="edit-area" @keydown="keydownHandler" @click="getRange"  @keyup="getRange">
        <!--<a onclick="chatOpenModal(billMessageData)" href="#" class="chat-link">${billMessageData.showtext}</a>-->
      </div>
    </div>

    <button class="send-btn" @click="sendMsg">
      发送
      <!--<span class="drop-icon"></span>-->
    </button>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {mapState, mapMutations, mapGetters} from 'vuex'
  import {selectFile, url, dataURLtoBlob, isIE, getTempMsgId, getCommonParam, openModal} from '../util/util'
  import {Init, StartCapture} from '../util/capture'


  let vm = null
    , initCapture = false
  export default {
    data() {
      return {
        content: '', // 聊天框的内容
        emoji: [
          'smilea_org', 'sw_org', 'sweata_org', 't_org',
          'tootha_org', 'tza_org', 'unheart', 'wq_org',
          'x_org', 'xh', 'ye_org', 'yhh_org',  'zhh_org',
          'yw_org',
          'yx_org', 'z2_org', 'zy_org',
          'angrya_org', 'bb', 'bba_org', 'bs_org',
          'bs2_org', 'bz_org', 'cake', 'cj_org',
          'clock_org', 'come_org', 'cool_org', 'crazya_org',
          'cry', 'cza_org', 'dizzya_org', 'fuyun_org',
          'geili_org', 'good_org', 'gza_org', 'h_org',
          'hatea_org', 'hearta_org', 'heia_org', 'horse2_org',
          'hsa_org', 'hufen_org', 'j_org', 'k_org',
          'kbsa_org', 'kl_org', 'laugh', 'lazu_org',
          'ldln_org', 'liwu_org', 'll', 'lovea_org',
          'lxhxixi_org', 'm_org', 'mb_org', 'money_org',
          'nm_org', 'no_org', 'ok_org', 'otm_org',
          'panda_org', 'pig', 'qq_org', 'rabbit_org',
          'sad_org', 'sada_org', 'sb_org', 'shamea_org',
          'vw_org', 'wg_org',
        ], // emoji图片的文件名list
        showEmojiBox: false,
        showTextBox: false,
        showFontSizeList: false,
        fontSizeList: [12,13,14,15,16,17,18,19,20].reverse(),
        fontSize: 14,

        userType: getCommonParam().svUserType,
      }
    },
    computed: {
      ...mapState(['billMessageData', 'historyMsgBoxState', 'myUserId']),
      ...mapGetters(['activeUser']),
    },
    methods: {
      showHistory() {
        this.$store.dispatch('toggleHistoryBoxState', {show: !this.historyMsgBoxState.show})
//        this.$store.commit('HISTORY_MSG_BOX_STATE', {show: !this.historyMsgBoxState.show})
//        let flag = this.historyMsgBoxState.show ? 1 : -1
//        this.$store.commit('WIDTH', 360*flag)
      },
      changeFontSize(fontSize) {
        this.fontSize = fontSize
        this.$emit('deliverFontSize', fontSize)
      },
      sendMsg() {
        let text = $('#chat-content').text().trim()
        let content = $('#chat-content').html()
//        console.log(content)
        if(!text && content.indexOf('<img') === -1) return
        if(!this.$store.getters.activeUser) return
        let params = this.$store.state.billMessageData
        let msgType = params ? 5 : 0
        let groupId = this.activeUser.groupId
        msgType = groupId ? 7 : msgType
        this.$store.dispatch('sendMsg', {content, msgType, groupId})
        this.$store.commit('SET_ACTION_TYPE', 0)
        $('#chat-content').html('')
      },
      keydownHandler(e) {
        if(e.keyCode === 13 && !e.ctrlKey) { // 按enter键, 发送消息
          this.sendMsg()
          e.preventDefault()
        } else if(e.keyCode === 13 && e.ctrlKey) { // 按ctrl+enter, 换行
          $('#chat-content').html($('#chat-content').html()+'<div><br></div>')
          var el = $('#chat-content div:last-child')[0]
          var range = document.createRange();
          range.selectNodeContents(el);
          range.collapse(false);
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
          el.scrollIntoView()
        } else {
          if(isIE())
            $(e.target).find('br').remove()
        }
      },
      /**
       * 保存光标位置
       */
      getRange() {
        range = saveSelection()
      },
      insertGif(name) {
        this.showEmojiBox = false
        this.$nextTick(function() {
          restoreSelection(range)
          insertTextAtCursor(name, 'chat-content')
        })
      },
      showEmojiBoxHandler() {
        this.showEmojiBox = true
      },
      sendPic() {
        selectFile((files) => {
          if(files.every(file => /\.(jpg|png|jpeg|gif)$/.test(file.name)))
            this.$store.dispatch('sendFile', {files, groupId: this.activeUser.groupId})
        }, 'image/jpg,image/jpeg,image/png,image/gif')
      },
      /**
       * 发送文件
       */
      sendFile() {
        let userType = getCommonParam().svUserType
        if(userType === '002') {
          alert('您没有发文件的权限')
          return
        }
        selectFile((files) => {
          this.$store.dispatch('sendFile', {files, groupId: this.activeUser.groupId})
        })
//        selectFile(sendFile)
      },

      /**
       * 屏幕截图
       */
      cutScreen() {
        if(!initCapture)
          // 初始化截图插件
         Init({success: successCallback.bind(this), cancel: cancelCallback})

        this.hideChatBox()
        setTimeout(() => {
          StartCapture()
        }, 150)
      },
      hideChatBox() {
        this.$store.commit('SHOW_IMCHAT_BOX', false)
      },
    },
    mounted() {
      vm = this
      /**
       * 关闭emoji选择框
       */
      $(document).click(() => {
        if(this.showEmojiBox) {
          this.showEmojiBox = false
        } else if(this.showFontSizeList) {
          this.showFontSizeList = false
        }
      })
    },
  }

  function successCallback(content, localPath) {
//    $('#im-chat').css('display', 'block')
    vm.$store.commit('SHOW_IMCHAT_BOX', true)
    let blob = dataURLtoBlob(content)
    //获取图片的扩展名
    let pos = localPath.lastIndexOf('\\');
    let fileName = localPath.substr(pos + 1);

    blob.name = fileName
    let groupId = vm.activeUser.groupId
    this.$store.dispatch('sendFile', {files: [blob], groupId})
//    sendFile([blob])
  }
  function cancelCallback() {
//    $('#im-chat').css('display', 'block')
    vm.$store.commit('SHOW_IMCHAT_BOX', true)
  }

  window.chatOpenModal = function() {
    openModal(vueInstance.$store.state.billMessageData.url)
  }

  // 光标位置
  let range = null

  /**
   * 在光标位置插入图片
   * @param name
   * @param id
   */
  function insertTextAtCursor(name, id) {
    var sel, img, edit;
    if (window.getSelection) {
      var sel = window.getSelection();
      if(!range) {
        edit = document.getElementById(id)
        edit.innerHTML += `<img src="/df/fap/messageplatform/chat/assets/emoji/${name}.gif">`
        return
      }
      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
        range.deleteContents();
        img = document.createElement('img')
        img.src = `/df/fap/messageplatform/chat/assets/emoji/${name}.gif`
        range.insertNode(img);
        range.collapse(false)
      }
    } else if (document.selection && document.selection.createRange) {
      document.selection.createRange().text = text;
    }
  }

  /**
   * 保存光标位置
   * @returns {*}
   */
  function saveSelection() {
    if (window.getSelection) {
      var sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        return sel.getRangeAt(0);
      }
    } else if (document.selection && document.selection.createRange) {
      return document.selection.createRange();
    }
    return null;
  }

  /**
   * 取出光标位置
   * @param range
   */
  function restoreSelection(range) {
    if (range) {
      if (window.getSelection) {
        var sel = window.getSelection();
        sel.removeAllRanges();
//        range.collapse(false)
        sel.addRange(range);
        range.deleteContents();
      } else if (document.selection && range.select) {
        range.select();
      }
    }
  }

</script>
<style lang="scss" scoped>
  @import "../assets/css/variable";
  .edit-box {
    padding-top: 10px;
    position: relative;
  }
  .set-box {
    padding-bottom: 10px;
  }
  .sel-box {
    position: relative;
    .history {
      margin-top: -3px;
      margin-right: 5px;
      padding: 3px;
      border-radius: 3px;
      color: $gray;
      cursor: default;
      &.hover,
      &:hover {
        background: $bgColor;
      }
    }
  }
  .icon {
    padding: 0 15px;
    display: inline-block;
    width: 20px;
    height: 20px;
    background: url('../assets/text.png') no-repeat center center;
    cursor: pointer;
  }
  .icon.text {
    background-image: url('../assets/text.png')
  }
  .icon.smile {
    background-image: url('../assets/smile.png')
  }
  .icon.chat-img {
    background-image: url('../assets/pic.png');
  }
  .icon.chat-file {
    background-image: url('../assets/file.png');
  }
  .icon.chat-cut {
    background-image: url('../assets/cut.png');
  }
  .edit-area-box {
    height: 60px;
    padding-right: 10px;
    overflow: auto;
  }
  .edit-area {
    width: 100%;
    height: 100%;
    resize: none;
    border: none;
    &:focus {
      border: none;
      outline: none;
    }
  }
  .send-btn {
    border: none;
    background: #4598FF;
    position: absolute;
    right: 10px;
    padding: 4px 13px;
    color: rgba(255,255,255,.9);
    font-size: 12px;
    &:after {
      content: 'Ctrl+Enter换行';
      color: rgba(0,0,0,.6);
      position: absolute;
      left: 0;
      top: 50%;
      width: 100px;
      transform: translate(-100%, -50%);
    }
  }
  .drop-icon {
    position: absolute;
    width: 15px;
    height: 15px;
    right: 5px;
    top: 3px;
    border-radius: 3px;
    &:hover {
      background: rgba(255,255,255,.3);
    }
  }
  .drop-icon:after {
    content: '';
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 4px solid transparent;
    border-top-color: rgba(255,255,255,.9);
  }
  .emoji-box {
    position: absolute;
    top: 0;
    transform: translate(0, -100%);
    width: 350px;
    height: 226px;
    background: #ddd;
    box-shadow: 0 0 10px 0 rgba(0,0,0,0.3);
    padding: 5px;
    overflow: auto;
    li {
      margin-bottom: 5px;
    }
  }
  .text-box {
    position: absolute;
    bottom: 100%;
    width: 100%;
    height: 32px;
    padding-top: 5px;
    background: #fff;
  }
  .text-inner-box {
    float: left;
    width: 120px;
    .font-menu {
      position: relative;
      /*color: rgba(0,0,0,.5);*/
      padding: 0 5px;
      border-radius: 3px;
      margin-left: 5px;
    }
    .list-unstyled {
      border: 1px solid rgba(0,0,255,.2);
      position: absolute;
      left: 0;
      width: 100%;
      bottom: 110%;
      background: #fff;
      padding: 1px;
      li {
        padding-left: 4px;
        &:hover {
          background: rgba(0,0,255, .7);
          color: #fff;
          cursor: default;
        }
      }
    }
  }
</style>