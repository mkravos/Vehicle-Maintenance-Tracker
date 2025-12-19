package api

// GenericResponse represents a standard API response with success status and message
type GenericResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

// Error message constants
const (
	ErrMustUsePOSTRequest        = "Must use POST request"
	ErrMustUsePUTRequest         = "Must use PUT request"
	ErrMustUseDELETERequest      = "Must use DELETE request"
	ErrMustUseGETRequest         = "Must use GET request"
	ErrCouldNotDecodeJSON        = "Could not decode JSON request body"
	ErrInvalidRecaptcha          = "Invalid recaptcha response"
	ErrInvalidUsernameOrPass     = "Invalid credentials provided"
	ErrInvalidOrExpiredToken     = "Invalid or expired token"
	ErrCreatingJWTToken          = "Error creating JWT token"
	ErrParamActionMissing        = "Required body parameter 'action' was not provided in request"
	ErrParamUsernameMissing      = "Required body parameter 'username' was not provided in request"
	ErrParamPasswordMissing      = "Required body parameter 'password' was not provided in request"
	ErrParamNewUsernameMissing   = "Required body parameter 'newUsername' was not provided in request"
	ErrParamNewPasswordMissing   = "Required body parameter 'newPassword' was not provided in request"
	ErrParamUserIdMissing        = "Required URL parameter 'userId' was not provided in request"
	ErrParamVehicleIdMissing     = "Required URL parameter 'vehicleId' was not provided in request"
	ErrParamServiceItemIdMissing = "Required URL parameter 'serviceItemId' was not provided in request"
	ErrInvalidAction             = "Invalid action specified, must be either 'changeUsername' or 'changePassword'"
)
