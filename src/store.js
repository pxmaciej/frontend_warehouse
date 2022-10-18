import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

export const store = new Vuex.Store( {
    state:{
        token: localStorage.getItem('auth')||'',
        user: localStorage.getItem('id')||'',
        role: localStorage.getItem('role')||'',
        userdata: localStorage.getItem('user')||[],
        selected: localStorage.getItem('selected')||'',
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
            state.user = user;
        },
        setUserRole (state,role){
            localStorage.setItem('role',role );
            state.role = role;
        },
        setUserData (state,userdata){
            localStorage.setItem('user',JSON.stringify(userdata));
            state.userdata = userdata;
        },
        setSelected (state,selected){
            localStorage.setItem('selected',selected );
            state.selected = selected;
        }
    }
})

