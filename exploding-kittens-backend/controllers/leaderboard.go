package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"sort"
	"strconv"
	"exploding-kitens-game-backend/config"
	"exploding-kitens-game-backend/models"
	"github.com/go-redis/redis/v8"
)

func GetLeaderboard(w http.ResponseWriter, r *http.Request) {
	keys := config.Rdb.Keys(r.Context(), "*").Val()
	leaderboard := make([]models.UserData, len(keys))
	for i, key := range keys {
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

		leaderboard[i] = models.UserData{
			Username: key,
			Points:   points,
		}
	}

	sort.Slice(leaderboard, func(i, j int) bool {
		return leaderboard[i].Points > leaderboard[j].Points
	})

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(leaderboard)
}
