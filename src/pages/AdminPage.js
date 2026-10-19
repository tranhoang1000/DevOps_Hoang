import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMovies, createMovie, updateMovie, deleteMovie } from "../services/api";

const AdminPage = ({ loggedInUser }) => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState({
    title: "",
    genre: "",
    description: "",
    releaseDate: "",
    image: "",
    videoUrl: "",
    subtitleUrl: "",
  });
  const [editMovie, setEditMovie] = useState(null);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    const list = await fetchMovies();
    setMovies(list);
  };

  if (!loggedInUser?.isAdmin) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Bạn cần đăng nhập với tài khoản Admin để quản lý phim.</h2>
        <button onClick={() => navigate("/authform")}>Đăng nhập Admin</button>
      </div>
    );
  }

  const handleAddMovie = async () => {
    if (
      !newMovie.title ||
      !newMovie.genre ||
      !newMovie.description ||
      !newMovie.releaseDate ||
      !newMovie.image ||
      !newMovie.videoUrl
    ) {
      alert("Vui lòng điền đầy đủ thông tin phim.");
      return;
    }
    await createMovie(newMovie);
    await loadMovies();
    setNewMovie({
      title: "",
      genre: "",
      description: "",
      releaseDate: "",
      image: "",
      videoUrl: "",
      subtitleUrl: "",
    });
    alert("Thêm phim thành công!");
  };

  const handleDeleteMovie = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa phim này?")) {
      await deleteMovie(id);
      await loadMovies();
    }
  };

  const handleEditMovie = (movie) => {
    setEditMovie(movie);
    setNewMovie({
      title: movie.title,
      genre: movie.genre,
      description: movie.description,
      releaseDate: movie.releaseDate,
      image: movie.image,
      videoUrl: movie.videoUrl,
      subtitleUrl: movie.subtitleUrl,
    });
  };

  const handleUpdateMovie = async () => {
    if (
      !newMovie.title ||
      !newMovie.genre ||
      !newMovie.description ||
      !newMovie.releaseDate ||
      !newMovie.image ||
      !newMovie.videoUrl
    ) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    await updateMovie(editMovie.id, newMovie);
    await loadMovies();
    setNewMovie({
      title: "",
      genre: "",
      description: "",
      releaseDate: "",
      image: "",
      videoUrl: "",
      subtitleUrl: "",
    });
    setEditMovie(null);
    alert("Cập nhật phim thành công!");
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <p className="admin-subtitle">Dashboard</p>
          <h1>Quản lý phim</h1>
        </div>
        <button className="btn-secondary" onClick={() => navigate("/")}>
          Về trang chủ
        </button>
      </div>

      <div className="admin-panel">
        <h2>{editMovie ? "Cập nhật phim" : "Thêm phim mới"}</h2>
        <div className="admin-form-grid">
          <input
            type="text"
            placeholder="Tiêu đề phim"
            value={newMovie.title}
            onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Thể loại"
            value={newMovie.genre}
            onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}
          />
          <input
            type="text"
            placeholder="Ngày phát hành"
            value={newMovie.releaseDate}
            onChange={(e) =>
              setNewMovie({ ...newMovie, releaseDate: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="URL hình ảnh"
            value={newMovie.image}
            onChange={(e) => setNewMovie({ ...newMovie, image: e.target.value })}
          />
          <input
            type="text"
            placeholder="URL video"
            value={newMovie.videoUrl}
            onChange={(e) =>
              setNewMovie({ ...newMovie, videoUrl: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="URL phụ đề"
            value={newMovie.subtitleUrl}
            onChange={(e) =>
              setNewMovie({ ...newMovie, subtitleUrl: e.target.value })
            }
          />
          <textarea
            placeholder="Mô tả"
            value={newMovie.description}
            onChange={(e) =>
              setNewMovie({ ...newMovie, description: e.target.value })
            }
          />
        </div>

        <div className="admin-actions">
          {editMovie ? (
            <>
              <button onClick={handleUpdateMovie}>Cập nhật phim</button>
              <button className="btn-secondary" onClick={() => {
                setEditMovie(null);
                setNewMovie({
                  title: "",
                  genre: "",
                  description: "",
                  releaseDate: "",
                  image: "",
                  videoUrl: "",
                  subtitleUrl: "",
                });
              }}>
                Hủy
              </button>
            </>
          ) : (
            <button onClick={handleAddMovie}>Thêm phim</button>
          )}
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tiêu đề</th>
              <th>Thể loại</th>
              <th>Ngày</th>
              <th>Mô tả</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {movies.length === 0 ? (
              <tr>
                <td colSpan="6">Chưa có phim nào trong danh sách.</td>
              </tr>
            ) : (
              movies.map((movie) => (
                <tr key={movie.id}>
                  <td>
                    <img src={movie.image} alt={movie.title} className="admin-movie-image" />
                  </td>
                  <td>{movie.title}</td>
                  <td>{movie.genre}</td>
                  <td>{movie.releaseDate}</td>
                  <td>{movie.description}</td>
                  <td>
                    <div className="admin-row-actions">
                      <button className="edit-btn" onClick={() => handleEditMovie(movie)}>
                        Edit
                      </button>
                      <button className="delete-btn" onClick={() => handleDeleteMovie(movie.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;
