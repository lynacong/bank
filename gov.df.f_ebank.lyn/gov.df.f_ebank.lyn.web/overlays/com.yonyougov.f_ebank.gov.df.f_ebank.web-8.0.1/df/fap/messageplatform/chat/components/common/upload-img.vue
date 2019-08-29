<template>
  <Vodal :show="show" @hide="hide" class-name="m-uploadImg">
    <div class="hd">上传头像</div>
    <div class="bd">
      请选择图片 <input type="file" accept="image/jpg, image/jpeg,image/png,image/gif" @change="getFile($event)">
      <div v-if="dataUrl" style="height: 80px; margin-top: 10px;">
        <img :src="dataUrl" alt="" style="max-width: 100%; max-height: 100%;">
      </div>
    </div>
    <div class="ft">
      <button class="btn btn-default" @click="upload" :disabled="!this.files.length">确定</button>
      <button class="btn btn-default" @click="hide">取消</button>
    </div>
  </Vodal>
</template>
<script>
  import Vodal from 'vodal'
  import {blob2DataUrl} from '../../util/util'
  export default {
    props: {
      show: Boolean,
    },
    data() {
      return {
        files: [],
        dataUrl: '',
      }
    },
    methods: {
      getFile(e) {
        this.files = e.target.files
        blob2DataUrl(this.files[0], (e) =>{
          this.dataUrl = e.target.result
        })
      },
      hide() {
        this.$emit('hide')
      },
      upload() {
        this.$emit('upload', this.files[0])
        this.$emit('hide')
      },
    },
    components: {Vodal},
  }
</script>

<style lang="scss">
  .m-uploadImg {
    .vodal-dialog {
      display: flex;
      flex-direction: column;
      .hd {
        padding-bottom: 10px;
      }
      .bd {
        flex: 1;
      }
      .ft {
        text-align: right;
      }
    }
  }
</style>