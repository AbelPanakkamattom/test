const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// In-Memory Database Store for Notes matching required assignment schema keys
let notesCollection = [
  {
    id: 1,
    title: "Getting Started",
    content: "Review the fullstack developer assignment documents closely.",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString()
  }
];

function getNextId() {
  return notesCollection.length > 0 ? Math.max(...notesCollection.map(n => n.id)) + 1 : 1;
}

// GET /notes - List all notes + search substring queries, sorted by most recently updated
app.get("/notes", (req, res) => {
  const { search } = req.query;
  let filteredNotes = [...notesCollection];

  if (search) {
    const query = search.toLowerCase();
    filteredNotes = filteredNotes.filter(
      note => 
        note.title.toLowerCase().includes(query) || 
        note.content.toLowerCase().includes(query)
    );
  }

  // Sorting condition requirement check
  filteredNotes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  res.json(filteredNotes);
});

// GET /notes/:id - View single note profile record details
app.get("/notes/:id", (req, res) => {
  const noteId = parseInt(req.params.id, 10);
  const note = notesCollection.find(n => n.id === noteId);
  if (!note) return res.status(404).json({ error: "Note not found." });
  res.json(note);
});

// POST /notes - Create note records with validation parameters
app.post("/notes", (req, res) => {
  const { title, content } = req.body;
  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title must not be empty" });
  }

  const timestamp = new Date().toISOString();
  const newNote = {
    id: getNextId(),
    title: title.trim(),
    content: content ? content.trim() : "",
    createdAt: timestamp,
    updatedAt: timestamp
  };

  notesCollection.push(newNote);
  res.status(201).json(newNote);
});

// PUT /notes/:id - Edit note parameters
app.put("/notes/:id", (req, res) => {
  const noteId = parseInt(req.params.id, 10);
  const { title, content } = req.body;

  const note = notesCollection.find(n => n.id === noteId);
  if (!note) return res.status(404).json({ error: "Note not found." });

  if (title !== undefined && title.trim() === "") {
    return res.status(400).json({ error: "Title must not be empty" });
  }

  if (title !== undefined) note.title = title.trim();
  if (content !== undefined) note.content = content.trim();
  note.updatedAt = new Date().toISOString(); // Auto updates timestamp modification tracking flags

  res.json(note);
});

// DELETE /notes/:id - Drop record profiles matching path indices
app.delete("/notes/:id", (req, res) => {
  const noteId = parseInt(req.params.id, 10);
  const targetIndex = notesCollection.findIndex(n => n.id === noteId);

  if (targetIndex === -1) return res.status(404).json({ error: "Note not found." });

  notesCollection.splice(targetIndex, 1);
  res.json({ success: true, message: "Note deleted successfully." });
});

const PORT = 5500;
app.listen(PORT, () => {
  console.log(`API layer executing on http://localhost:${PORT}`);
});