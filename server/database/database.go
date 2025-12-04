package database

import (
	"database/sql"
	"fmt"
	"os"
	"strings"

	_ "github.com/lib/pq"
)

var database *sql.DB

const (
	migrations = "migrations.sql"
)

// GetDB returns the database instance
func GetDB() *sql.DB {
	return database
}

// InitDB initializes the PostgreSQL database
func InitDB() error {
	var err error

	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")
	sslmode := os.Getenv("DB_SSLMODE")

	connString := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		host, port, user, password, dbname, sslmode)

	database, err = sql.Open("postgres", connString)
	if err != nil {
		return fmt.Errorf("could not open db: %v", err)
	}

	// Test the connection
	if err = database.Ping(); err != nil {
		return fmt.Errorf("could not ping db: %v", err)
	}

	sqlBytes, err := os.ReadFile(migrations)
	if err != nil {
		return fmt.Errorf("could not read SQL schema file: %v", err)
	}

	create := string(sqlBytes)
	_, err = database.Exec(create)
	if err != nil {
		// Check if error is about table already existing (PostgreSQL error code 42P07)
		if strings.Contains(err.Error(), "already exists") || strings.Contains(err.Error(), "42P07") {
			err = nil // prevents fatal error from no-op if the database has already been created
		} else {
			return fmt.Errorf("could not execute migrations: %v", err)
		}
	}

	return err
}
