import mongoose from "mongoose";
function isIntegerOrFloatWithoutFraction(value) {
  return Number.isInteger(value) || (!isNaN(value) && value % 1 === 0);
}

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
      validator: isIntegerOrFloatWithoutFraction,
      message: "{VALUE} is not an integer or float without fractional part",
    },
  },
  nmarks: {
    type: Number,
    required: true,
    default: 0,
    validate: {
      validator: isIntegerOrFloatWithoutFraction,
      message: "{VALUE} is not an integer or float without fractional part",
    },
  },
  timer: { type: String, required: true, trim: true },
  questions: [questionSchema],
  createdAt: { type: Date, immutable: true, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  owner: { type: String },
  public: { type: Boolean, default: true },
});

// function onUpdate(next) {
//   console.log("pre update: updatedAt");
//   this._update = {
//     ...this._update,
//     $set: {
//       updatedAt: new Date(),
//     },
//   };
//   next();
// }
// testSchema.pre("findOneAndUpdate", onUpdate);

// testSchema.pre("updateOne", onUpdate);

// testSchema.pre("update", onUpdate);

const Test = new mongoose.model("Test", testSchema);
export default Test;
