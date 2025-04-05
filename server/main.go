package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/joho/godotenv"
	"github.com/mkravos/Vehicle-Maintenance-Tracker/api"
)

func enableCors(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		h.ServeHTTP(w, r)
	})
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal(fmt.Errorf("could not load .env file: %v", err))
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/api/user/login", api.LoginHandler)
	mux.HandleFunc("/api/user/register", api.RegistrationHandler)
	mux.HandleFunc("/api/user/verify", api.VerifyHandler)

	handler := enableCors(mux)

	log.Println("Server is running on port 8080")
	err = http.ListenAndServe(":8080", handler)
	if err != nil {
		log.Fatal(fmt.Errorf("could not start server: %v", err))
	}
}
