const API_BASE_URL = "http://localhost:5500";

// Select Elements
const notesContainer = document.getElementById("notesContainer");
const noteForm = document.getElementById("noteForm");
const noteIdInput = document.getElementById("noteId");
const noteTitleInput = document.getElementById("noteTitle");
const noteContentInput = document.getElementById("noteContent");
const formTitle = document.getElementById("formTitle");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const searchInput = document.getElementById("searchInput");
const noteCounter = document.getElementById("noteCounter");
const formAlert = document.getElementById("formAlert");

let searchDebounceTimeout = null;

// Display visual notifications for user CRUD operations
function showAlert(message, isError = true) {
  formAlert.textContent = message;
  formAlert.className = `p-3 rounded-lg text-xs font-medium ${
    isError ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
  }`;
  formAlert.classList.remove("hidden");
  setTimeout(() => formAlert.classList.add("hidden"), 5000);
}

// Fetch notes from API and render the view states
async function fetchAndRenderNotes(searchQuery = "") {
  notesContainer.innerHTML = `
    <div class="col-span-full py-12 text-center text-slate-400 animate-pulse text-sm font-medium">
      Synchronizing note index files...
    </div>
  `;

  try {
    const response = await fetch(`${API_BASE_URL}/notes?search=${encodeURIComponent(searchQuery)}`);
    if (!response.ok) throw new Error("Failed to pull current records.");
    
    const notes = await response.json();
    noteCounter.textContent = notes.length;

    if (notes.length === 0) {
      notesContainer.innerHTML = `
        <div class="col-span-full bg-white border border-dashed border-slate-200 rounded-xl p-12 text-center">
          <p class="text-slate-400 text-sm font-medium">No notes available matched your criteria.</p>
        </div>
      `;
      return;
    }

    notesContainer.innerHTML = notes.map(note => {
      const displayDate = new Date(note.updatedAt).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });

      return `
        <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
          <div>
            <h4 class="font-semibold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">${escapeHTML(note.title)}</h4>
            <p class="text-slate-600 text-sm whitespace-pre-wrap mb-4 break-words leading-relaxed">${escapeHTML(note.content) || '<span class="text-slate-300 italic text-xs">No body content</span>'}</p>
          </div>
          
          <div class="border-t border-slate-100 pt-3 mt-auto flex items-center justify-between text-xs text-slate-400">
            <span>Updated: ${displayDate}</span>
            <div class="flex items-center gap-2">
              <button onclick="prepareEditContext(${note.id})" class="text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 rounded hover:bg-indigo-50 transition-colors">Edit</button>
              <button onclick="executeDeleteContext(${note.id})" class="text-rose-600 hover:text-rose-800 font-medium px-2 py-1 rounded hover:bg-rose-50 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      `;
    }).join("");

  } catch (error) {
    notesContainer.innerHTML = `
      <div class="col-span-full bg-rose-50 border border-rose-100 rounded-xl p-6 text-center text-rose-600 text-sm font-medium">
        Unable to communicate with the local API server layer. Ensure server.js is running.
      </div>
    `;
  }
}

// Handle Form Submission (Create or Update)
noteForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const id = noteIdInput.value;
  const title = noteTitleInput.value.trim();
  const content = noteContentInput.value.trim();

  if (!title) {
    showAlert("Please enter a note title before saving.");
    return;
  }

  const payload = { title, content };
  const isEditing = id !== "";
  
  try {
    const url = isEditing ? `${API_BASE_URL}/notes/${id}` : `${API_BASE_URL}/notes`;
    const method = isEditing ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      let errorMessage = "Failed to process operations.";
      try {
        const data = await response.json();
        errorMessage = data.error || errorMessage;
      } catch (_) {
        // Fallback for non-JSON or missing error payloads
      }
      throw new Error(errorMessage);
    }

    showAlert(isEditing ? "Note updated successfully!" : "Note captured successfully!", false);
    resetFormState();
    fetchAndRenderNotes(searchInput.value);

  } catch (error) {
    showAlert(error.message);
  }
});

// Bind UI action targets to global runtime context scope
async function prepareEditContext(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`);
    if (!response.ok) throw new Error("Could not pull note parameters.");
    const note = await response.json();
    
    noteIdInput.value = note.id;
    noteTitleInput.value = note.title;
    noteContentInput.value = note.content;
    
    formTitle.textContent = "Modify Note Selection";
    cancelEditBtn.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    showAlert("Unable to access note item criteria data maps.");
  }
}

async function executeDeleteContext(id) {
  if (!confirm("Are you sure you want to delete this note?")) return;

  try {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to drop record item.");
    fetchAndRenderNotes(searchInput.value);
  } catch (error) {
    alert(error.message);
  }
}

// Attach action scopes to global execution space for inline template attributes
window.prepareEditContext = prepareEditContext;
window.executeDeleteContext = executeDeleteContext;

// Handle Input/Search Queries safely with a Debouncer
searchInput.addEventListener("input", (e) => {
  clearTimeout(searchDebounceTimeout);
  searchDebounceTimeout = setTimeout(() => {
    fetchAndRenderNotes(e.target.value);
  }, 300);
});

cancelEditBtn.addEventListener("click", resetFormState);

function resetFormState() {
  noteIdInput.value = "";
  noteForm.reset();
  formTitle.textContent = "Create New Note";
  cancelEditBtn.classList.add("hidden");
}

function escapeHTML(str) {
  if (!str) return "";
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// Initial Run-loop execution mapping invocation
fetchAndRenderNotes();