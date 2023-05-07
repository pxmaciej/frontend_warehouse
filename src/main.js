import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import {routes} from './routes'
import vuetify from './plugins/vuetify'
import VeeValidate from 'vee-validate'
import {store} from './store'
import SmartTable from 'vuejs-smart-table'
import Notifications from 'vue-notification'

Vue.use(VeeValidate);
Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(SmartTable);
Vue.use(Notifications);

Vue.prototype.API_PRODUCT = 'http://127.0.0.1:8000/api/product/';
Vue.prototype.API_ORDER = 'http://127.0.0.1:8000/api/order/';
Vue.prototype.API_ALERT = 'http://127.0.0.1:8000/api/alert/';
Vue.prototype.API_CATEGORY = 'http://127.0.0.1:8000/api/category/';
Vue.prototype.API_STATISTIC = 'http://127.0.0.1:8000/api/statistic/';
Vue.prototype.API_LOGS = 'http://127.0.0.1:8000/api/auth/log';
Vue.prototype.API_AUTH = 'http://127.0.0.1:8000/api/auth/';
Vue.prototype.API_ORDER_LIST = 'http://127.0.0.1:8000/api/orderlist/';

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