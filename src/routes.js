
import HelloWorld from './components/HelloWorld'
import Login from './components/Login'

export const routes = [

    {
        path : '/',
        component: HelloWorld,
    },
    {
        path : '/login',
        component: Login,
    }
];
