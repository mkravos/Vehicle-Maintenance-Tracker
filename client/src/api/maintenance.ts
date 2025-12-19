import type { AxiosResponse } from 'axios';
import instance, { type GenericResponse } from './instance';

export type ServiceItem = {
    id?: string;
    vehicleId: string;
    itemName: string;
    serviceDate: string;
    mileage: number;
    intervalMiles?: number;
    intervalTime?: string;
    partNumber?: string;
    cost?: number;
    receiptImage?: string;
    tracking: number;
};

export const addServiceItem = async (serviceItem: ServiceItem): Promise<AxiosResponse<GenericResponse>> => {
    return instance.post<GenericResponse>('/api/maintenance/add', { ...serviceItem })
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

export const listServiceItems = async (vehicleId: string): Promise<AxiosResponse<ServiceItem[] | GenericResponse>> => {
    return instance.get<ServiceItem[]>('/api/maintenance/list?vehicle_id=' + encodeURIComponent(vehicleId))
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

export const updateServiceItem = async (serviceItem: ServiceItem): Promise<AxiosResponse<GenericResponse>> => {
    return instance.put<GenericResponse>('/api/maintenance/update', serviceItem)
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

export const deleteServiceItem = async (serviceItemId: string): Promise<AxiosResponse<GenericResponse>> => {
    const url = `/api/maintenance/delete?id=${encodeURIComponent(serviceItemId)}`;

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
