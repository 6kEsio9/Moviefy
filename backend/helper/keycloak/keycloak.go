package keycloak

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"moviefy/main/helper/neshto"
	"moviefy/main/helper/queries"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

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

func (a *AuthService) createUser(password string, email string, username string) error {

	user := gocloak.User{
		Username:      gocloak.StringP(username),
		Email:         gocloak.StringP(email),
		EmailVerified: gocloak.BoolP(true),
		Enabled:       gocloak.BoolP(true),
		Credentials: &[]gocloak.CredentialRepresentation{
			{
				Type:      gocloak.StringP("password"),
				Value:     gocloak.StringP(password),
				Temporary: gocloak.BoolP(false),
			},
		},
	}

	fmt.Println(a.adminToken.AccessToken)
	userID, err := a.client.CreateUser(a.ctx, a.adminToken.AccessToken, a.config.KeycloakRealm, user)
	if err != nil {
		return err
	}

	error := queries.CreateUserInDB(username, email, userID, neshto.MovieDB)
	if error != nil {
		return error
	}

	return nil
}

func (a *AuthService) login(username, password string) (*queries.User, error) {
	token, err := a.client.Login(a.ctx, a.config.ClientID, a.config.ClientSecret, a.config.KeycloakRealm, username, password)
	if err != nil {
		return nil, fmt.Errorf("login failed: %w", err)
	}

	userInfo, err := a.client.GetUserInfo(a.ctx, token.AccessToken, a.config.KeycloakRealm)
	if err != nil {
		return nil, fmt.Errorf("failed to get user info: %w", err)
	}
	user := &queries.User{
		Token: neshto.LoginResponse{
			AccessToken:  token.AccessToken,
			RefreshToken: token.RefreshToken,
			ExpiresIn:    token.ExpiresIn,
			TokenType:    token.TokenType,
		},
	}

	error := queries.GetUser(*userInfo.Sub, user, neshto.MovieDB)

	if error != nil {
		return nil, nil
	}

	return user, nil
}

func (a *AuthService) refreshToken(refreshToken string) (*neshto.LoginResponse, error) {
	token, err := a.client.RefreshToken(a.ctx, refreshToken, a.config.ClientID, a.config.ClientSecret, a.config.KeycloakRealm)
	if err != nil {
		return nil, fmt.Errorf("token refresh failed: %w", err)
	}

	return &neshto.LoginResponse{
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

func (a *AuthService) getTokenAndInspect() error {

	token, err := a.client.GetToken(a.ctx, a.config.KeycloakRealm, gocloak.TokenOptions{
		ClientID:     gocloak.StringP("your-client-id"),
		ClientSecret: gocloak.StringP("your-client-secret"),
		Username:     gocloak.StringP("username"),
		Password:     gocloak.StringP("password"),
	})
	if err != nil {
		return err
	}

	_, claims, err := a.client.DecodeAccessToken(a.ctx, token.AccessToken, a.config.KeycloakRealm)
	if err != nil {
		return err
	}

	fmt.Printf("Token claims: %+v\n", claims)

	return nil
}

func SendErrorResponse(w http.ResponseWriter, statusCode int, message string) {
	w.Header().Set("Content-Type", "application/json")
	log.Println("status code : ", statusCode)
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(ErrorResponse{
		Error:   http.StatusText(statusCode),
		Message: message,
	})
}

func SendJSONResponse(w http.ResponseWriter, statusCode int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(data)
}

func (a *AuthService) shouldRefreshAdminToken() bool {
	if a.adminToken == nil {
		return true
	}

	expiryBuffer := time.Duration(5) * time.Minute
	expiryTime := time.Now().Add(expiryBuffer)

	tokenExpiry := time.Now().Add(time.Duration(a.adminToken.ExpiresIn) * time.Second)

	return tokenExpiry.Before(expiryTime)
}

func (a *AuthService) refreshAdminToken() error {
	if a.adminToken != nil && a.adminToken.RefreshToken != "" {
		newToken, err := a.client.RefreshToken(
			a.ctx,
			a.adminToken.RefreshToken,
			a.config.ClientID,
			a.config.ClientSecret,
			"master",
		)
		if err != nil {
			return fmt.Errorf(" Failed to  refresh admin token: %v", err)
		}
		a.adminToken = newToken
		return nil
	}

	adminToken, err := a.client.LoginAdmin(
		a.ctx,
		a.config.AdminUsername,
		a.config.AdminPassword,
		"master",
	)
	if err != nil {
		return err
	}

	a.adminToken = adminToken
	return nil
}

func (a *AuthService) GetValidAdminToken() (string, error) {
	if a.shouldRefreshAdminToken() {
		if err := a.refreshAdminToken(); err != nil {
			return "", err
		}
	}
	return a.adminToken.AccessToken, nil
}
func (a *AuthService) SetUserPassword(userID, newPassword string) error {

	err := a.client.SetPassword(a.ctx, a.adminToken.AccessToken, a.config.KeycloakRealm, userID, newPassword, false)
	if err != nil {
		return err
	}

	return nil
}
func (a *AuthService) LoselyGetAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		thereIsToken := true
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			thereIsToken = false
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			thereIsToken = false
		}

		claims, err := a.verifyToken(tokenString)
		if err != nil {
			thereIsToken = false
		}

		if thereIsToken {
			ctx := context.WithValue(r.Context(), "user_claims", claims)
			ctx = context.WithValue(ctx, "thereIsToke", thereIsToken)
			ctx = context.WithValue(ctx, "user_id", claims.Subject)
			ctx = context.WithValue(ctx, "username", claims.PreferredUsername)
			ctx = context.WithValue(ctx, "AuthService", a)

			next.ServeHTTP(w, r.WithContext(ctx))
			return
		}

		next.ServeHTTP(w, r)
	})
}

