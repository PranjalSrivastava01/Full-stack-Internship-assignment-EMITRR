package config

import (
	"context"
	"log"
	"os"
	"github.com/go-redis/redis/v8"
	"github.com/joho/godotenv"
)

var Rdb *redis.Client

func InitRedis() {
	err:= godotenv.Load()
	Rdb = redis.NewClient(&redis.Options{
		Addr: os.Getenv("DB_USER")  ,
		Password: os.Getenv("DB_PASS"),
		DB:       0,
	})
	
	// Rdb = redis.NewClient(&redis.Options{
	// 	Addr:     "redis-11138.c9.us-east-1-4.ec2.redns.redis-cloud.com:11138",
	// 	Password: "ezItvY8nQ3HRMDkIub2RdXeqTaaPHlfN",
	// 	DB:       0,
	// })
	err = Rdb.Ping(context.Background()).Err()
	if err != nil {
		log.Fatalf("Could not connect to Redis: %v", err)
	} else {
		log.Println("Connected to Redis successfully!!")
	}
}
