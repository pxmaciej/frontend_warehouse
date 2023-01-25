import axios from "axios";

const API_AUTH = 'http://127.0.0.1:8000/api/auth/';

export default {
    async isAuthenticated(vm) {
        if (vm.$store.state.token !== '') {
            try {
                const res = await axios.post(API_AUTH + 'checkToken', {
                    token: vm.$store.state.token,
                })
                if (res.data.success) {
                    vm.$emit('isLogged');
                    return true;
                }
            } catch (err) {
                vm.$store.commit('clearToken');
                console.log(err.data);
                vm.$emit('isLoggedOut');
                await vm.$router.push('/login');
            }
        } else {
            vm.$emit('isLoggedOut');
            await vm.$router.push('/login');
        }
    }
}