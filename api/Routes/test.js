import { Router } from "express";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;
const router = Router();

import Test from "../Models/Test.js";
import { authentication } from "../middleware/aurhenticate.js";

// fetch all tests
router.get("/", async (req, res) => {
  try {
    const tests = await Test.find({});
    if (tests) {
      res.send(tests);
    } else {
      res.send({ error: "invalid id" });
    }
  } catch (error) {
    res.send({ error: error.message });
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
    req.body.user = req.user._id;
    const test = Test(req.body);
    const result = await test.save();
    res.status(200).send({ success: "added succesfully", data: result });
  } catch (error) {
    res.send({ error: error.message });
  }
});

// delete test
router.delete("/:id", authentication, async (req, res) => {
  try {
    const result = await Test.findByIdAndDelete(req.params["id"]);
    if (result === null) return res.send({ error: "Id not found" });

    return res.send({ success: "deleted succesfully" });
  } catch (error) {
    res.send({ error: error.message });
  }
});

// update test
router.put("/:id", async (req, res) => {
  try {
    const result = await Test.findByIdAndUpdate(req.params["id"], req.body);
    if (result === null) {
      return res.send({ error: "Id not found" });
    }
    return res.send({ success: "Updated successfully" });
  } catch (error) {
    res.send({ error: error.message });
  }
});

export default router;
