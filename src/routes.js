import Dashboard from './Dashboard'
import HelloWorld from './components/HelloWorld'
import Login from './Login'
import OrderList from "./OrderList";
import Product from "./Product";


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
    },
    {
        path : '/product/show/:product',
        name: 'product/show',
        component: Product,
        props: true
    }
];
