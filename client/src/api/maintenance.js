import instance from './instance';

export const addServiceItem = async (vehicleId, serviceItem) => {
    return instance.post('/api/maintenance/add', { vehicleId: vehicleId, ...serviceItem })
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

export const listServiceItems = async (vehicleId) => {
    return instance.get('/api/maintenance/list?vehicle_id=' + encodeURIComponent(vehicleId))
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

export const updateServiceItem = async (serviceItem) => {
    return instance.put('/api/maintenance/update', serviceItem)
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

export const deleteServiceItem = async (serviceItemId) => {
    const url = `/api/maintenance/delete?id=${encodeURIComponent(serviceItemId)}`;

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
