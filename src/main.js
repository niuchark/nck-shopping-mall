import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/utils/vant-ui' // 防止main.js过于臃肿，把引入vant组件的逻辑写入utils/vant-ui.js中，再在此引入按需导入的组件
import '@/styles/common.less' // 引入基础样式

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
