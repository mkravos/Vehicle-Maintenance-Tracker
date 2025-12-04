package main

import (
	"log"
	"net/http"

	"github.com/joho/godotenv"
	"github.com/mkravos/Vehicle-Maintenance-Tracker/api"
	"github.com/mkravos/Vehicle-Maintenance-Tracker/database"
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
	mux.HandleFunc("/api/user/login", api.HandleLoginUser)
	mux.HandleFunc("/api/user/register", api.HandleRegisterUser)
	mux.HandleFunc("/api/user/verify", api.HandleVerifyUser)
	mux.HandleFunc("/api/user/update", api.AuthenticatedHandler(api.HandleUpdateUser))
	mux.HandleFunc("/api/user/delete", api.AuthenticatedHandler(api.HandleDeleteUser))
	mux.HandleFunc("/api/user/getId", api.AuthenticatedHandler(api.HandleGetUserId))
}

func main() {
	err := godotenv.Load() // loads the .env file into the Go environment
	if err != nil {
		log.Printf("could not load .env file: %v", err)
	}

	// Initialize the database connection
	err = database.InitDB()
	if err != nil {
		log.Fatal(err)
	}

	// Create a new HTTP request multiplexer to route incoming requests
	mux := http.NewServeMux()

	// Register endpoints
	RegisterUserAPI(mux)

	// Start the server
	log.Println("Server is running on port 8080")
	err = http.ListenAndServe(":8080", cors(mux))
	if err != nil {
		log.Fatalf("could not start server: %v", err)
	}
}
