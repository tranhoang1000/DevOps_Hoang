const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    genre: { type: String, required: true },
    releaseDate: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
    subtitleUrl: { type: String, default: "" },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);
