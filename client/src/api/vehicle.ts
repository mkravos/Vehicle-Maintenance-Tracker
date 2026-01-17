import type { AxiosResponse } from "axios";
import instance, { type GenericResponse } from "./instance";

export type Vehicle = {
  id?: string;
  vehicle_name: string;
  model_year: number;
  make: string;
  model: string;
  mileage?: number;
  vin?: string;
};

export const addVehicle = async (
  userId: string,
  vehicle: Vehicle,
): Promise<AxiosResponse<GenericResponse>> => {
  return instance
    .post<GenericResponse>("/api/vehicle/add", { userId: userId, ...vehicle })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      if (err.response && err.response.status === 401) {
        return err.response;
      }
      throw err;
    });
};

export const listVehicles = async (
  userId: string,
): Promise<AxiosResponse<Vehicle[] | GenericResponse>> => {
  return instance
    .get<Vehicle[] | GenericResponse>(
      "/api/vehicle/list?userId=" + encodeURIComponent(userId),
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      if (err.response && err.response.status === 401) {
        return err.response;
      }
      throw err;
    });
};

export const updateVehicle = async (
  userId: string,
  vehicle: Vehicle,
): Promise<AxiosResponse<GenericResponse>> => {
  return instance
    .put<GenericResponse>("/api/vehicle/update", { userId: userId, ...vehicle })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      if (err.response && err.response.status === 401) {
        return err.response;
      }
      throw err;
    });
};

export const deleteVehicle = async (
  userId: string,
  vehicleId: string,
): Promise<AxiosResponse<GenericResponse>> => {
  const url = `/api/vehicle/delete?userId=${encodeURIComponent(userId)}&vehicleId=${encodeURIComponent(vehicleId)}`;

  return instance
    .delete<GenericResponse>(url)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      if (err.response && err.response.status === 401) {
        return err.response;
      }
      throw err;
    });
};
