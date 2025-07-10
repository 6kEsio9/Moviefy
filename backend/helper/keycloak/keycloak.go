package keycloak

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/Nerzal/gocloak/v13"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
)

type Config struct {
	KeycloakURL   string
	KeycloakRealm string
	ClientID      string
	ClientSecret  string
	AdminUsername string
	AdminPassword string
	Port          string
}

type AuthService struct {
	client     *gocloak.GoCloak
	config     *Config
	ctx        context.Context
	adminToken *gocloak.JWT
}

type LoginResponse struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
	ExpiresIn    int    `json:"expiresIn"`
	TokenType    string `json:"tokenType"`
	UserId       string `json:"userId,omitempty"`
}

type ErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message"`
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// TODO: PROMENI TOVA DA E ISTINSKO
type TokenClaims struct {
	jwt.RegisteredClaims
	PreferredUsername string                 `json:"preferred_username"`
	Email             string                 `json:"email"`
	EmailVerified     bool                   `json:"email_verified"`
	Name              string                 `json:"name"`
	GivenName         string                 `json:"given_name"`
	FamilyName        string                 `json:"family_name"`
	ResourceAccess    map[string]interface{} `json:"resource_access"`
	RealmAccess       map[string]interface{} `json:"realm_access"`
	Groups            []string               `json:"groups"`
}

func LoadConfig() *Config {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	return &Config{
		KeycloakURL:   os.Getenv("KEYCLOAK_URL"),
		KeycloakRealm: os.Getenv("KEYCLOAK_REALM"),
		ClientID:      os.Getenv("KEYCLOAK_CLIENT_ID"),
		ClientSecret:  os.Getenv("KEYCLOAK_CLIENT_SECRET"),
		AdminUsername: os.Getenv("KEYCLOAK_ADMIN_USERNAME"),
		AdminPassword: os.Getenv("KEYCLOAK_ADMIN_PASSWORD"),
		Port:          os.Getenv("PORT"),
	}
}

func NewAuthService(config *Config) (*AuthService, error) {
	client := gocloak.NewClient(config.KeycloakURL)
	ctx := context.Background()

	adminToken, err := client.LoginAdmin(ctx, config.AdminUsername, config.AdminPassword, "master")
	if err != nil {
		return nil, fmt.Errorf("failed to login as admin: %w", err)
	}

	return &AuthService{
		client:     client,
		config:     config,
		ctx:        ctx,
		adminToken: adminToken,
	}, nil
}

func (a *AuthService) login(username, password string) (*LoginResponse, error) {
	token, err := a.client.Login(a.ctx, a.config.ClientID, a.config.ClientSecret, a.config.KeycloakRealm, username, password)
	if err != nil {
		return nil, fmt.Errorf("login failed: %w", err)
	}

	userInfo, err := a.client.GetUserInfo(a.ctx, token.AccessToken, a.config.KeycloakRealm)
	if err != nil {
		return nil, fmt.Errorf("failed to get user info: %w", err)
	}

	return &LoginResponse{
		AccessToken:  token.AccessToken,
		RefreshToken: token.RefreshToken,
		ExpiresIn:    token.ExpiresIn,
		TokenType:    token.TokenType,
		UserId:       *userInfo.Sub,
	}, nil
}

func (a *AuthService) refreshToken(refreshToken string) (*LoginResponse, error) {
	token, err := a.client.RefreshToken(a.ctx, refreshToken, a.config.ClientID, a.config.ClientSecret, a.config.KeycloakRealm)
	if err != nil {
		return nil, fmt.Errorf("token refresh failed: %w", err)
	}

	return &LoginResponse{
		AccessToken:  token.AccessToken,
		RefreshToken: token.RefreshToken,
		ExpiresIn:    token.ExpiresIn,
		TokenType:    token.TokenType,
	}, nil
}

func (a *AuthService) verifyToken(tokenString string) (*TokenClaims, error) {
	result, err := a.client.RetrospectToken(a.ctx, tokenString, a.config.ClientID, a.config.ClientSecret, a.config.KeycloakRealm)
	if err != nil {
		return nil, fmt.Errorf("token retrospection failed: %w", err)
	}

	if !*result.Active {
		return nil, fmt.Errorf("token is not active")
	}

	token, _, err := new(jwt.Parser).ParseUnverified(tokenString, &TokenClaims{})
	if err != nil {
		return nil, fmt.Errorf("failed to parse token: %w", err)
	}

	claims, ok := token.Claims.(*TokenClaims)
	if !ok {
		return nil, fmt.Errorf("invalid token claims")
	}

	return claims, nil
}

func (a *AuthService) logout(refreshToken string) error {
	return a.client.Logout(a.ctx, a.config.ClientID, a.config.ClientSecret, a.config.KeycloakRealm, refreshToken)
}

func (a *AuthService) sendErrorResponse(w http.ResponseWriter, statusCode int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(ErrorResponse{
		Error:   http.StatusText(statusCode),
		Message: message,
	})
}

func (a *AuthService) sendJSONResponse(w http.ResponseWriter, statusCode int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(data)
}

func (a *AuthService) AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			a.sendErrorResponse(w, http.StatusUnauthorized, "Authorization header required")
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			a.sendErrorResponse(w, http.StatusUnauthorized, "Bearer token required")
			return
		}

		claims, err := a.verifyToken(tokenString)
		if err != nil {
			a.sendErrorResponse(w, http.StatusUnauthorized, fmt.Sprintf("Invalid token: %v", err))
			return
		}

		ctx := context.WithValue(r.Context(), "user_claims", claims)
		ctx = context.WithValue(ctx, "user_id", claims.Subject)
		ctx = context.WithValue(ctx, "username", claims.PreferredUsername)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (a *AuthService) LoginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		a.sendErrorResponse(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var loginReq LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&loginReq); err != nil {
		a.sendErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if loginReq.Username == "" || loginReq.Password == "" {
		a.sendErrorResponse(w, http.StatusBadRequest, "Username and password are required")
		return
	}

	response, err := a.login(loginReq.Username, loginReq.Password)
	if err != nil {
		a.sendErrorResponse(w, http.StatusUnauthorized, err.Error())
		return
	}

	a.sendJSONResponse(w, http.StatusOK, response)
}

func (a *AuthService) RefreshHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		a.sendErrorResponse(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var refreshReq struct {
		RefreshToken string `json:"refresh_token"`
	}

	if err := json.NewDecoder(r.Body).Decode(&refreshReq); err != nil {
		a.sendErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if refreshReq.RefreshToken == "" {
		a.sendErrorResponse(w, http.StatusBadRequest, "Refresh token is required")
		return
	}

	response, err := a.refreshToken(refreshReq.RefreshToken)
	if err != nil {
		a.sendErrorResponse(w, http.StatusUnauthorized, err.Error())
		return
	}

	a.sendJSONResponse(w, http.StatusOK, response)
}

func (a *AuthService) LogoutHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		a.sendErrorResponse(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var logoutReq struct {
		RefreshToken string `json:"refresh_token"`
	}

	if err := json.NewDecoder(r.Body).Decode(&logoutReq); err != nil {
		a.sendErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if logoutReq.RefreshToken == "" {
		a.sendErrorResponse(w, http.StatusBadRequest, "Refresh token is required")
		return
	}

	if err := a.logout(logoutReq.RefreshToken); err != nil {
		a.sendErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	a.sendJSONResponse(w, http.StatusOK, map[string]string{"message": "Logged out successfully"})
}

func CorsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}
