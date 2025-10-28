import mongoose from "mongoose";

const designSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  jsonData: { type: Object, required: true },
  thumbnailUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Design", designSchema);
