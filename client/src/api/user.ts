import type { AxiosResponse } from 'axios';
import instance, { type GenericResponse } from './instance';

export type LoginResponse = {
    token: string;
};

export type UserIdResponse = {
    id: string;
};

export const login = async (
    username: string, 
    password: string, 
    recaptchaToken: string
): Promise<AxiosResponse<LoginResponse | GenericResponse>> => {
    return instance.post<LoginResponse | GenericResponse>('/api/user/login', { username: username, password: password, recaptchaToken: recaptchaToken })
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

export const register = async (
    username: string, 
    password: string, 
    recaptchaToken: string
): Promise<AxiosResponse<GenericResponse>> => {
    return instance.post<GenericResponse>('/api/user/register', { username: username, password: password, recaptchaToken: recaptchaToken })
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

export const verify = async (token: string): Promise<AxiosResponse<GenericResponse>> => {
    return instance.post<GenericResponse>('/api/user/verify', { token: token })
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

export const updateUser = async (
    action: string, 
    username: string, 
    password: string, 
    newValue: string
): Promise<AxiosResponse<GenericResponse>> => {
    let url = `/api/user/update?action=${encodeURIComponent(action)}`;
    let body = {};

    switch (action) {
        case 'changeUsername':
            body = {
                username: username,
                password: password,
                newUsername: newValue
            };
            break;
        case 'changePassword':
            body = {
                username: username,
                password: password,
                newPassword: newValue
            };
            break;
        default:
            throw new Error("invalid action supplied to updateUser call, must be: 'changePassword' or 'changeUsername'");
    }

    return instance.put<GenericResponse>(url, body)
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

export const deleteUser = async (
    username: string, 
    password: string
): Promise<AxiosResponse<GenericResponse>> => {
    const url = `/api/user/delete?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

    return instance.delete<GenericResponse>(url)
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

export const getUserId = async (username: string): Promise<AxiosResponse<UserIdResponse | GenericResponse>> => {
    return instance.get<UserIdResponse | GenericResponse>('/api/user/getId?username=' + encodeURIComponent(username))
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
