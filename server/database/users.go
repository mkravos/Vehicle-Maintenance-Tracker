package database

import (
	"errors"
	"fmt"
	"net/mail"
	"strings"
	"unicode"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

const (
	ErrInvalidUsernameOrPass = "Invalid credentials provided"
)

func GetUserId(username string) (id string, err error) {
	err = database.QueryRow("SELECT id FROM user_account WHERE username = $1", username).Scan(&id)
	if err != nil {
		return "", fmt.Errorf("error querying user id: %v", err)
	}

	return id, err
}

// AddUser creates a new user account with the given username and password
func AddUser(username, password string) error {
	err := enforcePasswordComplexity(password)
	if err != nil {
		return err
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("failed to hash password: %v", err)
	}

	userExists := false
	err = database.QueryRow("SELECT EXISTS(SELECT 1 FROM user_account WHERE username = $1)", username).Scan(&userExists)
	if err != nil {
		return fmt.Errorf("error checking if user exists: %v", err)
	}
	if userExists {
		return fmt.Errorf("user %s already exists", username)
	}

	err = enforceUsernameIsEmailAddress(username)
	if err != nil {
		return err
	}

	_, err = database.Exec("INSERT INTO user_account (id, username, userkey) VALUES ($1, $2, $3)",
		uuid.New().String(), username, string(hashedPassword))
	if err != nil {
		return fmt.Errorf("failed to add user to database: %v", err)
	}

	return err
}

// ChangePassword updates the password for the given username after verifying the old password
func ChangePassword(username, oldPassword, newPassword string) error {
	err := enforcePasswordComplexity(newPassword)
	if err != nil {
		return err
	}

	if oldPassword == newPassword {
		return fmt.Errorf("new password cannot be the same as the old password")
	}

	err = VerifyPassword(username, oldPassword)
	if err != nil {
		return errors.New(ErrInvalidUsernameOrPass)
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("failed to hash new password: %v", err)
	}

	_, err = database.Exec("UPDATE user_account SET userkey=$1 WHERE username=$2",
		string(hashedPassword), username)
	if err != nil {
		return fmt.Errorf("failed to update password: %v", err)
	}

	return err
}

// ChangeUsername updates the username for the given account after verifying the password and checking for uniqueness
func ChangeUsername(username, password, newUsername string) error {
	err := VerifyPassword(username, password)
	if err != nil {
		return errors.New(ErrInvalidUsernameOrPass)
	}

	err = enforceUsernameIsEmailAddress(newUsername)
	if err != nil {
		return err
	}

	userExists := false
	err = database.QueryRow("SELECT EXISTS(SELECT 1 FROM user_account WHERE username = $1)", newUsername).Scan(&userExists)
	if err != nil {
		return fmt.Errorf("error checking if user exists: %v", err)
	}
	if userExists {
		return fmt.Errorf("username %s already exists", newUsername)
	}

	_, err = database.Exec("UPDATE user_account SET username=$1 WHERE username=$2",
		newUsername, username)
	if err != nil {
		return fmt.Errorf("failed to update username: %v", err)
	}

	return err
}

// DeleteAccount removes the user account after verifying the password
func DeleteAccount(username, password string) error {
	err := VerifyPassword(username, password)
	if err != nil {
		return errors.New(ErrInvalidUsernameOrPass)
	}

	err = DeleteAllUserVehicles(username)
	if err != nil {
		return fmt.Errorf("failed to delete all user vehicles: %v", err)
	}

	_, err = database.Exec("DELETE FROM user_account WHERE username=$1",
		username)
	if err != nil {
		return fmt.Errorf("failed to delete account: %v", err)
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

	err := database.QueryRow("SELECT userkey FROM user_account WHERE username = $1", username).Scan(&hashedPassword)
	if err != nil {
		return "", fmt.Errorf("error querying user: %v", err)
	}

	if hashedPassword == "" {
		return "", fmt.Errorf("user %s not found", username)
	}

	return hashedPassword, nil
}

func enforcePasswordComplexity(password string) error {
	specialChars := "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"
	hasUpper := false
	hasLower := false
	hasDigit := false
	hasSpecial := false
	minLength := 12

	if len(password) < minLength {
		return fmt.Errorf("complexity: password must be at least %d characters long", minLength)
	}

	for _, char := range password {
		if unicode.IsUpper(char) {
			hasUpper = true
		}
		if unicode.IsLower(char) {
			hasLower = true
		}
		if unicode.IsDigit(char) {
			hasDigit = true
		}
		if strings.ContainsRune(specialChars, char) {
			hasSpecial = true
		}
	}

	if !hasUpper || !hasLower || !hasDigit || !hasSpecial {
		return fmt.Errorf("complexity: password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character ($s)", specialChars)
	}

	return nil
}

func enforceUsernameIsEmailAddress(username string) error {
	addr, err := mail.ParseAddress(username)
	if err != nil || addr.Address != username {
		return fmt.Errorf("format: username must be a valid email address")
	}
	return nil
}
