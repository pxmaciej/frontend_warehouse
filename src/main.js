import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import {routes} from './routes'
import vuetify from './plugins/vuetify'
import VeeValidate from 'vee-validate'
import {store} from './store'

Vue.use(VeeValidate);
Vue.config.productionTip = false
Vue.use(VueRouter)

const router = new VueRouter({
  routes: routes,
  mode : 'history'
})

new Vue({
  router: router,
  vuetify,
  store : store,
  render: h => h(App)
}).$mount('#app')

