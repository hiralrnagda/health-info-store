const express = require("express");
const router = express.Router();
const schema = require("../schemaValidator");
const db = require("../db");
const auth = require("../auth");

//create a new plan
router.post("/", async (req, res) => {
  console.log("POST: /plans");
  console.log(req.body);
  if (!auth.validateToken(req)) {
    res.status(400).json({ message: "wrong bearer token/format" });
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
      res.setHeader("ETag", ETag).status(201).json({
        message: "item added",
        ETag: ETag,
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
  console.log(req.params);
  console.log(req.headers["if-none-match"]);
  if (!auth.validateToken(req)) {
    res.status(400).json({ message: "wrong bearer token/format" });
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
          message: "plan unchanged",
          plan: JSON.parse(value.plan),
        });
      console.log("plan found unchanged:");
      console.log(JSON.parse(value.plan));
      return;
    } else {
      res
        .setHeader("ETag", value.ETag)
        .status(200)
        .json(JSON.parse(value.plan));
      console.log("plan found changed:");
      console.log(JSON.parse(value.plan));
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
  console.log(req.params);
  if (!auth.validateToken(req)) {
    res.status(400).json({ message: "wrong bearer token/format" });
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
    if (!req.headers["if-match"] || value.ETag != req.headers["if-match"]) {
      res
        .setHeader("ETag", value.ETag)
        .status(412)
        .json(JSON.parse(value.plan));
      console.log("plan found unchanged:");
      console.log(JSON.parse(value.plan));
      return;
    } else {
      const patchResult = await db.addPlanFromReq(req.body);
      console.log(patchResult);
      res
        .setHeader("ETag", patchResult.ETag)
        .status(201)
        .json(JSON.parse(patchResult.plan));
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
  console.log(req.params);
  if (!auth.validateToken(req)) {
    res.status(400).json({ message: "wrong bearer token/format" });
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
    console.log("item found");
    console.log(JSON.parse(value.plan));
    if (db.deletePlan(req.params)) {
      console.log("item deleted");
      res.status(200).json();
    } else {
      console.log("item not deleted");
      res.status(500).json({ message: "item not deleted" });
    }

    return;
  } else {
    res.status(404).json({ message: "plan not found" });
    console.log("plan not found");
    return;
  }
});

//get without planId
router.get("/", async (req, res) => {
  console.log("GET: /plans. Invalid request");
  res.status(400).json({ message: "invalid plan ID" });
  console.log("invalid plan ID");
  return;
});

//delete without planId
router.delete("/", async (req, res) => {
  console.log("DELETE: /plans. Invalid request");
  res.status(400).json({ message: "invalid plan ID" });
  return;
});

module.exports = router;
