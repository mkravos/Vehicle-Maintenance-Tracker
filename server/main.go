package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/joho/godotenv"
	"github.com/mkravos/Vehicle-Maintenance-Tracker/api"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal(fmt.Errorf("could not load .env file: %v", err))
	}

	http.HandleFunc("/api/user/login", api.LoginHandler)
	http.HandleFunc("/api/user/register", api.RegistrationHandler)
	http.HandleFunc("/api/user/verify", api.VerifyHandler)

	log.Println("Server is running on port 8080")
	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal(fmt.Errorf("could not start server: %v", err))
	}
}
