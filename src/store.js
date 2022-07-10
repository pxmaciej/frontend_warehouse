import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);


export const store = new Vuex.Store( {
    state:{
        token: localStorage.getItem('auth')||'',
        userdata: localStorage.getItem('user')||[],
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
        setUserData (state,userdata){
            localStorage.setItem('user',JSON.stringify(userdata));
            state.userdata = userdata;
        }
    }
})
