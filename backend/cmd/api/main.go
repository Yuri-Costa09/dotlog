package main

import (
	"log"

	"github.com/Yuri-Costa09/dotlog/internal/infrastructure/config"
	"github.com/Yuri-Costa09/dotlog/internal/infrastructure/database"
	"github.com/gofiber/fiber/v3"
	"github.com/joho/godotenv"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func main() {
	cfg := config.Load()

	_, err := database.NewPostgresConnection(&cfg.DB)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	log.Printf("Database connected: %s@%s:%s/%s", cfg.DB.User, cfg.DB.Host, cfg.DB.Port, cfg.DB.Name)

	app := fiber.New()

	app.Listen(":" + cfg.AppPort)
}
