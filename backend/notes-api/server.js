const express = require("express");
const cors = require("cors");
const app = express();

// Global Middleware Configuration
app.use(cors());
app.use(express.json());

// In-Memory Database Store matching full-stack dashboard schema requirements
let notesCollection = [
  {
    id: 1,
    title: "Getting Started",
    content: "Review the fullstack developer assignment documents closely.",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString()
  }
];

/**
 * Sequential primary key auto-increment ID generation utility
 * @returns {number} The next unique identifier index
 */
function getNextId() {
  return notesCollection.length > 0 ? Math.max(...notesCollection.map(n => n.id)) + 1 : 1;
}

// --- RESTful API Routing Endpoints ---

/**
 * GET /notes
 * Description: Retrieves all active notes. Supports optional case-insensitive 
 * substring queries filtered by title or content body records.
 * Sorting: Always sequenced by most recently updated records (descending).
 */
app.get("/notes", (req, res) => {
  const { search } = req.query;
  let filteredNotes = [...notesCollection];

  if (search) {
    const query = search.toLowerCase().trim();
    filteredNotes = filteredNotes.filter(
      note => 
        note.title.toLowerCase().includes(query) || 
        note.content.toLowerCase().includes(query)
    );
  }

  // Enforce rigid date sorting execution matrix mappings (most recent to oldest)
  filteredNotes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  res.json(filteredNotes);
});

/**
 * GET /notes/:id
 * Description: Fetches a single note object tracking entity matching structural parameters.
 */
app.get("/notes/:id", (req, res) => {
  const noteId = parseInt(req.params.id, 10);
  
  if (isNaN(noteId)) {
    return res.status(400).json({ error: "Invalid ID format parameters provided." });
  }

  const note = notesCollection.find(n => n.id === noteId);
  if (!note) return res.status(404).json({ error: "Note not found." });
  
  res.json(note);
});

/**
 * POST /notes
 * Description: Generates a new note entity. Validates input values.
 */
app.post("/notes", (req, res) => {
  const { title, content } = req.body;
  
  // Validation guard clause checking for missing fields or whitespace mutations
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

/**
 * PUT /notes/:id
 * Description: Modifies structural properties of a tracked record matching id parameters.
 */
app.put("/notes/:id", (req, res) => {
  const noteId = parseInt(req.params.id, 10);
  const { title, content } = req.body;

  if (isNaN(noteId)) {
    return res.status(400).json({ error: "Invalid ID format parameters provided." });
  }

  const note = notesCollection.find(n => n.id === noteId);
  if (!note) return res.status(404).json({ error: "Note not found." });

  // Guard validation if user attempt involves changing note title parameters to an empty payload string
  if (title !== undefined && title.trim() === "") {
    return res.status(400).json({ error: "Title must not be empty" });
  }

  if (title !== undefined) note.title = title.trim();
  if (content !== undefined) note.content = content.trim();
  
  // Explicit tracking update timestamp reassignment operation
  note.updatedAt = new Date().toISOString();

  res.json(note);
});

/**
 * DELETE /notes/:id
 * Description: Drops single record profile tracking indexes out of structural store lists.
 */
app.delete("/notes/:id", (req, res) => {
  const noteId = parseInt(req.params.id, 10);

  if (isNaN(noteId)) {
    return res.status(400).json({ error: "Invalid ID format parameters provided." });
  }

  const targetIndex = notesCollection.findIndex(n => n.id === noteId);
  if (targetIndex === -1) return res.status(404).json({ error: "Note not found." });

  notesCollection.splice(targetIndex, 1);
  res.json({ success: true, message: "Note deleted successfully." });
});

// Runtime Listening Environment Assignment Context Configuration
const PORT = 5500;
app.listen(PORT, () => {
  console.log(`API layer executing on http://localhost:${PORT}`);
});