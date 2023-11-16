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

// append a question
// router.post("/add/:id", async (req, res) => {
//   try {
//     await Test.findOneAndUpdate(
//       { _id: req.params["id"] },
//       {
//         $push: {
//           questions: req.body,
//         },
//       }
//     );
//     res.send({ success: "added successfully" });
//   } catch (error) {
//     res.send({ error: error.message });
//   }
// });
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
      }
    );
    if (result) {
      res.status(200).send({ success: "added successfully", data: result });
    } else {
      res.status(500).send({ success: "Couldn't add data" });
    }
  } catch (error) {
    res.send({ error: error.message });
  }
});

// update question

router.post("/update/:id", async (req, res) => {
  try {
    const id = req.params["id"];
    const { id: questionId, question } = req.body;
    console.log(questionId, question);
    const result = await Test.findOneAndUpdate(
      { _id: id },
      { $set: { "questions.$[el].question": question } },
      {
        arrayFilters: [{ "el._id": questionId }],
        new: true,
      }
    );

    if (result) {
      res.send(result);
    } else {
      res.send({ error: "Id not found" });
    }
  } catch (error) {
    res.send({ error: error.message });
  }
});

// update options
router.put("/options/update/:docId", async (req, res) => {
  try {
    const documentId = req.params["docId"];
    const { id: questionId, option } = req.body;
    console.log(questionId, option);
    const result = await Test.updateOne(
      {
        _id: documentId,
        "questions._id": questionId,
        "questions.options._id": option.id,
      },
      {
        $set: {
          "questions.$[question].options.$[option].text": option.text,
          "questions.$[question].options.$[option].isAnswer": option.isAnswer,
        },
      },
      {
        arrayFilters: [
          {
            // filter for question
            "question._id": questionId,
          },
          {
            // filter for option
            "option._id": option.id,
          },
        ],
      }
    );
    res.send(result);
  } catch (error) {
    res.send({ error: error.message });
  }
});
export default router;
