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

const token = localStorage.getItem("token");
token && (instance.defaults.headers.common['Authorization'] = `Bearer ${token}`);

export default instance;