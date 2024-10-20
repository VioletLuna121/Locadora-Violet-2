import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { useRouter } from 'vue-router';

const api = axios.create({ baseURL: 'https://livraria-api.altislabtech.com.br/' })

// Adiciona o token JWT em cada requisição se ele existir
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Busca o token armazenado no localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Adiciona o token ao cabeçalho Authorization
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Trata erros de resposta como autenticação falha (401)
api.interceptors.response.use(
  response => response,
  error => {
    const router = useRouter(); // Para redirecionar em caso de erro de autenticação
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token'); // Remove o token inválido ou expirado
      router.push('/login'); // Redireciona para a tela de login
    }
    return Promise.reject(error);
  }
);

export default boot(({ app }) => {

 app.config.globalProperties.$axios = axios
 app.config.globalProperties.$api = api


});


export { api }
