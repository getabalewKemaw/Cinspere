import React, { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";
import Tilt from "react-parallax-tilt"; // ✅ Import Tilt

const MovieCard = ({
  movie: { id, title, vote_average, poster_path, release_date, original_language },
  onClick,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // Check if movie is favorite
  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:5000/api/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const favExists = res.data.some((fav) => fav.movieId === id.toString());
        setIsFavorite(favExists);
      } catch (error) {
        console.error("❌ Error checking favorite:", error);
      }
    };

    checkFavorite();
  }, [id]);

  // Toggle favorite
  const toggleFavorite = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to manage favorites!");
      return;
    }

    try {
      if (isFavorite) {
        await axios.delete("http://localhost:5000/api/favorites/remove", {
          headers: { Authorization: `Bearer ${token}` },
          data: { movieId: id.toString() },
        });
        setIsFavorite(false);
      } else {
        await axios.post(
          "http://localhost:5000/api/favorites/add",
          {
            movieId: id.toString(),
            title,
            posterPath: poster_path,
            releaseDate: release_date,
            rating: vote_average,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("❌ Error toggling favorite:", error);
    }
  };

  return (
    <Tilt
      glareEnable={true}
      glareMaxOpacity={0.2}
      scale={1.05}
      transitionSpeed={250}
      className="movie-card cursor-pointer"
      tiltMaxAngleX={15}
      tiltMaxAngleY={15}
    >
      <div onClick={onClick} className="relative group">
        {/* Poster */}
        <img
          src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : "/no-movie.png"}
          alt={title}
          className="w-full h-80 object-cover rounded-lg shadow-md"
        />

        {/* Heart Icon */}
        {localStorage.getItem("token") && (
          <button
            onClick={toggleFavorite}
            className="absolute top-3 right-3 text-3xl transition-transform transform hover:scale-110"
          >
            <Icon
              icon={isFavorite ? "mdi:heart" : "mdi:heart-outline"}
              className={isFavorite ? "text-red-500" : "text-white"}
            />
          </button>
        )}

        {/* Movie Details */}
        <div className="mt-4">
          <h3 className="font-semibold">{title}</h3>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <div className="flex items-center gap-1">
              <img src="star.svg" alt="Star Icon" className="w-4 h-4" />
              <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
            </div>
            <span>•</span>
            <p>{original_language}</p>
            <span>•</span>
            <p>{release_date ? release_date.split("-")[0] : "N/A"}</p>
          </div>
        </div>
      </div>
    </Tilt>
  );
};

export default MovieCard;
