import axios from 'axios';

// Ustaw podstawowy adres URL dla wszystkich zapytań Axios
axios.defaults.baseURL = 'https://magazyn.000.pe';

// Utwórz interceptor Axios do dodawania nagłówka CROS do każdego zapytania
axios.interceptors.request.use(config => {
  config.headers['Access-Control-Allow-Origin'] = 'https://magazyn-matech.netlify.app';
  return config;
});

// Przykładowe zapytanie
axios.get('/api/data')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });
