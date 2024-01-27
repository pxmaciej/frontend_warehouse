import axios from "axios";

const API_AUTH = 'http://127.0.0.1:8000/api/auth/';

export default {
    async isAuthenticated(vm) {
        if (vm.$store.state.token !== '') {
            try {
                const res = await axios.get(API_AUTH + 'refresh', {headers: {"Authorization": 'Bearer ' + vm.$store.state.token}}).then(res => {
                    vm.$store.commit('setToken', res.data.access_token);
                    vm.$store.commit('setUserRole', res.data.user.role);
                    vm.$store.commit('setUserId', res.data.user.id);
                    vm.$store.commit('setUserData', res.data.user);
                })
                if (res !== null) {
                    vm.$emit('isLogged');
                    return true;
                }
            } catch (err) {
                vm.$store.commit('clearToken');
                console.log(err.data)
                vm.$emit('isLoggedOut');
                await vm.$router.push('/login');
            }
        } else {
            vm.$emit('isLoggedOut');
            await vm.$router.push('/login');
        }
    }
}