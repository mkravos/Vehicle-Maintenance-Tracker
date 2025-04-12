package api

import (
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// Fetches the JWT secret from the Go environment
func getJwtSecret() []byte {
	return []byte(os.Getenv("JWT_SECRET"))
}

// AuthenticatedHandler wraps an HTTP handler and ensures the request is authenticated
// before passing it to the handler. If authentication fails, it returns an unauthorized response.
// Use this to protect any endpoints that require a user to be authenticated.
func AuthenticatedHandler(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if err := verifyToken(r.Header.Get("Authorization")); err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			fmt.Fprint(w, "Authorization token invalid or missing")
			return
		}

		next(w, r)
	}
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
	if tokenString == "" {
		return fmt.Errorf("no token provided")
	}

	tokenString = strings.TrimPrefix(tokenString, "Bearer ")

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
