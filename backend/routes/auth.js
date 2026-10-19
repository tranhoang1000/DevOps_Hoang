const express = require("express");
const router = express.Router();
const User = require("../models/User");

// POST /api/auth/register - Đăng ký tài khoản mới
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, gender } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin bắt buộc" });
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return res.status(400).json({ message: "Email này đã được đăng ký!" });
      }
      return res.status(400).json({ message: "Tên đăng nhập này đã tồn tại!" });
    }

    const isFirstUserAdmin = email.toLowerCase() === "admin123@gmail.com";

    const user = new User({
      username,
      email: email.toLowerCase(),
      password, // Trong ứng dụng production nên băm mật khẩu với bcrypt
      firstName: firstName || "",
      lastName: lastName || "",
      gender: gender || "",
      isAdmin: isFirstUserAdmin,
    });

    await user.save();

    res.status(201).json({
      message: "Đăng ký thành công!",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi đăng ký tài khoản", error: error.message });
  }
});

// POST /api/auth/login - Đăng nhập
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email và mật khẩu là bắt buộc" });
    }

    // Kiểm tra tài khoản hardcoded Admin mặc định
    if (email === "admin123@gmail.com" && password === "admin123") {
      let admin = await User.findOne({ email: "admin123@gmail.com" });
      if (!admin) {
        admin = await User.create({
          username: "Admin",
          email: "admin123@gmail.com",
          password: "admin123",
          isAdmin: true,
        });
      }
      return res.json({
        message: "Đăng nhập thành công với tư cách Admin!",
        user: {
          username: admin.username,
          email: admin.email,
          isAdmin: true,
        },
      });
    }

    // Tìm người dùng trong MongoDB
    const user = await User.findOne({ email: email.toLowerCase(), password });

    if (!user) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không chính xác!" });
    }

    res.json({
      message: `Đăng nhập thành công! Chào mừng ${user.username}`,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi đăng nhập", error: error.message });
  }
});

// GET /api/auth/users - Danh sách người dùng (Admin)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách người dùng", error: error.message });
  }
});

module.exports = router;
