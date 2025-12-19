import axios from 'axios';

// production enivorment
let URL = "https://localhost:8080";

// local dev enivorment
if (window.location.hostname === "localhost" && window.location.port === "3000") {
    URL = "http://" + "localhost:8080";
}

const instance = axios.create({
    baseURL: URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor - attach token to every request
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default instance;