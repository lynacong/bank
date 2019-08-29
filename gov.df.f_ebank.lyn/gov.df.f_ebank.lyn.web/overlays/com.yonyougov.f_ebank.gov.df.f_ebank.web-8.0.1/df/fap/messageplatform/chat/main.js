import Vue from 'vue'
import App from './components/App.vue'
import Vodal from 'vodal'
import store from './store/index'
import './assets/css/reset.scss'
import './assets/css/common.scss'
import './assets/css/info-body.scss'
import './assets/iconFont/iconfont.css'
import "vodal/common.css";
import "vodal/rotate.css";
window.Vue = Vue
Vue.component('Vodal', Vodal) // 注册全局组件
window.vueInstance = new Vue({
  el: '#im-chat',
  store,
  render: h => h(App)
})
