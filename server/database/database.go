package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"strings"

	_ "github.com/mattn/go-sqlite3"
)

var database *sql.DB

const (
	mainDB     = "main.db"
	migrations = "migrations.sql"
)

// GetDB returns the database instance
func GetDB() *sql.DB {
	return database
}

// InitDB initializes the SQLite database
func initDB(dbPath string) error {
	var err error

	database, err = sql.Open("sqlite3", dbPath)
	if err != nil {
		return fmt.Errorf("could not open db: %v", err)
	}

	sqlBytes, err := os.ReadFile(migrations)
	if err != nil {
		return fmt.Errorf("could not read SQL schema file: %v", err)
	}

	create := string(sqlBytes)
	_, err = database.Exec(create)
	if strings.Contains(err.Error(), "already exists") {
		err = nil // prevents fatal error from no-op if the database has already been created
	}

	return err
}

func init() {
	// Initialize the database, exiting the program if there is any error
	err := initDB(mainDB)
	if err != nil {
		log.Fatal(err)
	}
}
