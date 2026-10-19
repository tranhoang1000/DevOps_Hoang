const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");
const initialMovies = require("../initialMovies.json");

// GET /api/movies - Lấy tất cả phim (hỗ trợ lọc theo genre và tìm kiếm)
router.get("/", async (req, res) => {
  try {
    const { genre, search } = req.query;
    let query = {};

    if (genre) {
      query.genre = { $regex: new RegExp(`^${genre}$`, "i") };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const movies = await Movie.find(query).sort({ id: 1 });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách phim", error: error.message });
  }
});

// GET /api/movies/:id - Lấy thông tin chi tiết một phim
router.get("/:id", async (req, res) => {
  try {
    const movieId = Number(req.params.id);
    const movie = await Movie.findOne({ id: movieId });
    if (!movie) {
      return res.status(404).json({ message: "Không tìm thấy phim" });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy chi tiết phim", error: error.message });
  }
});

// POST /api/movies - Thêm phim mới (Admin)
router.post("/", async (req, res) => {
  try {
    const { title, genre, releaseDate, description, image, videoUrl, subtitleUrl } = req.body;

    if (!title || !genre) {
      return res.status(400).json({ message: "Title và genre là bắt buộc" });
    }

    // Tự sinh ID nếu không truyền
    let id = req.body.id;
    if (!id) {
      const maxMovie = await Movie.findOne().sort({ id: -1 });
      id = maxMovie ? maxMovie.id + 1 : 1;
    }

    const movie = new Movie({
      id,
      title,
      genre,
      releaseDate: releaseDate || "",
      description: description || "",
      image: image || "",
      videoUrl: videoUrl || "",
      subtitleUrl: subtitleUrl || "",
      views: 0,
      likes: 0,
      rating: 0,
    });

    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ message: "Lỗi thêm phim", error: error.message });
  }
});

// PUT /api/movies/:id - Cập nhật thông tin phim (Sửa phim, Like, Đánh giá, Lượt xem)
router.put("/:id", async (req, res) => {
  try {
    const movieId = Number(req.params.id);
    const updateData = req.body;

    const movie = await Movie.findOneAndUpdate({ id: movieId }, updateData, {
      new: true,
      runValidators: true,
    });

    if (!movie) {
      return res.status(404).json({ message: "Không tìm thấy phim để cập nhật" });
    }

    res.json(movie);
  } catch (error) {
    res.status(400).json({ message: "Lỗi cập nhật phim", error: error.message });
  }
});

// DELETE /api/movies/:id - Xóa phim (Admin)
router.delete("/:id", async (req, res) => {
  try {
    const movieId = Number(req.params.id);
    const result = await Movie.findOneAndDelete({ id: movieId });

    if (!result) {
      return res.status(404).json({ message: "Không tìm thấy phim để xóa" });
    }

    res.json({ message: "Xóa phim thành công", id: movieId });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa phim", error: error.message });
  }
});

// POST /api/movies/seed - Nạp lại dữ liệu 80 phim mẫu vào MongoDB
router.post("/seed", async (req, res) => {
  try {
    await Movie.deleteMany({});
    const inserted = await Movie.insertMany(initialMovies);
    res.json({ message: `Đã nạp thành công ${inserted.length} phim vào MongoDB` });
  } catch (error) {
    res.status(500).json({ message: "Lỗi nạp dữ liệu phim", error: error.message });
  }
});

module.exports = router;
