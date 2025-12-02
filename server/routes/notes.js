const express = require("express");
const Note = require("../models/Note");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const note = await Note.create({ ...req.body, userId: req.user.id });
    return res.json(note);
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Error creating note", error: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    return res.json(notes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching notes" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    if (note.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    note.title = req.body.title ?? note.title;
    note.content = req.body.content ?? note.content;
    await note.save();
    return res.json(note);
  } catch (err) {
    return res.status(500).json({ message: "Error updating note" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    if (note.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });
    await Note.findByIdAndDelete(req.params.id);
    return res.json({ message: "Note deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Error deleting note" });
  }
});

module.exports = router;
