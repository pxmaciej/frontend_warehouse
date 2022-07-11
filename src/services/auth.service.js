import axios from 'axios';
const API_URL = 'http://localhost:8080/api/auth/';
class AuthService {
  login(user) {
    return axios
      .post(API_URL + 'login', {
        username: user.username,
        password: user.password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem('setToken', JSON.stringify(response.data));
        }
        return response.data;
      });
  }
  logout() {
    this.$store.commit('clearToken');
  }
  register(user) {
    return axios.post(API_URL + 'register', {
      username: user.username,
      email: user.email,
      password: user.password
    });
  }
}
export default new AuthService();