package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/joho/godotenv"
	"github.com/mkravos/Vehicle-Maintenance-Tracker/api"
)

// cors is a middleware that adds CORS headers to allow cross-origin requests
func cors(h http.Handler) http.Handler {
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

// RegisterUserAPI sets up the API endpoints for user authentication and verification
func RegisterUserAPI(mux *http.ServeMux) {
	mux.HandleFunc("/api/user/login", api.LoginHandler)
	mux.HandleFunc("/api/user/register", api.RegistrationHandler)
	mux.HandleFunc("/api/user/verify", api.VerifyHandler)
	mux.HandleFunc("/api/user/getId", api.AuthenticatedHandler(api.GetUserIdHandler))
}

func main() {
	err := godotenv.Load() // loads the .env file into the Go environment
	if err != nil {
		log.Fatal(fmt.Errorf("could not load .env file: %v", err))
	}

	// Create a new HTTP request multiplexer to route incoming requests
	mux := http.NewServeMux()

	// Register endpoints
	RegisterUserAPI(mux)

	// Start the server
	log.Println("Server is running on port 8080")
	err = http.ListenAndServe(":8080", cors(mux))
	if err != nil {
		log.Fatal(fmt.Errorf("could not start server: %v", err))
	}
}
