const API_BASE_URL = "http://localhost:5500";

// DOM Elements
const elements = {
  container: document.getElementById("notesContainer"),
  form: document.getElementById("noteForm"),
  idInput: document.getElementById("noteId"),
  titleInput: document.getElementById("noteTitle"),
  contentInput: document.getElementById("noteContent"),
  formTitle: document.getElementById("formTitle"),
  cancelBtn: document.getElementById("cancelEditBtn"),
  searchInput: document.getElementById("searchInput"),
  counter: document.getElementById("noteCounter"),
  alert: document.getElementById("formAlert")
};

let searchDebounceTimeout = null;

// --- Helper Functions ---
function showAlert(message, isError = true) {
  if (!elements.alert) return;
  elements.alert.textContent = message;
  elements.alert.className = `p-3 rounded-lg text-xs font-medium ${
    isError ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
  }`;
  elements.alert.classList.remove("hidden");
  setTimeout(() => elements.alert.classList.add("hidden"), 5000);
}

function escapeHTML(str) {
  if (!str) return "";
  return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}

function resetForm() {
  elements.idInput.value = "";
  elements.form.reset();
  elements.formTitle.textContent = "Create New Note";
  elements.cancelBtn.classList.add("hidden");
}

// --- API Interaction ---
async function fetchAndRenderNotes(search = "") {
  elements.container.innerHTML = `<div class="col-span-full py-12 text-center text-slate-400">Loading...</div>`;

  try {
    const url = `${API_BASE_URL}/notes?search=${encodeURIComponent(search)}`;
    const response = await fetch(url);
    
    // Check if the response was successful
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server responded with ${response.status}: ${errorText}`);
    }
    
    const notes = await response.json();
    elements.counter.textContent = notes.length;

    if (notes.length === 0) {
      elements.container.innerHTML = `<div class="col-span-full p-12 text-center text-slate-400">No notes found.</div>`;
      return;
    }

    elements.container.innerHTML = notes.map(note => `
      <div class="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
        <h4 class="font-semibold text-slate-900">${escapeHTML(note.title)}</h4>
        <p class="text-slate-600 text-sm mt-2">${escapeHTML(note.content)}</p>
        <div class="border-t mt-4 pt-3 flex justify-between text-xs text-slate-400">
          <span>${new Date(note.updated_at).toLocaleString()}</span> 
          <div class="flex gap-2">
            <button onclick="prepareEdit(${note.id})" class="text-indigo-600 font-medium">Edit</button>
            <button onclick="deleteNote(${note.id})" class="text-rose-600 font-medium">Delete</button>
          </div>
        </div>
      </div>
    `).join("");
  } catch (err) {
    console.error("Fetch error details:", err);
    elements.container.innerHTML = `<div class="col-span-full text-rose-600 p-6 text-center">Failed to load notes: ${err.message}</div>`;
  }
}

// --- Form & Action Handlers ---
elements.form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = elements.idInput.value;
  const payload = { 
    title: elements.titleInput.value.trim(), 
    content: elements.contentInput.value.trim() 
  };

  try {
    const method = id ? "PUT" : "POST";
    const url = id ? `${API_BASE_URL}/notes/${id}` : `${API_BASE_URL}/notes`;
    
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error("Operation failed.");

    showAlert(id ? "Updated!" : "Saved!", false);
    resetForm();
    fetchAndRenderNotes();
  } catch (err) {
    showAlert(err.message);
  }
});

window.prepareEdit = async function(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/notes/${id}`);
    const note = await res.json();
    elements.idInput.value = note.id;
    elements.titleInput.value = note.title;
    elements.contentInput.value = note.content;
    elements.formTitle.textContent = "Edit Note";
    elements.cancelBtn.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch {
    showAlert("Failed to load note data.");
  }
};

window.deleteNote = async function(id) {
  if (!confirm("Delete this note?")) return;
  try {
    await fetch(`${API_BASE_URL}/notes/${id}`, { method: "DELETE" });
    fetchAndRenderNotes();
  } catch {
    showAlert("Failed to delete note.");
  }
};

elements.searchInput.addEventListener("input", (e) => {
  clearTimeout(searchDebounceTimeout);
  searchDebounceTimeout = setTimeout(() => fetchAndRenderNotes(e.target.value), 300);
});

elements.cancelBtn.addEventListener("click", resetForm);

// Initial call
fetchAndRenderNotes();