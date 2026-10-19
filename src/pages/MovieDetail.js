import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchMovieById, updateMovie } from "../services/api";
import "./MovieDetail.css";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    fetchMovieById(id).then((foundMovie) => {
      if (foundMovie) {
        const newViews = (foundMovie.views || 0) + 1;
        setMovie({ ...foundMovie, views: newViews });
        updateMovie(foundMovie.id, { views: newViews });
      }
    });
  }, [id]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  const handleLike = () => {
    const currentLikes = movie.likes || 0;
    const newLikes = hasLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1;
    setMovie((prev) => ({ ...prev, likes: newLikes }));
    setHasLiked(!hasLiked);
    updateMovie(movie.id, { likes: newLikes });
  };

  const handleRating = (rating) => {
    setMovie((prev) => ({ ...prev, rating }));
    updateMovie(movie.id, { rating });
  };

  return (
    <div className="movie-detail">
      <h1>{movie.title}</h1>
      <img src={movie.image} alt={movie.title} />
      <p>{movie.description}</p>
      <p>Release Date: {movie.releaseDate}</p>
      <p>Views: {movie.views}</p>
      
      {/* Like Button */}
      <button className="btn-like" onClick={handleLike}>
        {hasLiked ? "Unlike" : "Like"} ({movie.likes})
      </button>

      {/* Rating Stars */}
      <div className="movie-rating">
        <p>Rating: {movie.rating || 0} / 5</p>
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            onClick={() => handleRating(star)}
            className={star <= movie.rating ? "filled" : ""}
          >
            ★
          </span>
        ))}
      </div>

      {movie.videoUrl.includes("youtube.com") ? (
        <iframe
          src={movie.videoUrl}
          title={movie.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <video controls>
          <source src={movie.videoUrl} type="video/mp4" />
          <track label="English" kind="subtitles" srcLang="en" src={movie.subtitleUrl} default />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default MovieDetail;
