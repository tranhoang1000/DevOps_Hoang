const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const movieRoutes = require("./routes/movies");
const authRoutes = require("./routes/auth");
const Movie = require("./models/Movie");
const User = require("./models/User");
const initialMovies = require("./initialMovies.json");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/filmdb";

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/movies", movieRoutes);
app.use("/api/auth", authRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Manage-Film-Backend",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// Auto seed function
async function seedDatabase() {
  try {
    const movieCount = await Movie.countDocuments();
    if (movieCount === 0) {
      console.log(`Đang nạp ${initialMovies.length} phim ban đầu vào MongoDB...`);
      await Movie.insertMany(initialMovies);
      console.log("Đã nạp dữ liệu phim mẫu thành công!");
    } else {
      console.log(`MongoDB đã có sẵn ${movieCount} bộ phim.`);
    }

    const admin = await User.findOne({ email: "admin123@gmail.com" });
    if (!admin) {
      await User.create({
        username: "Admin",
        email: "admin123@gmail.com",
        password: "admin123",
        isAdmin: true,
      });
      console.log("Đã tạo tài khoản Admin mặc định (admin123@gmail.com / admin123).");
    }
  } catch (error) {
    console.error("Lỗi khi seed dữ liệu ban đầu:", error.message);
  }
}

// Kết nối MongoDB và khởi động Server
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log(`Kết nối MongoDB thành công: ${MONGO_URI}`);
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`Server Backend đang lắng nghe tại cổng: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Lỗi kết nối MongoDB:", err.message);
    // Vẫn lắng nghe để cung cấp thông báo health check
    app.listen(PORT, () => {
      console.log(`Server Backend đang chạy ở chế độ dự phòng tại cổng: ${PORT}`);
    });
  });
