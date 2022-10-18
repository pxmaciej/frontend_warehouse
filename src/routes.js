import Dashboard from './Dashboard'
import HelloWorld from './components/HelloWorld'
import Login from './Login'
import OrderList from "./OrderList";


export const routes = [

    {
        path : '/',
        component: HelloWorld,
    },
    {
        path : '/login',
        component: Login,
    },
    {
        path : '/dashboard',
        component: Dashboard,
    },
    {
        path : '/orderList/:order',
        name: 'orderList',
        component: OrderList,
        props: true
    }
];
