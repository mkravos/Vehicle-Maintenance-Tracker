package api

import (
	"encoding/json"
	"net/http"

	"github.com/mkravos/Vehicle-Maintenance-Tracker/database"
)

type VehicleRequestBody struct {
	UserId string `json:"userId"`
	database.Vehicle
}

func HandleAddVehicle(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: ErrMustUsePOSTRequest,
		})
		return
	}

	var v VehicleRequestBody
	err := json.NewDecoder(r.Body).Decode(&v)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: ErrCouldNotDecodeJSON,
		})
		return
	}

	err = database.AddVehicle(v.UserId, v.Vehicle)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(GenericResponse{
		Success: true,
		Message: "Vehicle added successfully",
	})
}

func HandleListVehicles(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: ErrMustUseGETRequest,
		})
		return
	}

	userID := r.URL.Query().Get("userId")
	if userID == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: ErrParamUserIdMissing,
		})
		return
	}

	vehicles, err := database.ListVehicles(userID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(vehicles)
}

func HandleUpdateVehicle(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPut {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: ErrMustUsePUTRequest,
		})
		return
	}

	var v VehicleRequestBody
	err := json.NewDecoder(r.Body).Decode(&v)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: ErrCouldNotDecodeJSON,
		})
		return
	}

	err = database.UpdateVehicle(v.UserId, v.Vehicle)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(GenericResponse{
		Success: true,
		Message: "Vehicle updated successfully",
	})
}

func HandleDeleteVehicle(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodDelete {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: ErrMustUseDELETERequest,
		})
		return
	}

	userID := r.URL.Query().Get("userId")
	if userID == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: ErrParamUserIdMissing,
		})
		return
	}

	vehicleID := r.URL.Query().Get("vehicleId")
	if vehicleID == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: ErrParamVehicleIdMissing,
		})
		return
	}

	err := database.DeleteVehicle(userID, vehicleID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(GenericResponse{
		Success: true,
		Message: "Vehicle deleted successfully",
	})
}
