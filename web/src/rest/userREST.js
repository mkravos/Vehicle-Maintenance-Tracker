import instance from './instance';

export const login = async (username, password, recaptchaToken) => {
    return instance.post('/api/user/login', { username: username, password: password, recaptchaToken: recaptchaToken })
        .then((res) => {
            return res;
        })
        .catch((err) => {
            if (err.response && err.response.status === 401) {
                return err.response;
            }
            throw err;
        })
}

export const register = async (username, password, recaptchaToken) => {
    return instance.post('/api/user/register', { username: username, password: password, recaptchaToken: recaptchaToken })
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