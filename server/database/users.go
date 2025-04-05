package database

import (
	"fmt"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// AddUser creates a new user account with the given username and password
func AddUser(username string, password string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("failed to hash password: %v", err)
	}

	userExists := 0
	err = database.QueryRow("SELECT EXISTS(SELECT 1 FROM user_account WHERE username = ?)", username).Scan(&userExists)
	if err != nil {
		return fmt.Errorf("error checking if user exists: %v", err)
	}
	if userExists == 1 {
		return fmt.Errorf("user %s already exists", username)
	}

	_, err = database.Exec("INSERT INTO user_account (id, username, userkey) VALUES (?, ?, ?)",
		uuid.New().String(), username, string(hashedPassword))
	if err != nil {
		return fmt.Errorf("failed to add user to database: %v", err)
	}

	return err
}

// VerifyPassword checks if the provided password matches the stored hash for the given username
func VerifyPassword(username, providedPassword string) error {
	hashedPassword, err := getUserKey(username)
	if err != nil {
		return err
	}

	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(providedPassword))
}

// getUserKey retrieves the hashed password for a given username from the database
func getUserKey(username string) (string, error) {
	var hashedPassword string

	err := database.QueryRow("SELECT userkey FROM user_account WHERE username = ?", username).Scan(&hashedPassword)
	if err != nil {
		return "", fmt.Errorf("error querying user: %v", err)
	}

	if hashedPassword == "" {
		return "", fmt.Errorf("user %s not found", username)
	}

	return hashedPassword, nil
}
