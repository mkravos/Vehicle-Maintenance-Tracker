package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/mkravos/Vehicle-Maintenance-Tracker/database"
)

// User represents a user account with username, password, and recaptcha token for authentication
type User struct {
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

// Fetches the JWT secret from the Go environment
func getJwtSecret() []byte {
	return []byte(os.Getenv("JWT_SECRET"))
}

// Fetches the Recaptcha secret from the Go environment
func getRecaptchaSecret() string {
	return os.Getenv("RECAPTCHA_SECRET")
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

// VerifyHandler checks if a JWT token is valid and returns a 200 OK status if it is
func VerifyHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		fmt.Fprint(w, "Must use POST request")
		return
	}

	tokenString := r.Header.Get("Authorization")
	if tokenString == "" {
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Fprint(w, "Missing authorization header")
		return
	}
	tokenString = tokenString[len("Bearer "):]

	err := verifyToken(tokenString)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Fprint(w, "Invalid token")
		return
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprint(w, "Token is valid")
}

// createToken generates a JWT token for the given username with a 24-hour expiration
func createToken(username string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256,
		jwt.MapClaims{
			"username": username,
			"exp":      time.Now().Add(time.Hour * 24).Unix(),
		})

	tokenString, err := token.SignedString(getJwtSecret())
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// verifyToken checks if a JWT token is valid by parsing and validating it with the secret key
func verifyToken(tokenString string) error {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (any, error) {
		return getJwtSecret(), nil
	})

	if err != nil {
		return err
	}

	if !token.Valid {
		return fmt.Errorf("invalid token")
	}

	return nil
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
