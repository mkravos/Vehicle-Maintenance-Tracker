import instance from './instance';

export const addVehicle = async (userId, vehicle) => {
    return instance.post('/api/vehicle/add', { userId: userId, ...vehicle })
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

export const listVehicles = async (userId) => {
    return instance.get('/api/vehicle/list?userId=' + encodeURIComponent(userId))
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

export const updateVehicle = async (userId, vehicle) => {
    return instance.put('/api/vehicle/update', { userId: userId, ...vehicle })
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

export const deleteVehicle = async (userId, vehicleId) => {
    const url = `/api/vehicle/delete?userId=${encodeURIComponent(userId)}&vehicleId=${encodeURIComponent(vehicleId)}`;

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
