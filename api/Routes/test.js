import { Router } from "express";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;
const router = Router();

import Test from "../Models/Test.js";
import { authentication } from "../middleware/aurhenticate.js";

// fetch all tests
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Get the requested page, default to 1
  const pageSize = parseInt(req.query.pageSize) || 12; // Set a default page size

  try {
    const totalTests = await Test.countDocuments({
      questions: { $exists: true, $ne: [] },
    });
    const tests = await Test.find({ questions: { $exists: true, $ne: [] } })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    if (tests) {
      res.json({
        data: tests,
        currentPage: page,
        totalPages: Math.ceil(totalTests / pageSize),
        pageSize: pageSize,
      });
    } else {
      res.send({ error: "invalid id" });
    }
  } catch (error) {
    res.send({ error: error.message });
  }
});
// fetch latest tests
router.get("/latest", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Get the requested page, default to 1
  const pageSize = parseInt(req.query.pageSize) || 12; // Set a default page size

  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 2);
    const totalLatestTests = await Test.countDocuments({
      createdAt: { $gte: yesterday },
      questions: { $exists: true, $ne: [] },
    });
    const latestData = await Test.find({
      createdAt: { $gte: yesterday },
      questions: { $exists: true, $ne: [] },
    })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    if (latestData) {
      res.json({
        data: latestData,
        currentPage: page,
        totalPages: Math.ceil(totalLatestTests / pageSize),
        pageSize: pageSize,
      });
    } else {
      res
        .status(200)
        .send({ data: [], isData: false, message: "no latest data found" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
// fetch test created by user
// fetch all tests
router.post("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Get the requested page, default to 1
  const pageSize = parseInt(req.query.pageSize) || 8; // Set a default page size

  try {
    const id = req.body.id;
    const userTestsCount = await Test.countDocuments({
      user: id,
    });
    const userTests = await Test.find({
      user: id,
    })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    if (userTests) {
      res.json({
        data: userTests,
        currentPage: page,
        totalPages: Math.ceil(userTestsCount / pageSize),
        pageSize: pageSize,
      });
    } else {
      res.send({ error: "invalid id", data: [] });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
// fetch a test by id
router.get("/:id", async (req, res) => {
  try {
    const documentId = req.params.id;
    // Validate the documentId to ensure it's a valid ObjectId
    if (!ObjectId.isValid(documentId)) {
      throw new Error("Invalid Test ID");
    }
    const test = await Test.findOne({ _id: documentId });
    if (test) {
      res.status(200).send(test);
    } else {
      throw new Error("Test Id does not exist");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});
// add test
router.post("/create", authentication, async (req, res) => {
  try {
    console.log(req.body);
    req.body.user = req.user._id;
    const test = Test(req.body);
    const result = await test.save();
    if (test) {
      res.status(200).send({ success: "added succesfully", data: result });
    } else {
      res.status(404).send({ error: "test creation failed" });
    }
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

// delete test
router.delete("/:id", authentication, async (req, res) => {
  try {
    const result = await Test.findByIdAndDelete(req.params["id"]);
    console.log("result: ", result);
    if (result) return res.status(200).send({ success: "deleted succesfully" });
    return res.status(404).send({ error: "Id not found" });
  } catch (error) {
    console.log("error", error.message);
    res.status(404).send({ error: error.message });
  }
});

// update test
router.put("/:id", async (req, res) => {
  const { id } = req.params; // Assuming you're passing the ID of the document to update
  const { testName, subject, timer, pmarks, nmarks } = req.body; // Fields to update

  try {
    const updatedTest = await Test.findByIdAndUpdate(
      id,
      { testName, subject, timer, pmarks, nmarks },
      { new: true, runValidators: true }
    );
    console.log(updatedTest);

    if (!updatedTest) {
      return res.status(404).json({ message: "Test not found" });
    }

    res
      .status(201)
      .json({ test: updatedTest, message: "Test updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
