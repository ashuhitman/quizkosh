import mongoose from "mongoose";

const questionSchema = mongoose.Schema({
  question: { type: String, required: true, trim: true },
  options: [
    {
      text: { type: String, required: true, trim: true },
      isAnswer: { type: Boolean, default: false },
    },
  ],
});

const Question = mongoose.model("Question", questionSchema);
