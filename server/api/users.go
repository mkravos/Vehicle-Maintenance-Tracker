package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/mkravos/Vehicle-Maintenance-Tracker/database"
)

// User represents a user account with username, password, and recaptcha token for authentication
type User struct {
	Id             string `json:"id"`
	Username       string `json:"username"`
	Password       string `json:"password"`
	RecaptchaToken string `json:"recaptchaToken"`
}

// VerifyRecaptchaResponse represents the response structure from Google's reCAPTCHA verification API
type VerifyRecaptchaResponse struct {
	Success    bool      `json:"success"`
	Timestamp  time.Time `json:"challenge_ts"`
	Hostname   string    `json:"hostname"`
	ErrorCodes []string  `json:"error-codes"`
}

// Fetches the Recaptcha secret from the Go environment
func getRecaptchaSecret() string {
	return os.Getenv("RECAPTCHA_SECRET")
}

// GetUserIdHandler retrieves the ID of a given user by providing their username
func GetUserIdHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		fmt.Fprint(w, "Must use GET request")
		return
	}

	username := r.URL.Query().Get("username")
	if username == "" {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, "Required URL parameter 'username' was not provided in request")
		return
	}

	type UserIDResponse struct {
		Id string `json:"id"`
	}

	if userId, err := database.GetUserId(username); err == nil {
		user := UserIDResponse{
			Id: userId,
		}
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(user)
	} else {
		w.WriteHeader(http.StatusNotFound)
		fmt.Fprintf(w, "User not found: %v", err)
	}
}

// RegistrationHandler creates a new user account after validating the recaptcha token
func RegistrationHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		fmt.Fprint(w, "Must use POST request")
		return
	}

	var u User
	err := json.NewDecoder(r.Body).Decode(&u)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, "Could not decode user JSON")
		return
	}

	if _, err := verifyRecaptchaResponse(getRecaptchaSecret(), u.RecaptchaToken, nil); err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Fprint(w, "Invalid recaptcha response", err)
		return
	}

	if err := database.AddUser(u.Username, u.Password); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, "Error creating user")
		return
	}

	w.WriteHeader(http.StatusCreated)
	fmt.Fprint(w, "User created")
}

// LoginHandler authenticates a user and returns a JWT token if credentials are valid
// after validating the recaptcha token.
func LoginHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		fmt.Fprint(w, "Must use POST request")
		return
	}

	var u User
	err := json.NewDecoder(r.Body).Decode(&u)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, "Could not decode user JSON")
		return
	}

	if _, err := verifyRecaptchaResponse(getRecaptchaSecret(), u.RecaptchaToken, nil); err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Fprint(w, "Invalid recaptcha response", err)
		return
	}

	if err := database.VerifyPassword(u.Username, u.Password); err == nil {
		tokenString, err := createToken(u.Username)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprint(w, "Error creating token")
			return
		}
		w.WriteHeader(http.StatusOK)
		fmt.Fprint(w, tokenString)
	} else {
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Fprint(w, "Invalid credentials")
	}
}

// VerifyHandler checks if a JWT token is valid and returns a 200 OK status if it is.
// Used only for checking user access to private section on frontend.
func VerifyHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		fmt.Fprint(w, "Must use POST request")
		return
	}

	if err := verifyToken(r.Header.Get("Authorization")); err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Fprint(w, "Authorization token invalid or missing")
		return
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprint(w, "Token is valid")
}

// verifyRecaptchaResponse validates a reCAPTCHA token by sending it to Google's verification API
func verifyRecaptchaResponse(secret string, responseToken string, remoteIP *string) (*VerifyRecaptchaResponse, error) {
	data := url.Values{}
	data.Set("secret", secret)
	data.Set("response", responseToken)
	if remoteIP != nil {
		data.Set("remoteip", *remoteIP)
	}
	requestBody := strings.NewReader(data.Encode())

	var response VerifyRecaptchaResponse
	resp, err := http.Post("https://www.google.com/recaptcha/api/siteverify", "application/x-www-form-urlencoded", requestBody)
	if err != nil {
		return nil, err
	}

	err = json.NewDecoder(resp.Body).Decode(&response)
	if err != nil {
		return nil, err
	}

	if !response.Success {
		return nil, fmt.Errorf("recaptcha verification failed")
	}

	return &response, nil
}
