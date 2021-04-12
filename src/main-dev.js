import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/common/element.js'
import '@/common/treeTable.js'
import 'assets/css/base.css'
import 'assets/fonts/iconfont.css'

Vue.config.productionTip = false
console.log('开发环境？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？');
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

