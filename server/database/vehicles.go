package database

import (
	"fmt"

	"github.com/google/uuid"
)

type Vehicle struct {
	ID          string  `json:"id"`
	VehicleName string  `json:"vehicle_name"`
	ModelYear   int     `json:"model_year"`
	Make        string  `json:"make"`
	Model       string  `json:"model"`
	Mileage     *int    `json:"mileage,omitempty"`
	VIN         *string `json:"vin,omitempty"`
}

// TODO: implement vehicle sharing system with different permission levels
const (
	PermissionVehicleOwner  = "owner"
	PermissionVehicleEditor = "editor"
	PermissionVehicleViewer = "viewer"
)

// AddVehicle adds a new vehicle to the database for the specified user
func AddVehicle(userID string, vehicle Vehicle) error {
	vehicleId := uuid.New().String()

	_, err := database.Exec(
		`INSERT INTO vehicle (id, vehicle_name, model_year, make, model, mileage, vin)
		 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		vehicleId, vehicle.VehicleName, vehicle.ModelYear, vehicle.Make,
		vehicle.Model, vehicle.Mileage, vehicle.VIN,
	)
	if err != nil {
		return fmt.Errorf("failed to add vehicle: %v", err)
	}

	_, err = database.Exec(
		`INSERT INTO user_vehicle (id, account_id, vehicle_id, permission)
		 VALUES ($1, $2, $3, $4)`,
		uuid.New().String(), userID, vehicleId, PermissionVehicleOwner,
	)
	if err != nil {
		database.Exec(
			`DELETE FROM vehicle WHERE id=$1`,
			vehicle.ID,
		)
		return fmt.Errorf("failed to link vehicle to user: %v", err)
	}

	return nil
}

// ListVehicles retrieves all vehicles associated with the specified user
func ListVehicles(userID string) ([]Vehicle, error) {
	rows, err := database.Query(
		`SELECT v.id, v.vehicle_name, v.model_year, v.make, v.model, v.mileage, v.vin
		 FROM vehicle v
		 INNER JOIN user_vehicle uv 
		 ON v.id = uv.vehicle_id WHERE uv.account_id = $1`,
		userID,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to get vehicles for user %s: %v", userID, err)
	}
	defer rows.Close()

	vehicles := []Vehicle{}
	for rows.Next() {
		var v Vehicle
		err := rows.Scan(&v.ID, &v.VehicleName, &v.ModelYear, &v.Make, &v.Model, &v.Mileage, &v.VIN)
		if err != nil {
			return nil, fmt.Errorf("failed to scan vehicle row: %v", err)
		}
		vehicles = append(vehicles, v)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating vehicle rows: %v", err)
	}

	return vehicles, nil
}

// UpdateVehicle updates the details of an existing vehicle for the specified user
func UpdateVehicle(userID string, vehicle Vehicle) error {
	// check if the vehicle belongs to the user
	_, err := database.Query(`SELECT 1 FROM user_vehicle WHERE account_id=$1 AND vehicle_id=$2`,
		userID, vehicle.ID,
	)
	if err != nil {
		return fmt.Errorf("vehicle %v does not belong to user %v: %v", vehicle.ID, userID, err)
	}

	_, err = database.Exec(
		`UPDATE vehicle SET vehicle_name=$1, model_year=$2, make=$3, model=$4, mileage=$5, vin=$6
		 WHERE id=$7`,
		vehicle.VehicleName, vehicle.ModelYear, vehicle.Make,
		vehicle.Model, vehicle.Mileage, vehicle.VIN,
		vehicle.ID,
	)

	if err != nil {
		return fmt.Errorf("failed to update vehicle: %v", err)
	}

	return nil
}

// DeleteVehicle removes a vehicle from the database for the specified user
func DeleteVehicle(userID string, vehicleID string) error {
	err := DeleteAllServiceItemsForVehicle(vehicleID)
	if err != nil {
		return fmt.Errorf("failed to delete all service items for vehicle: %v", err)
	}

	_, err = database.Exec(
		`DELETE FROM vehicle WHERE id=$1 AND account_id=$2`,
		vehicleID, userID,
	)
	if err != nil {
		return fmt.Errorf("failed to delete vehicle: %v", err)
	}

	return nil
}

// DeleteAllUserVehicles removes all vehicles associated with the specified user
func DeleteAllUserVehicles(userID string) error {
	rows, err := database.Query(
		`SELECT vehicle_id FROM user_vehicle WHERE account_id=$1`,
		userID,
	)
	if err != nil {
		return fmt.Errorf("failed to get vehicles for user %s: %v", userID, err)
	}
	defer rows.Close()

	for rows.Next() {
		var vehicleID string
		err := rows.Scan(&vehicleID)
		if err != nil {
			return fmt.Errorf("failed to scan vehicle id: %v", err)
		}

		err = DeleteAllServiceItemsForVehicle(vehicleID)
		if err != nil {
			return fmt.Errorf("failed to delete all service items for vehicle %s: %v", vehicleID, err)
		}
	}

	_, err = database.Exec(
		`DELETE FROM vehicle WHERE id IN (
			SELECT vehicle_id FROM user_vehicle WHERE account_id=$1
		)`,
		userID,
	)
	if err != nil {
		return fmt.Errorf("failed to delete vehicles for user %s: %v", userID, err)
	}

	return nil
}
