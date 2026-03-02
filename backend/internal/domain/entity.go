package user

import (
	"errors"
	"strings"
	"time"

	"github.com/google/uuid"
)


type User struct {
	ID        uuid.UUID
	Username  string
	Email     string
	Password  string 
	CreatedAt time.Time
	UpdatedAt time.Time
}


func NewUser(username, email, hashedPassword string) (*User, error) {
	u := &User{
		ID:        uuid.New(),
		Username:  strings.TrimSpace(username),
		Email:     strings.ToLower(strings.TrimSpace(email)),
		Password:  hashedPassword,
		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
	}
	if err := u.Validate(); err != nil {
		return nil, err
	}
	return u, nil
}

.
func (u *User) Validate() error {
	if u.Username == "" {
		return errors.New("username is required")
	}
	if len(u.Username) < 3 {
		return errors.New("username must be at least 3 characters")
	}
	if u.Email == "" || !strings.Contains(u.Email, "@") {
		return errors.New("a valid email is required")
	}
	if u.Password == "" {
		return errors.New("password is required")
	}
	return nil
}
