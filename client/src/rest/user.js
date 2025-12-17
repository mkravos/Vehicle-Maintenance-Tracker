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

// just a simple helper function that clears localstorage variables
export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
}

export const register = async (username, password, recaptchaToken) => {
    return instance.post('/api/user/register', { username: username, password: password, recaptchaToken: recaptchaToken })
        .then((res) => {
            return res;
        })
        .catch((err) => {
            if (err.response && err.response.status === 401) {
                return err.response;
            }
            throw err;
        });
}

export const verify = async (token) => {
    return instance.post('/api/user/verify', { token: token })
        .then((res) => {
            return res;
        })
        .catch((err) => {
            if (err.response && err.response.status === 401) {
                return err.response;
            }
            throw err;
        });
}

export const updateUser = async (action, username, password, newValue) => {
    let url = `/api/user/update?action=${encodeURIComponent(action)}&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

    // Add the appropriate parameter based on action
    if (action === 'changeUsername') {
        url += `&newUsername=${encodeURIComponent(newValue)}`;
    } else if (action === 'changePassword') {
        url += `&newPassword=${encodeURIComponent(newValue)}`;
    }

    return instance.put(url)
        .then((res) => {
            return res;
        })
        .catch((err) => {
            if (err.response && err.response.status === 401) {
                return err.response;
            }
            throw err;
        });
}

export const deleteUser = async (username, password) => {
    const url = `/api/user/delete?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

    return instance.delete(url)
        .then((res) => {
            return res;
        })
        .catch((err) => {
            if (err.response && err.response.status === 401) {
                return err.response;
            }
            throw err;
        });
}

export const getUserId = async (username) => {
    return instance.get('/api/user/getId?username=' + encodeURIComponent(username))
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
