import axios from 'axios';
//import { useNavigate } from 'react-router-dom';

//const navigate = useNavigate();

// Definição do Axios antes das chamadas
const api = axios.create({
    baseURL: "http://10.1.10.61:5001",
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
        console.log("Erro no request interceptor", error);
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
                    console.error("Falha ao renovar token:", refreshError);
                }
            } else {
                console.log("Refresh token ausente");
            }
        }
        return Promise.reject(error);
    }
);


export default api;
