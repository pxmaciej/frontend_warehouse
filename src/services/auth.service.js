import axios from 'axios';
const API_URL = 'http://127.0.0.1:8000/api/auth/';
class AuthService {
  login(user) {
    return axios
      .post(API_URL + 'login', {
        email: user.email,
        password: user.password
      })
      .then(response => {
        if (response.data.access_token) {
          localStorage.setItem('setToken', JSON.stringify(response.data.access_token));
        }
       
      });
  }
  logout() {
    this.store.commit('clearToken');
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