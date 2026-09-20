import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MovieList from "../components/MovieList";
import { getMovies } from "../data/moviesData";

const MovieListPage = () => {
  const { genre } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMovies, setFilteredMovies] = useState([]);

  useEffect(() => {
    const allMovies = getMovies();

    let filteredByGenre = allMovies;
    if (genre) {
      filteredByGenre = allMovies.filter(
        (movie) => (movie.genre || "").toLowerCase() === genre.toLowerCase()
      );
    }

    const filteredBySearch = filteredByGenre.filter((movie) => {
      const title = (movie.title || "").toLowerCase();
      const description = (movie.description || "").toLowerCase();
      const term = searchTerm.toLowerCase();

      return title.includes(term) || description.includes(term);
    });

    setFilteredMovies(filteredBySearch);
  }, [genre, searchTerm]);

  return (
    <div className="movie-list-page">
      {/* Tiêu đề */}
      <h1>
        {genre
          ? `${genre.charAt(0).toUpperCase() + genre.slice(1)} Movies`
          : "All Movies"}
      </h1>

      {/* Trường tìm kiếm */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Hiển thị danh sách phim */}
      <div>
        {filteredMovies.length > 0 ? (
          <MovieList movies={filteredMovies} />
        ) : (
          <p>No movies found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default MovieListPage;
