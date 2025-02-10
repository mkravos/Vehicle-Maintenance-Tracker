import instance from './instance';

export const login = async (username, password) => {
    return instance.post('/api/user/login', { username: username, password: password })
        .then((res) => {
            return res;
        })
        .catch((err) => {
            throw err;
        });
}

export const register = async (username, password) => {
    return instance.post('/api/user/register', { username: username, password: password })
        .then((res) => {
            return res;
        })
        .catch((err) => {
            throw err;
        });
}

export const verify = async (token) => {
    return instance.post('/api/user/verify', { token: token })
        .then((res) => {
            return res;
        })
        .catch((err) => {
            throw err;
        });
}