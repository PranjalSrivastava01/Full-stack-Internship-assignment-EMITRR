package main

import (
	"log"
	"net/http"

	"exploding-kitens-game-backend/config"
	"exploding-kitens-game-backend/controllers"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	
)

func main() {
	config.InitRedis()

	r := mux.NewRouter()
	r.HandleFunc("/api/user", controllers.SetUser).Methods("POST")
	r.HandleFunc("/api/user/points", controllers.GetUserPoints).Methods("GET")
	r.HandleFunc("/api/user/points", controllers.UpdateUserPoints).Methods("PUT")
	r.HandleFunc("/api/user/points/all", controllers.GetAllUserPoints).Methods("GET")
	r.HandleFunc("/api/leaderboard", controllers.GetLeaderboard).Methods("GET")

	c := cors.AllowAll()
	handler := c.Handler(r)

	log.Println("Server started on port 8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
