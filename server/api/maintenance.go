package api

import (
	"encoding/json"
	"net/http"

	"github.com/mkravos/Vehicle-Maintenance-Tracker/database"
)

// HandleAddServiceItem handles the addition of a new maintenance service item to the database.
func HandleAddServiceItem(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: ErrMustUsePOSTRequest,
		})
		return
	}

	var serviceItem database.ServiceItem
	err := json.NewDecoder(r.Body).Decode(&serviceItem)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: ErrCouldNotDecodeJSON,
		})
		return
	}

	err = database.AddServiceItem(serviceItem.VehicleID, serviceItem)
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
		Message: "Service item added successfully",
	})
}

// HandleListServiceItems handles the retrieval of maintenance service items for a specific vehicle.
func HandleListServiceItems(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: ErrMustUseGETRequest,
		})
		return
	}

	vehicleID := r.URL.Query().Get("vehicle_id")
	if vehicleID == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: ErrParamVehicleIdMissing,
		})
		return
	}

	items, err := database.ListServiceItems(vehicleID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(items)
}

// HandleUpdateServiceItem handles the update of an existing maintenance service item in the database.
func HandleUpdateServiceItem(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPut {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: ErrMustUsePUTRequest,
		})
		return
	}

	var serviceItem database.ServiceItem
	err := json.NewDecoder(r.Body).Decode(&serviceItem)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: ErrCouldNotDecodeJSON,
		})
		return
	}

	err = database.UpdateServiceItem(serviceItem.ID, serviceItem)
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
		Message: "Service item updated successfully",
	})
}

// HandleDeleteServiceItem handles the deletion of a maintenance service item from the database.
func HandleDeleteServiceItem(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodDelete {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: ErrMustUseDELETERequest,
		})
		return
	}

	serviceItemID := r.URL.Query().Get("id")
	if serviceItemID == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: ErrParamServiceItemIdMissing,
		})
		return
	}

	err := database.DeleteServiceItem(serviceItemID)
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
		Message: "Service item deleted successfully",
	})
}
