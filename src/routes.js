import Dashboard from './Dashboard'
import HelloWorld from './components/HelloWorld'
import Login from './Login'
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
        path : '/product',
        component: Product,
    }
];
