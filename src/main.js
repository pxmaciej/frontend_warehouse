import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import {routes} from './routes'
import vuetify from './plugins/vuetify'
import VeeValidate from 'vee-validate'
import {store} from './store'
import SmartTable from 'vuejs-smart-table'
import Notifications from 'vue-notification'
import DatetimePicker from 'vuetify-datetime-picker'


Vue.use(DatetimePicker) 
Vue.use(VeeValidate);
Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(SmartTable);
Vue.use(Notifications);

Vue.prototype.API_PRODUCT = 'https://magazyn-matech.netlify.app/api/product/';
Vue.prototype.API_ORDER = 'https://magazyn-matech.netlify.app/api/order/';
Vue.prototype.API_ALERT = 'https://magazyn-matech.netlify.app/api/alert/';
Vue.prototype.API_CATEGORY = 'https://magazyn-matech.netlify.app/api/category/';
Vue.prototype.API_STATISTIC = 'https://magazyn-matech.netlify.app/api/statistic/';
Vue.prototype.API_LOG = 'https://magazyn-matech.netlify.app/api/auth/log';
Vue.prototype.API_AUTH = 'https://magazyn-matech.netlify.app/api/auth/';
Vue.prototype.API_ORDER_LIST = 'https://magazyn-matech.netlify.app/api/orderlist/';

Vue.prototype.NOTIFICATION_TEXT_SUCCESS = 'Udało się %s element %s';
Vue.prototype.NOTIFICATION_TEXT_ERROR = 'Nie udało się %s elementu %s';
Vue.prototype.NOTIFICATION_TEXT_CONFIRMATION = 'Jesteś pewny, że chcesz usunąć element';

const router = new VueRouter({
                                 routes: routes,
                                 mode: 'history'
                             })

new Vue({
            router: router,
            vuetify,
            store: store,
            render: h => h(App)
        }).$mount('#app')