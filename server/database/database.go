package database

import (
	"fmt"
	"log"
	"sync"

	"go.etcd.io/bbolt"
)

var (
	db   *bbolt.DB
	once sync.Once
)

const (
	coreDB      = "core.db"
	usersBucket = "users"
)

// InitDB initializes the BoltDB database
func InitDB(dbPath string) error {
	var err error
	once.Do(func() {
		db, err = bbolt.Open(dbPath, 0600, nil)
		if err != nil {
			log.Fatal(fmt.Errorf("could not open db: %v", err))
		}
	})
	return err
}

// GetDB returns the database instance
func GetDB() *bbolt.DB {
	return db
}

// CreateBucket creates a new bucket in the database if it doesn't exist
func CreateBucket(bucketName string) error {
	return db.Update(func(tx *bbolt.Tx) error {
		_, err := tx.CreateBucketIfNotExists([]byte(bucketName))
		if err != nil {
			return fmt.Errorf("could not create bucket: %v", err)
		}
		return nil
	})
}

func init() {
	err := InitDB(coreDB)
	if err != nil {
		log.Fatal(fmt.Errorf("could not open db: %v", err))
	}
	err = CreateBucket(usersBucket)
	if err != nil {
		log.Fatal(fmt.Errorf("could not create bucket: %v", err))
	}
}
