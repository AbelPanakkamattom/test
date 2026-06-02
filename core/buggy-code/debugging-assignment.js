const express = require("express");
const app = express();

app.use(express.json());

const users = [
  { id: 1, name: "Amit", email: "amit@test.com" },
  { id: 2, name: "Riya", email: "riya@test.com" }
];

let notes = [
  { id: 1, title: "Note 1", content: "Content 1", userId: 1 },
  { id: 2, title: "Note 2", content: "Content 2", userId: 2 }
];

// 1. FIX: Changed variable payload from undefined 'userList' to 'allUsers'
app.get("/users", (req, res) => {
  const allUsers = users;
  res.send(allUsers);
});

// 2. FIX: Cast req.params.id to Number to match data type for strict equality (===)
app.get("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).send({ error: "User not found" });
  res.send(user);
});

// 3. FIX: Added missing return statement so the function actually outputs the user
function getUserById(id) {
  return users.find(u => u.id === Number(id));
}

// 4. FIX: Corrected typo 'lenght' to 'length'
app.get("/notes/count", (req, res) => {
  const total = notes.length;
  res.send({ total });
});

// 5. FIX: Created the missing fetchExternalData function to prevent a runtime crash
async function fetchExternalData() {
  return { data: "Mock External Data" };
}

app.get("/external-data", async (req, res) => {
  const data = await fetchExternalData(); // Added missing await
  res.send(data);
});

// 6. FIX: Fixed assignment bug (=) changing it to comparison (===) so it doesn't wipe out the array
app.get("/notes", (req, res) => {
  if (notes.length === 0) {
    console.log("No notes found");
  }
  res.send(notes);
});

// 7. FIX: Changed logic to generate integers instead of decimals
function generateNoteId() {
  return Math.floor(Math.random() * 1000) + 1;
}

app.post("/notes", (req, res) => {
  const { title, content, userId } = req.body;

  // 8. FIX: Fixed validation from && to || so it rejects if title OR content is missing
  if (!title || !content) {
    return res.status(400).send("Invalid input");
  }

  const newNote = {
    id: generateNoteId(), // 9. FIX: Invoked the function properly with ()
    title: title,
    content: content,
    userId: userId ? Number(userId) : null
  };

  notes.push(newNote);
  res.status(201).send(newNote);
});

// 10. FIX: Prevented splicing the last item when item index is not found (-1)
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

  const user = users.find(u => u.id == id);
  if (!user) return res.status(404).send({ error: "User not found" });
  
  user.name = name; // 11. FIX: Changed undefined variable 'username' to received parameter 'name'
  res.send(user);
});

// 12. FIX: Changed assignment operator (=) to a strict equality comparison (===)
app.get("/user-notes/:userId", (req, res) => {
  const userId = Number(req.params.userId);
  const userNotes = notes.filter(n => n.userId === userId);
  res.send(userNotes);
});

// 13. FIX: Changed conditional OR (||) to AND (&&) so both inputs must match for a login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@test.com" && password === "123456") {
    res.send({ message: "Login successful" });
  } else {
    res.status(401).send({ message: "Invalid credentials" });
  }
});

// 14. FIX: Used .find() instead of .filter() so it reads the object profile directly instead of an array wrapper
app.get("/profile/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).send({ error: "User not found" });
  res.send(user.name);
});

// 15. FIX: Explicitly cast inputs to Numbers to prevent string concatenation (e.g. 1 + 2 becoming "12")
app.post("/sum", (req, res) => {
  const { a, b } = req.body;
  const total = Number(a) + Number(b);
  res.send({ total });
});

// 16. FIX: Aligned console logging port string to match the active runtime server port (3000)
app.listen(3000, () => {
  console.log("Server running on port 3000");
});