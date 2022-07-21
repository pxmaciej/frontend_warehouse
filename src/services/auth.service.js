import axios from 'axios'
import {store} from '../store'
const API_URL = 'http://127.0.0.1:8000/api/auth/'
class AuthService {
  login(user) {
    return axios
      .post(API_URL + 'login', {
        email: user.email,
        password: user.password
      })
      .then(response => {
        if (response.data.access_token) {
          store.commit('setToken', response.data.access_token);
        }
       
      });
  }
  logout() {
    store.commit('clearToken');
  }
  register(user) {
    return axios.post(API_URL + 'register', {
      username: user.username,
      email: user.email,
      password: user.password
    });
  }
  check(token){
   return axios
      .post(API_URL + 'checkToken', {
         token : token
      })
  }
}
export default new AuthService();