package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"exploding-kitens-game-backend/config"

	"github.com/go-redis/redis/v8"
)

func SetUser(w http.ResponseWriter, r *http.Request) {
	var data map[string]string
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	name := data["name"]
	exists, err := config.Rdb.Exists(r.Context(), name).Result()
	if err != nil {
		log.Println("Error checking if user exists:", err)
		http.Error(w, "Failed to check if user exists", http.StatusInternalServerError)
		return
	}

	if exists == 0 {
		err := config.Rdb.Set(r.Context(), name, 0, 0).Err()
		if err != nil {
			log.Println("Error setting points for new user:", err)
			http.Error(w, "Failed to set points for new user", http.StatusInternalServerError)
			return
		}
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("User points initialized successfully"))
}

func GetUserPoints(w http.ResponseWriter, r *http.Request) {
	name := r.URL.Query().Get("name")
	pointsStr, err := config.Rdb.Get(r.Context(), name).Result()
	if err == redis.Nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	} else if err != nil {
		log.Println("Error getting user points:", err)
		http.Error(w, "Failed to get user points", http.StatusInternalServerError)
		return
	}

	points, err := strconv.Atoi(pointsStr)
	if err != nil {
		log.Println("Error converting points to integer:", err)
		http.Error(w, "Failed to convert points to integer", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(points)
}

func UpdateUserPoints(w http.ResponseWriter, r *http.Request) {
	var data map[string]string
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	name := data["name"]
	currentPoints, err := config.Rdb.Get(r.Context(), name).Int()
	if err != nil && err != redis.Nil {
		log.Println("Error getting user points:", err)
		http.Error(w, "Failed to get user points", http.StatusInternalServerError)
		return
	}

	newPoints := currentPoints + 1
	err = config.Rdb.Set(r.Context(), name, newPoints, 0).Err()
	if err != nil {
		log.Println("Error updating user points:", err)
		http.Error(w, "Failed to update user points", http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"message": "User points updated successfully",
		"points":  newPoints,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func GetAllUserPoints(w http.ResponseWriter, r *http.Request) {
	keys := config.Rdb.Keys(r.Context(), "*").Val()
	userPointsMap := make(map[string]int)
	for _, key := range keys {
		pointsStr, err := config.Rdb.Get(r.Context(), key).Result()
		if err != nil && err != redis.Nil {
			log.Println("Error getting user points for key", key, ":", err)
			continue
		}

		points, err := strconv.Atoi(pointsStr)
		if err != nil {
			log.Println("Error parsing user points for key", key, ":", err)
			continue
		}

		userPointsMap[key] = points
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(userPointsMap)
}
