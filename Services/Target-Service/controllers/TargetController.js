const Target = require("../models/Target");
const path = require("path");
const fs = require("fs");

exports.getAllTargets = async (req, res) => {
  try {
    const targets = await Target.find();
    res.json(targets);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch targets." });
  }
};

exports.createTarget = async (req, res) => {
  try {
    const imageUrl = `/uploads/${req.file.filename}`;
    const newTarget = new Target({
      ...req.body,
      imageUrl,
    });
    await newTarget.save();
    res.status(201).json(newTarget);
  } catch (err) {
    res.status(500).json({ error: "Failed to create target." });
  }
};

exports.deleteTarget = async (req, res) => {
  try {
    const target = await Target.findById(req.params.id);
    if (!target) return res.status(404).json({ error: "Target not found" });

    // Verwijder gekoppeld bestand (optioneel)
    const filePath = path.join(__dirname, "..", target.imageUrl);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await target.deleteOne();
    res.status(200).json({ message: "Target deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete target." });
  }
};