func (a *AuthService) AuthMiddleware(next http.Handler) http.Handler {

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			SendErrorResponse(w, http.StatusUnauthorized, "Authorization header required")
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			SendErrorResponse(w, http.StatusUnauthorized, "Bearer token required")
			return
		}

		claims, err := a.verifyToken(tokenString)
		if err != nil {
			SendErrorResponse(w, http.StatusUnauthorized, fmt.Sprintf("Invalid token: %v", err))
			return
		}

		ctx := context.WithValue(r.Context(), "user_claims", claims)
		ctx = context.WithValue(ctx, "user_id", claims.Subject)
		ctx = context.WithValue(ctx, "username", claims.PreferredUsername)
		ctx = context.WithValue(ctx, "AuthService", a)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (a *AuthService) AdminTokenMiddleware(next http.Handler) http.Handler {
	var mu sync.Mutex

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Println("SHould refresh token: ", a.shouldRefreshAdminToken())
		if a.shouldRefreshAdminToken() {
			mu.Lock()
			defer mu.Unlock()

			fmt.Println("ddddddddddddd")
			if a.shouldRefreshAdminToken() {
				if err := a.refreshAdminToken(); err != nil {
					fmt.Println("cccccccccc")
					SendErrorResponse(w, http.StatusInternalServerError, "Authentication not available")
					return
				}
				fmt.Println(time.Duration(a.adminToken.ExpiresIn) * time.Second)
				fmt.Println("aaaaaaaa")
			}
			fmt.Println("bbbbbbbbbb")
		}
		next.ServeHTTP(w, r)
	})
}

func (a *AuthService) LoginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		SendErrorResponse(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var loginReq LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&loginReq); err != nil {
		SendErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if loginReq.Username == "" || loginReq.Password == "" {
		SendErrorResponse(w, http.StatusBadRequest, "Username and password are required")
		return
	}

	response, err := a.login(loginReq.Username, loginReq.Password)
	if err != nil {
		SendErrorResponse(w, http.StatusUnauthorized, err.Error())
		return
	}
	fmt.Println(response)

	SendJSONResponse(w, http.StatusOK, response)
}

func (a *AuthService) RefreshHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		SendErrorResponse(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var refreshReq struct {
		RefreshToken string `json:"refresh_token"`
	}

	if err := json.NewDecoder(r.Body).Decode(&refreshReq); err != nil {
		SendErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if refreshReq.RefreshToken == "" {
		SendErrorResponse(w, http.StatusBadRequest, "Refresh token is required")
		return
	}

	response, err := a.refreshToken(refreshReq.RefreshToken)
	if err != nil {
		SendErrorResponse(w, http.StatusUnauthorized, err.Error())
		return
	}

	SendJSONResponse(w, http.StatusOK, response)
}

func (a *AuthService) RegisterHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		SendErrorResponse(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var registerBody struct {
		Password string `json:"password"`
		Email    string `json:"email"`
		Username string `json:"username"`
	}

	if err := json.NewDecoder(r.Body).Decode(&registerBody); err != nil {
		SendErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	//SHOULD CHECK WEATHER the email is formatted correctly
	if registerBody.Email == "" || registerBody.Password == "" || registerBody.Username == "" {
		SendErrorResponse(w, http.StatusBadRequest, "One or more fields are empty.")
		return
	}

	err := a.createUser(registerBody.Password, registerBody.Email, registerBody.Username)
	if err != nil {
		fmt.Println(err)
		SendErrorResponse(w, http.StatusBadRequest, "Got an error creating the user")
		return
	}

	SendJSONResponse(w, http.StatusOK, map[string]string{"message": "Regitered successfully"})
}

func (a *AuthService) LogoutHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		SendErrorResponse(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var logoutReq struct {
		RefreshToken string `json:"refresh_token"`
	}

	if err := json.NewDecoder(r.Body).Decode(&logoutReq); err != nil {
		SendErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if logoutReq.RefreshToken == "" {
		SendErrorResponse(w, http.StatusBadRequest, "Refresh token is required")
		return
	}

	if err := a.logout(logoutReq.RefreshToken); err != nil {
		SendErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	SendJSONResponse(w, http.StatusOK, map[string]string{"message": "Logged out successfully"})
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
