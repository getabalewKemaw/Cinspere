// src/pages/Favorites.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";


const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  // ✅ Fetch favorites from backend
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("https://cinspherebackend-2.onrender.com/api/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(res.data);
      } catch (error) {
        console.error("❌ Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, []);

  // ✅ Toggle add/remove favorite
  const toggleFavorite = async (movie) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to manage favorites!");
      return;
    }

    try {
      const isFav = favorites.some((fav) => fav.movieId === movie.movieId);

      if (isFav) {
        await axios.delete("https://cinspherebackend-2.onrender.com/api/favorites/remove", {
          headers: { Authorization: `Bearer ${token}` },
          data: { movieId: movie.movieId },
        });
        setFavorites((prev) =>
          prev.filter((fav) => fav.movieId !== movie.movieId)
        );
      } else {
        await axios.post(
          "https://cinspherebackend-2.onrender.com/api/favorites/add",
          movie,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFavorites((prev) => [...prev, movie]);
      }
    } catch (error) {
      console.error("❌ Error toggling favorite:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">My Favorites</h2>

      {favorites.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {favorites.map((movie) => (
            <div
              key={movie.movieId}
              className="movie-card relative group cursor-pointer"
            >
              {/* ✅ Poster path same as in MovieCard */}
              <img
                src={
                  movie.posterPath
                    ? `https://image.tmdb.org/t/p/w500/${movie.posterPath}`
                    : "/no-movie.png"
                }
                alt={movie.title}
              />

              {/* ✅ Heart toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(movie);
                }}
                className="absolute top-3 right-3 text-3xl transition-transform transform hover:scale-110"
              >
                <Icon
                  icon={"mdi:heart"}
                  className="text-red-500"
                />
              </button>

              <div className="mt-4">
                <h3>{movie.title}</h3>
                <div className="content">
                  <div className="rating">
                    <img src="star.svg" alt="Star Icon" />
                    <p>{movie.rating ? movie.rating.toFixed(1) : "N/A"}</p>
                  </div>
                  <span>•</span>
                  <p className="year">
                    {movie.releaseDate
                      ? movie.releaseDate.split("-")[0]
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
