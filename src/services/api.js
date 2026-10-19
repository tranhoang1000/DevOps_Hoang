import moviesData from "../data/moviesData";

const API_BASE = "/api";

// Helper lấy danh sách phim
export const fetchMovies = async () => {
  try {
    const res = await fetch(`${API_BASE}/movies`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn("Backend API không khả dụng, sử dụng dữ liệu cục bộ:", err.message);
  }

  // Dự phòng từ localStorage hoặc moviesData
  try {
    const saved = JSON.parse(localStorage.getItem("movies"));
    if (Array.isArray(saved) && saved.length > 0) return saved;
  } catch (e) {}

  return moviesData;
};

// Helper lấy chi tiết 1 phim
export const fetchMovieById = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/movies/${id}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Không thể lấy phim từ Backend:", err.message);
  }

  const movies = await fetchMovies();
  return movies.find((m) => m.id === Number(id)) || null;
};

// Helper thêm phim mới (Admin)
export const createMovie = async (movieData) => {
  try {
    const res = await fetch(`${API_BASE}/movies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(movieData),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Lỗi thêm phim vào Backend:", err.message);
  }

  // Fallback lưu local
  const current = await fetchMovies();
  const newMovie = { id: Date.now(), ...movieData };
  const updated = [...current, newMovie];
  localStorage.setItem("movies", JSON.stringify(updated));
  return newMovie;
};

// Helper cập nhật phim (Admin / Likes / Views / Rating)
export const updateMovie = async (id, updateData) => {
  try {
    const res = await fetch(`${API_BASE}/movies/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Lỗi cập nhật phim trên Backend:", err.message);
  }

  // Fallback cập nhật local
  const current = await fetchMovies();
  const updated = current.map((m) => (m.id === Number(id) ? { ...m, ...updateData } : m));
  localStorage.setItem("movies", JSON.stringify(updated));
  return updated.find((m) => m.id === Number(id));
};

// Helper xóa phim (Admin)
export const deleteMovie = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/movies/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      return true;
    }
  } catch (err) {
    console.warn("Lỗi xóa phim trên Backend:", err.message);
  }

  const current = await fetchMovies();
  const updated = current.filter((m) => m.id !== Number(id));
  localStorage.setItem("movies", JSON.stringify(updated));
  return true;
};

// Helper đăng nhập
export const apiLogin = async (email, password) => {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Đăng nhập thất bại");
    }
    return data;
  } catch (err) {
    // Fallback: kiểm tra admin hardcode hoặc localStorage
    if (email === "admin123@gmail.com" && password === "admin123") {
      return {
        message: "Đăng nhập thành công với tư cách Admin!",
        user: { username: "Admin", email, isAdmin: true },
      };
    }
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const found = users.find((u) => u.email === email && u.password === password);
    if (found) {
      return {
        message: `Đăng nhập thành công! Chào mừng ${found.username}`,
        user: { ...found, isAdmin: false },
      };
    }
    throw new Error(err.message || "Email hoặc mật khẩu không đúng");
  }
};

// Helper đăng ký
export const apiRegister = async (userData) => {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Đăng ký thất bại");
    }
    return data;
  } catch (err) {
    // Fallback: lưu vào localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const exist = users.some((u) => u.email === userData.email || u.username === userData.username);
    if (exist) {
      throw new Error("Email hoặc tên đăng nhập đã tồn tại trong hệ thống!");
    }
    const newUser = { id: Date.now(), ...userData, isAdmin: false };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    return {
      message: "Đăng ký tài khoản thành công!",
      user: newUser,
    };
  }
};
