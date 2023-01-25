import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

export const store = new Vuex.Store( {
    state:{
        token: localStorage.getItem('auth')||'',
        userId: localStorage.getItem('id')||'',
        role: localStorage.getItem('role')||'',
        userData: localStorage.getItem('user')||[],
    },
    mutations : {
        setToken (state,token){
            localStorage.setItem('auth', token);
            state.token = token;
        },
        clearToken (state){
            localStorage.removeItem('auth');
            state.token = '';
        },
        setUserId (state,user){
            localStorage.setItem('id',user );
            state.userId = user;
        },
        setUserRole (state,role){
            localStorage.setItem('role',role );
            state.role = role;
        },
        setUserData (state,userData){
            localStorage.setItem('user',JSON.stringify(userData));
            state.userData = userData;
        }
    }
})

