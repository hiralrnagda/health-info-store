const express = require("express");
const router = express.Router();
const schema = require("../schemaValidator");
const db = require("../db");
const auth = require("../auth");

const elastic = require("../elastic");

//create a new plan
router.post("/", async (req, res) => {
  console.log("POST: /plans");
  if (!auth.validateToken(req)) {
    res.status(401).json({ message: "invalid bearer token/format" });
    return;
  }
  if (schema.validator(req.body)) {
    const value = await db.findEntry(req.body.objectId);
    if (value) {
      res
        .setHeader("ETag", value.ETag)
        .status(409)
        .json({ message: "item already exists" });
      console.log("item already exists");
      return;
    } else {
      const ETag = (await db.addPlanFromReq(req.body)).ETag;
      await elastic.index(req.body, req.body.objectId, null, "plan");
      // await producer.publishMessage(req.body, "added to producer");
      res.setHeader("ETag", ETag).status(201).json({
        message: "item added/created",
        objectId: value.objectId,
      });
      console.log("item added");
      return;
    }
  } else {
    res.status(400).json({ message: "item isn't valid" });
    console.log("item isn't valid");
    return;
  }
});

//get with planId
router.get("/:planId", async (req, res) => {
  console.log("GET: plans/");
  if (!auth.validateToken(req)) {
    res.status(401).json({ message: "invalid bearer token/format" });
    return;
  }
  if (
    req.params.planId == null &&
    req.params.planId == "" &&
    req.params == {}
  ) {
    res.status(400).json({ message: "invalid plan ID" });
    console.log("invalid plan ID");
    return;
  }
  const value = await db.findEntry(req.params.planId);
  if (value.objectId == req.params.planId) {
    if (
      req.headers["if-none-match"] &&
      value.ETag == req.headers["if-none-match"]
    ) {
      res
        .setHeader("ETag", value.ETag)
        .status(304)
        .json({
          plan: JSON.parse(value.plan),
        });
      // console.log("plan found unchanged:");
      return;
    } else {
      res
        .setHeader("ETag", value.ETag)
        .status(200)
        .json({
          plan: JSON.parse(value.plan),
        });
      // console.log("plan found changed:");
      return;
    }
  } else {
    res.status(404).json({ message: "plan not found" });
    console.log("plan not found");
    return;
  }
});

router.patch("/:planId", async (req, res) => {
  console.log("PATCH: plans/");
  if (!auth.validateToken(req)) {
    res.status(401).json({ message: "invalid bearer token/format" });
    return;
  }
  if (
    req.params.planId == null &&
    req.params.planId == "" &&
    req.params == {}
  ) {
    res.status(400).json({ message: "invalid plan ID" });
    console.log("invalid plan ID");
    return;
  }
  if (!schema.validator(req.body)) {
    res.status(400).json({ message: "item isn't valid" });
    console.log("item isn't valid");
    return;
  }
  const value = await db.findEntry(req.params.planId);
  if (value.objectId == req.params.planId) {
    if (!req.headers["if-match"] || value.ETag != req.headers["if-match"]) {
      res
        .setHeader("ETag", value.ETag)
        .status(412)
        .json({ message: "etag required to patch!" });
      console.log("etag required to patch");
      return;
    } else {
      const putResult = await db.addPlanFromReq(req.body);
      await elastic.deleteNested(req.params.planId, "plan");
      await elastic.index(req.body, req.params.planId, null, "plan");
      // await producer.publishMessage(req.body, "added to producer");
      res
        .setHeader("ETag", putResult.ETag)
        .status(201)
        .json({
          message: "plan patched successfully",
          plan: JSON.parse(putResult.plan),
        });
    }
  } else {
    res.status(404).json({ message: "plan not found" });
    console.log("plan not found");
    return;
  }
});

router.put("/:planId", async (req, res) => {
  console.log("PUT: plans/");
  if (!auth.validateToken(req)) {
    res.status(401).json({ message: "invalid bearer token/format" });
    return;
  }
  if (
    req.params.planId == null &&
    req.params.planId == "" &&
    req.params == {}
  ) {
    res.status(400).json({ message: "invalid plan ID" });
    console.log("invalid plan ID");
    return;
  }
  if (!schema.validator(req.body)) {
    res.status(400).json({ message: "item isn't valid" });
    console.log("item isn't valid");
    return;
  }
  const value = await db.findEntry(req.params.planId);
  if (value.objectId == req.params.planId) {
    if (!req.headers["if-match"] || value.ETag != req.headers["if-match"]) {
      res
        .setHeader("ETag", value.ETag)
        .status(412)
        .json({ message: "plan found unchanged!" });
      console.log("plan found unchanged:");
      return;
    } else {
      const patchResult = await db.addPlanFromReq(req.body);
      await elastic.deleteNested(req.params.planId, "plan");
      await elastic.index(req.body, req.params.planId, null, "plan");
      res
        .setHeader("ETag", patchResult.ETag)
        .status(201)
        .json({
          message: "plan updated successfully",
          plan: JSON.parse(patchResult.plan),
        });
    }
  } else {
    res.status(404).json({ message: "plan not found" });
    console.log("plan not found");
    return;
  }
});

//delete with planId
router.delete("/:planId", async (req, res) => {
  console.log("DELETE: /plans");
  if (!auth.validateToken(req)) {
    res.status(401).json({ message: "invalid bearer token/format" });
    return;
  }
  if (
    req.params.planId == null &&
    req.params.planId == "" &&
    req.params == {}
  ) {
    res.status(400).json({ message: "invalid plan ID" });
    return;
  }
  const value = await db.findEntry(req.params.planId);
  if (value.objectId == req.params.planId) {
    if (req.headers["if-match"] || value.ETag == req.headers["if-match"]) {
      console.log("item found");
      // console.log(JSON.parse(value.plan));
      if (db.deletePlan(req.params)) {
        console.log("item deleted");
        await elastic.deleteNested(req.params.planId, "plan");
        res.status(204).json({ message: "item deleted successfully!" });
      } else {
        console.log("item not deleted");
        res.status(500).json({ message: "item not deleted" });
      }
      return;
    } else {
      res.status(404).json({ message: "etag not found!" });
    }
  } else {
    res.status(404).json({ message: "plan not found" });
    console.log("plan not found");
    return;
  }
});

//delete without planId
router.delete("/", async (req, res) => {
  console.log("DELETE: /plans. Invalid request");
  res.status(400).json({ message: "invalid plan ID" });
  return;
});

module.exports = router;
