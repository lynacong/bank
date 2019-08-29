<template>
  <!--文字-->
  <div>
    <!--文件链接-->
    <a class="chat-link" v-if="msg.msg_type_code == '1'" href="javascript:;" @click="downloadFile(msg.msg_id)"
       v-text="msg.msg_content"></a>
    <!--图片-->
    <div v-if="msg.msg_type_code == 2 && !msg.imgLoading" @dblclick.stop="viewBigImg(msg.imgContent)">
      <img :src="msg.imgContent" alt="" style="max-width: 100%;">
    </div>
    <!--文字-->
    <template v-if="msg.msg_type_code == 0 || msg.msg_type_code == 7">
      <div v-if="msg.menu_url">
        <a @click.stop="openIframe(msg)" class="chat-link" v-text="msg.msg_content"></a>
      </div>
      <div v-else v-html="msg.msg_content"></div>
    </template>
    <!--单据消息-->
    <div v-if="msg.msg_type_code == 5" v-html="msg.msg_content.replace(/onclick\s*=\s*[^\s]*/, '')"
         @click.stop="openBillModal($event, msg)">
      <!--<a class="chat-link" v-html="msg.msg_content" @click.stop="openBillModal(msg)"></a>-->
    </div>
    <!--加载图标-->
    <loading v-if="msg.msg_type_code == -1 || msg.msg_type_code == 2 && msg.imgLoading" :radius="25"
             :sub-radius="4"></loading>

    <!--大图-->
    <big-img v-if="showBigImg" :imgSrc="imgSrc" @clickit="closeBigImg"></big-img>
  </div>
</template>
<script>
  import bigImg from './view-img.vue'
  import loading from './loading.vue'
  import {getParam, openModal, url} from '../../util/util'
  export default {
    props: {
      msg: {Object},
    },
    data() {
      return {
        imgSrc: '',
        showBigImg: false,
      }
    },
    methods: {
      downloadFile(msg_id) {
        var form = $("<form id='downloadForm'>");
        form.attr('style', 'display:none');
        form.attr('target', '');
        form.attr('method', 'post');
        form.attr('action', url.DOWNLOAD);
        var input = $('<input>');
        input.attr('type', 'hidden');
        input.attr('name', 'msg_id');
        input.attr('value', msg_id);
        $('body').append(form);
        form.append(input);
        form.submit();
        form.remove();
        $('#downloadForm').remove();
      },
      openIframe(msg) {
        window.parent.addTabToParent(getParam('menuname', msg.menu_url), msg.menu_url);
      },
      openBillModal(e, msg) {
        if (e.target.nodeName !== 'A') return
        if (msg.param) {
          let params = typeof msg.param === 'object' ? msg.param : JSON.parse(msg.param)
          openModal(params.url)
//          let func = eval(paras.callback)
//          let obj = paras.object
//          func(obj)
        }
      },
      viewBigImg(imgData) {
        this.imgSrc = imgData
        this.showBigImg = true
      },
      closeBigImg() {
        this.showBigImg = false
      },
    },
    components: {bigImg, loading},
  }
</script>