import { Router } from "express";

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
    res.status(404).send({ error: error });
  }
});

// append question
router.put("/append/:id", async (req, res) => {
  try {
    const testId = req.params["id"];
    const newQuestion = req.body;
    console.log(testId, newQuestion);
    const result = await Test.findOneAndUpdate(
      { _id: testId },
      { $push: { questions: newQuestion } },
      { new: true }
    );
    if (result) {
      const lastIndex = result.questions.length - 1;
      const updatedQuestion = result.questions[lastIndex];
      return res.status(201).send({
        success: "question updated successfully",
        data: updatedQuestion,
      });
    }
    res.status(404).send({ error: "test id not found" });
  } catch (error) {
    res.status(404).send({ error: error });
  }
});
// append a question
// router.post("/update/:id", async (req, res) => {
//   try {
//     const id = req.params["id"];
//     const { id: questionId, question } = req.body;
//     console.log(questionId, question);
//     const result = await Test.findOneAndUpdate(
//       { _id: id },
//       { $set: { "questions.$[el].question": question } },
//       {
//         arrayFilters: [{ "el._id": questionId }],
//         new: true,
//       }
//     );

//     if (result) {
//       res.send(result);
//     } else {
//       res.send({ error: "Id not found" });
//     }
//   } catch (error) {
//     res.send({ error: error.message });
//   }
// });

// // update options
// router.put("/options/update/:docId", async (req, res) => {
//   try {
//     const documentId = req.params["docId"];
//     const { id: questionId, option } = req.body;
//     console.log(questionId, option);
//     const result = await Test.updateOne(
//       {
//         _id: documentId,
//         "questions._id": questionId,
//         "questions.options._id": option.id,
//       },
//       {
//         $set: {
//           "questions.$[question].options.$[option].text": option.text,
//           "questions.$[question].options.$[option].isAnswer": option.isAnswer,
//         },
//       },
//       {
//         arrayFilters: [
//           {
//             // filter for question
//             "question._id": questionId,
//           },
//           {
//             // filter for option
//             "option._id": option.id,
//           },
//         ],
//       }
//     );
//     res.send(result);
//   } catch (error) {
//     res.send({ error: error.message });
//   }
// });
export default router;
