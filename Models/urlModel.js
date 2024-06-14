import mongoose from "mongoose";

const urlShortenerSchema = new mongoose.Schema(
  {
    fullurl: {
      type: String,
      required: true,
    },

    shorturl: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required:true,
      ref: "User",
    },
    totalClick: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

const urlShortener = mongoose.model("urlShortener", urlShortenerSchema);

export default urlShortener;
