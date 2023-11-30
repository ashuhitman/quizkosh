import mongoose from "mongoose";

const questionSchema = mongoose.Schema({
  question: { type: String, required: true, trim: true },
  options: [
    {
      text: String,
      isAnswer: Boolean,
    },
  ],
});

const testSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  testName: { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true },
  pmarks: {
    type: Number,
    required: true,
    default: 1,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
  },
  nmarks: {
    type: Number,
    required: true,
    default: 0,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
  },
  timer: { type: String, required: true, trim: true },
  questions: [questionSchema],
  createdAt: { type: Date, immutable: true, default: Date.now },
  updateddAt: { type: Date, default: Date.now },
  owner: { type: String },
  public: { type: Boolean, default: true },
});

const Test = new mongoose.model("Test", testSchema);
export default Test;
