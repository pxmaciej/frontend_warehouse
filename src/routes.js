import Dashboard from './Dashboard'
import HelloWorld from './components/HelloWorld'
import Login from './Login'


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
    }
];
