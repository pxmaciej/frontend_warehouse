import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

export const store = new Vuex.Store( {
    state:{
        token: localStorage.getItem('auth')||'',
        userId: localStorage.getItem('id')||'',
        role: localStorage.getItem('role')||'',
        userdata: localStorage.getItem('user')||[],
        selected: localStorage.getItem('selected')||'',
        limit: localStorage.getItem('limit')||'',
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
        setUserData (state,userdata){
            localStorage.setItem('user',JSON.stringify(userdata));
            state.userdata = userdata;
        },
        setSelected (state,selected){
            localStorage.setItem('selected',selected );
            state.selected = selected;
        },
        setLimit (state, limit){
            localStorage.setItem('limit', limit);
            state.limit = limit;
        }
    }
})

