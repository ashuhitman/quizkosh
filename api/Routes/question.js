import { Router } from "express";
import { ObjectId } from "mongoose";

import Test from "../Models/Test.js";

const router = Router();

// get all questions
router.get("/:id", async (req, res) => {
  try {
    const result = await Test.findOne({ _id: req.params.id }).select(
      "questions"
    );
    if (result.questions.length === 0)
      return res.send({ error: "No question was found" });
    return res.send(result);
  } catch (error) {
    res.send({ error: error.message });
  }
});

// append many questions
router.post("/add/:id", async (req, res) => {
  try {
    const result = await Test.findOneAndUpdate(
      { _id: req.params["id"] },
      {
        $push: {
          questions: {
            $each: req.body,
          },
        },
      },
      { returnDocument: "after" }
    );
    if (result) {
      res.status(200).send({ success: "added successfully", data: result });
    } else {
      res.status(500).send({ error: "Couldn't add data" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// update question

router.put("/update/:id", async (req, res) => {
  console.log("updating...");
  try {
    console.log(req.body);
    const testId = req.params["id"];
    const questionId = req.body._id;
    const result = await Test.findOneAndUpdate(
      { _id: testId },
      {
        $set: {
          "questions.$[el].question": req.body.question,
          "questions.$[el].options": req.body.options,
        },
      },
      {
        arrayFilters: [{ "el._id": questionId }],
        new: true,
      }
    );
    if (result) {
      const updatedQuestion = result.questions.find(
        (question) => question._id.toString() === questionId
      );
      return res.status(201).send({
        success: "question updated successfully",
        data: updatedQuestion,
      });
    }
    res.status(404).send({ error: "test id not found" });
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: error });
  }
});

// append question
router.put("/append/:id", async (req, res) => {
  console.log("appending...");
  try {
    const testId = req.params["id"];
    const newQuestion = req.body;

    const result = await Test.findOneAndUpdate(
      { _id: testId },

      { $push: { questions: newQuestion } },
      { new: true }
    );

    if (result) {
      const lastIndex = result.questions.length - 1;
      const updatedQuestion = result.questions[lastIndex];
      console.log(result.questions);
      return res.status(201).send({
        success: "question updated successfully",
        data: updatedQuestion,
      });
    }
    res.status(404).send({ error: "test id not found" });
  } catch (error) {
    res.status(404).send({ error: error + "error" });
  }
});

// DELETE request to delete a question from a test by ID
router.delete("/delete/:testId/:questionId", async (req, res) => {
  const { testId, questionId } = req.params;

  try {
    const test = await Test.findOne({ _id: testId });

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    const indexToRemove = test.questions.findIndex((question) => {
      console.log(question._id, questionId);
      if (question._id.toString() === questionId) return true;
    });
    if (indexToRemove !== -1) {
      test.questions.splice(indexToRemove, 1); // Remove the questionId
      await test.save(); // Save the updated Test document
      console.log("Question deleted from Test");
      res.status(200).json({ message: "Question deleted from Test", test });
    } else {
      return res.status(404).json({ message: "Question not found in Test" });
    }
  } catch (error) {
    console.error("Error deleting question from Test:", error);
    res
      .status(500)
      .json({ message: "Error deleting question from Test", error });
  }
});

export default router;
