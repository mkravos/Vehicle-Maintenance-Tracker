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

// InitDB initializes the SQLite database
func InitDB(dbPath string) error {
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
		err = nil // ignore the error if the database has already been created
	}

	return err
}

// GetDB returns the database instance
func GetDB() *sql.DB {
	return database
}

func init() {
	err := InitDB(mainDB)
	if err != nil {
		log.Fatal(err)
	}
}
