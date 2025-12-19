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

type UpdateUserRequestBody struct {
	Username    string `json:"username"`
	Password    string `json:"password,omitempty"`
	NewPassword string `json:"newPassword,omitempty"`
	NewUsername string `json:"newUsername,omitempty"`
}

// VerifyRecaptchaResponse represents the response structure from Google's reCAPTCHA verification API
type VerifyRecaptchaResponse struct {
	Success    bool      `json:"success"`
	Timestamp  time.Time `json:"challenge_ts"`
	Hostname   string    `json:"hostname"`
	ErrorCodes []string  `json:"error-codes"`
}

// LoginResponse represents the response structure for a successful login containing the JWT token
type LoginResponse struct {
	Token string `json:"token"`
}

// Fetches the Recaptcha secret from the Go environment
func getRecaptchaSecret() string {
	return os.Getenv("RECAPTCHA_SECRET")
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

// HandleLoginUser authenticates a user and returns a JWT token if credentials are valid
// after validating the recaptcha token.
func HandleLoginUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: ErrMustUsePOSTRequest,
		})
		return
	}

	var u User
	err := json.NewDecoder(r.Body).Decode(&u)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: ErrCouldNotDecodeJSON,
		})
		return
	}

	if _, err := verifyRecaptchaResponse(getRecaptchaSecret(), u.RecaptchaToken, nil); err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: ErrInvalidRecaptcha,
		})
		return
	}

	if err := database.VerifyPassword(u.Username, u.Password); err == nil {
		tokenString, err := createToken(u.Username)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(GenericResponse{
				Success: false,
				Message: ErrCreatingJWTToken,
			})
			return
		}
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(LoginResponse{
			Token: tokenString,
		})
	} else {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: ErrInvalidUsernameOrPass,
		})
	}
}

// HandleRegisterUser creates a new user account after validating the recaptcha token
func HandleRegisterUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: ErrMustUsePOSTRequest,
		})
		return
	}

	var u User
	err := json.NewDecoder(r.Body).Decode(&u)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: ErrCouldNotDecodeJSON,
		})
		return
	}

	if _, err := verifyRecaptchaResponse(getRecaptchaSecret(), u.RecaptchaToken, nil); err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: ErrInvalidRecaptcha,
		})
		return
	}

	if err := database.AddUser(u.Username, u.Password); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: fmt.Sprintf("Error creating user: %v", err),
		})
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(GenericResponse{
		Success: true,
		Message: "User account created successfully",
	})
}

// HandleVerifyUser checks if a JWT token is valid and returns a 200 OK status if it is.
// Used only for checking user access to private section on frontend.
func HandleVerifyUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: ErrMustUsePOSTRequest,
		})
		return
	}

	if err := verifyToken(r.Header.Get("Authorization")); err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: ErrInvalidOrExpiredToken,
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(GenericResponse{
		Success: true,
		Message: "LGTM",
	})
}

// HandleUpdateUser updates a user's username or password based on the provided action parameter
func HandleUpdateUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPut {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: ErrMustUsePUTRequest,
		})
		return
	}

	action := r.URL.Query().Get("action")
	if action == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: ErrParamActionMissing,
		})
		return
	}

	var u UpdateUserRequestBody
	err := json.NewDecoder(r.Body).Decode(&u)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: ErrCouldNotDecodeJSON,
		})
	}

	if u.Username == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: ErrParamUsernameMissing,
		})
	}

	if u.Password == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: ErrParamPasswordMissing,
		})
	}

	switch action {
	case "changeUsername":
		if u.NewUsername == "" {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(GenericResponse{
				Success: false,
				Message: ErrParamNewUsernameMissing,
			})
		}
		if err = database.ChangeUsername(u.Username, u.Password, u.NewUsername); err == nil {
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(GenericResponse{
				Success: true,
				Message: "Username updated",
			})
		} else {
			err = fmt.Errorf("error updating username: %v", err)
		}
	case "changePassword":
		if u.NewPassword == "" {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(GenericResponse{
				Success: false,
				Message: ErrParamNewPasswordMissing,
			})
		}
		if err = database.ChangePassword(u.Username, u.Password, u.NewPassword); err == nil {
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(GenericResponse{
				Success: true,
				Message: "Password updated",
			})
		} else {
			err = fmt.Errorf("error updating password: %v", err)
		}
	default:
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: ErrInvalidAction,
		})
	}

	if err != nil {
		if strings.Contains(err.Error(), ErrInvalidUsernameOrPass) {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(GenericResponse{
				Success: false,
				Message: ErrInvalidUsernameOrPass,
			})
		} else {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(GenericResponse{
				Success: false,
				Message: err.Error(),
			})
		}
	}
}

// HandleDeleteUser deletes a user account after verifying the username and password
func HandleDeleteUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodDelete {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: ErrMustUseDELETERequest,
		})
		return
	}

	username := r.URL.Query().Get("username")
	if username == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: ErrParamUsernameMissing,
		})
		return
	}

	password := r.URL.Query().Get("password")
	if password == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: ErrParamPasswordMissing,
		})
		return
	}

	if err := database.DeleteAccount(username, password); err == nil {
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: true,
			Message: "User account deleted successfully",
		})
	} else {
		if strings.Contains(err.Error(), ErrInvalidUsernameOrPass) {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(GenericResponse{
				Success: false,
				Message: ErrInvalidUsernameOrPass,
			})
		} else {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(GenericResponse{
				Success: false,
				Message: fmt.Sprintf("Error deleting user account: %v", err),
			})
		}
	}
}

// HandleGetUserId retrieves the ID of a given user by providing their username
func HandleGetUserId(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: ErrMustUseGETRequest,
		})
		return
	}

	username := r.URL.Query().Get("username")
	if username == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: ErrParamUsernameMissing,
		})
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
		json.NewEncoder(w).Encode(GenericResponse{
			Success: false,
			Message: fmt.Sprintf("Error retrieving user ID: %v", err),
		})
	}
}
