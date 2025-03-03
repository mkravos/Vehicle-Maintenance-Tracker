package database

import (
	"fmt"

	"go.etcd.io/bbolt"
	"golang.org/x/crypto/bcrypt"
)

func AddUser(username string, password string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("failed to hash password: %v", err)
	}

	exists := false
	err = db.View(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte(usersBucket))
		if b == nil {
			return fmt.Errorf("bucket %s not found", usersBucket)
		}

		exists = b.Get([]byte(username)) != nil
		return nil
	})
	if err != nil {
		return fmt.Errorf("error checking if user exists: %v", err)
	}
	if exists {
		return fmt.Errorf("user %s already exists", username)
	}

	return db.Update(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte(usersBucket))
		if b == nil {
			return fmt.Errorf("bucket %s not found", usersBucket)
		}

		return b.Put([]byte(username), hashedPassword)
	})
}

func VerifyPassword(username, providedPassword string) error {
	hashedPassword, err := getUser(username)
	if err != nil {
		return err
	}

	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(providedPassword))
}

func getUser(username string) (string, error) {
	var hashedPassword string
	err := db.View(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte(usersBucket))
		if b == nil {
			return fmt.Errorf("bucket %s not found", usersBucket)
		}

		hashedPassword = string(b.Get([]byte(username)))
		return nil
	})
	if err != nil {
		return "", err
	}

	return hashedPassword, nil
}
