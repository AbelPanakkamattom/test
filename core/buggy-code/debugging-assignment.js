const express = require("express");
const app = express();

// Global Middlewares
app.use(express.json());

// Enable Cross-Origin Resource Sharing (CORS) so your frontend can communicate flawlessly
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Mock Database States
const users = [
  { id: 1, name: "Amit", email: "amit@test.com" },
  { id: 2, name: "Riya", email: "riya@test.com" }
];

let notes = [
  { id: 1, title: "Note 1", content: "Content 1", userId: 1 },
  { id: 2, title: "Note 2", content: "Content 2", userId: 2 }
];

// --- Helper Functions ---

// 3. FIX: Added missing return statement so the function output matches user instance
function getUserById(id) {
  return users.find(u => u.id === Number(id));
}

// 5. FIX: Created the missing fetchExternalData function to handle production requests asynchronously
async function fetchExternalData() {
  return { data: "Mock External Data" };
}

// 7. FIX: Changed logic to cleanly generate integers instead of decimals
function generateNoteId() {
  return Math.floor(Math.random() * 1000) + 1;
}

// --- API Routing Endpoints ---

// 1. FIX: Changed payload from undefined 'userList' to assigned reference variable 'allUsers'
app.get("/users", (req, res) => {
  const allUsers = users;
  res.send(allUsers);
});

// 2. FIX: Explicitly cast parameters to Number to match native data structure type boundaries
app.get("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).send({ error: "User not found" });
  res.send(user);
});

// 4. FIX: Corrected semantic property typo from 'lenght' to 'length'
app.get("/notes/count", (req, res) => {
  const total = notes.length;
  res.send({ total });
});

app.get("/external-data", async (req, res) => {
  const data = await fetchExternalData(); // 5. FIX: Added missing await keyword mapping
  res.send(data);
});

// 6. FIX: Corrected operator from single assignment (=) to boolean comparison evaluation (===)
app.get("/notes", (req, res) => {
  if (notes.length === 0) {
    console.log("No notes found");
  }
  res.send(notes);
});

app.post("/notes", (req, res) => {
  const { title, content, userId } = req.body;

  // 8. FIX: Replaced logical AND (&&) validation filter with standard selective input logical OR (||)
  if (!title || !content) {
    return res.status(400).send("Invalid input");
  }

  const newNote = {
    id: generateNoteId(), // 9. FIX: Properly executed functional return routine using ()
    title: title,
    content: content,
    userId: userId ? Number(userId) : null
  };

  notes.push(newNote);
  res.status(201).send(newNote);
});

// 10. FIX: Implemented -1 conditional safety check to prevent splicing the last array element when a search fails
app.delete("/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const noteIndex = notes.findIndex(n => n.id === id);

  if (noteIndex === -1) {
    return res.status(404).send({ message: "Note not found" });
  }

  notes.splice(noteIndex, 1);
  res.send({ message: "Note deleted" });
});

app.put("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name } = req.body;

  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).send({ error: "User not found" });
  
  user.name = name; // 11. FIX: Assigned value using parsed payload variable 'name' instead of 'username'
  res.send(user);
});

// 12. FIX: Altered filter loop comparison to a strict equality checker (===)
app.get("/user-notes/:userId", (req, res) => {
  const userId = Number(req.params.userId);
  const userNotes = notes.filter(n => n.userId === userId);
  res.send(userNotes);
});

// 13. FIX: Changed permissive validation OR (||) check to required standard compound match conditional AND (&&)
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@test.com" && password === "123456") {
    res.send({ message: "Login successful" });
  } else {
    res.status(401).send({ message: "Invalid credentials" });
  }
});

// 14. FIX: Replaced .filter() pattern with .find() to target object extraction directly rather than wrapped records
app.get("/profile/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).send({ error: "User not found" });
  res.send(user.name);
});

// 15. FIX: Wrapped inputs inside standard Number constructs to force real mathematical summation instead of strings
app.post("/sum", (req, res) => {
  const { a, b } = req.body;
  const total = Number(a) + Number(b);
  res.send({ total });
});

// 16. FIX: Aligned port listening descriptor map parameters cleanly to match interface declarations (3000)
app.listen(3000, () => {
  console.log("Server running on port 3000");
});