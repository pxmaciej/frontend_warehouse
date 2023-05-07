import Dashboard from './Dashboard'
import Login from './Login'
import OrderList from "./OrderList";
import Product from "./Product";
import ContactForm from "./ContactForm";
import Profile from "./Profile";


export const routes = [

    {
        path: '/',
        component: Dashboard,
    },
    {
        path: '/login',
        component: Login,
    },
    {
        path: '/dashboard',
        component: Dashboard,
    },
    {
        path: '/profile',
        component: Profile,
    },
    {
        path: '/orderList/:order',
        name: 'orderList',
        component: OrderList,
        props: true
    },
    {
        path: '/statistic/show/',
        name: 'product/show',
        component: Product,
        props: true
    },
    {
        path: '/contact',
        component: ContactForm,
    }

];
