import Vue from 'vue'
import router from './router.js'

Vue.config.productionTip = false;
Vue.config.devtools = false;


const app = new Vue({
  router
}).$mount('#app')
