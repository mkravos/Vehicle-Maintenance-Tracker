package database

import (
	"fmt"

	"github.com/google/uuid"
)

type ServiceItem struct {
	ID            string  `json:"id"`
	VehicleID     string  `json:"vehicleId"`
	ItemName      string  `json:"itemName"`
	ServiceDate   string  `json:"serviceDate"`
	Mileage       int     `json:"mileage"`
	IntervalMiles *int    `json:"intervalMiles,omitempty"`
	IntervalTime  *string `json:"intervalTime,omitempty"`
	PartNumber    *string `json:"partNumber,omitempty"`
	Cost          *int    `json:"cost,omitempty"`
	ReceiptImage  *string `json:"receiptImage,omitempty"`
	Tracking      int     `json:"tracking"`
}

// AddServiceItem adds a new service item to the database for the specified vehicle
func AddServiceItem(vehicleID string, item ServiceItem) error {
	_, err := database.Exec(
		`INSERT INTO service_item (id, vehicle_id, item_name, service_date, mileage, interval_miles, interval_time, part_number, cost, receipt_image, tracking) 
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
		uuid.New().String(), vehicleID, item.ItemName, item.ServiceDate, item.Mileage, item.IntervalMiles,
		item.IntervalTime, item.PartNumber, item.Cost, item.ReceiptImage, item.Tracking,
	)

	if err != nil {
		return fmt.Errorf("failed to add service item: %v", err)
	}

	return nil
}

// ListServiceItems retrieves all service items for the specified vehicle
func ListServiceItems(vehicleID string) ([]ServiceItem, error) {
	rows, err := database.Query(
		`SELECT id, vehicle_id, item_name, service_date, mileage, interval_miles, interval_time, part_number, cost, receipt_image, tracking 
		 FROM service_item WHERE vehicle_id=$1 ORDER BY service_date DESC`,
		vehicleID,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to query service items: %v", err)
	}
	defer rows.Close()

	var serviceItems []ServiceItem
	for rows.Next() {
		var item ServiceItem
		err := rows.Scan(&item.ID, &item.VehicleID, &item.ItemName, &item.ServiceDate, &item.Mileage,
			&item.IntervalMiles, &item.IntervalTime, &item.PartNumber, &item.Cost, &item.ReceiptImage, &item.Tracking)
		if err != nil {
			return nil, fmt.Errorf("failed to scan service item: %v", err)
		}
		serviceItems = append(serviceItems, item)
	}

	return serviceItems, nil
}

// UpdateServiceItem updates an existing service item in the database
func UpdateServiceItem(itemID string, item ServiceItem) error {
	_, err := database.Exec(
		`UPDATE service_item 
		 SET item_name=$1, service_date=$2, mileage=$3, interval_miles=$4, interval_time=$5, part_number=$6, cost=$7, receipt_image=$8, tracking=$9
		 WHERE id=$10`,
		item.ItemName, item.ServiceDate, item.Mileage, item.IntervalMiles,
		item.IntervalTime, item.PartNumber, item.Cost, item.ReceiptImage, item.Tracking, itemID,
	)
	if err != nil {
		return fmt.Errorf("failed to update service item: %v", err)
	}
	return nil
}

// DeleteServiceItem removes a service item from the database
func DeleteServiceItem(itemID string) error {
	_, err := database.Exec(
		`DELETE FROM service_item WHERE id=$1`,
		itemID,
	)
	if err != nil {
		return fmt.Errorf("failed to delete service item: %v", err)
	}
	return nil
}

// DeleteAllServiceItemsForVehicle removes all service items from the database that are owned by the specified vehicle
func DeleteAllServiceItemsForVehicle(vehicleID string) error {
	_, err := database.Exec(
		`DELETE FROM service_item WHERE vehicle_id=$1`,
		vehicleID,
	)
	if err != nil {
		return fmt.Errorf("failed to delete service item: %v", err)
	}
	return nil
}
