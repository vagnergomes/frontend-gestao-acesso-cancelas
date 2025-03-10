import axios from 'axios';
//import { useNavigate } from 'react-router-dom';

//const navigate = useNavigate();

// Definição do Axios antes das chamadas
const api = axios.create({
    baseURL: "http://10.1.3.70:5001",
});

// Adicione os interceptores ANTES de qualquer requisição
api.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    async (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(

    (response) => response, // Passar as respostas válidas
    async (error) => {
        if (error.response && error.response.status === 401) {
            const refreshToken = localStorage.getItem("authToken");
            if (refreshToken) {
                try {
                    const result = await api.post('/user/refresh-token', { refreshToken: refreshToken });
                    localStorage.setItem("authToken", result.data.token);
                    const updatedConfig = { ...error.config };
                    error.config.headers.Authorization = `Bearer ${result.data.token}`;
                    return api.request(updatedConfig);
                } catch (refreshError) {
                   return Promise.reject("Erro ao renovar token de autenticação: " + refreshError)
                }
            } else {
                return Promise.reject("Usuário ou senha incorreto.")
            }
        }
        return Promise.reject(error);
    }
);


export default api;
