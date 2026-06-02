# Project Implementation Documentation

This document provides a quick overview and setup instructions for my full-stack submission, covering the mandatory bug-squashing task and both optional modules.

## 📁 Project Structure


popaya-assignment/
├── core/                  # Task 1: Bug Fixes (Mandatory)
│   └── buggy-code/
│       └── debugging-assignment.js
│
├── backend/               # Task 2: Express Backend API
│   └── notes-api/
│       ├── package.json
│       ├── server.js      <-- Main Server File
│       └── schema.sql     <-- Database Schema Design
│
└── frontend/              # Task 3: Interactive Dashboard UI
    └── notes-ui/
        ├── index.html     <-- View Layout
        └── app.js         <-- Fetch & Logic Handler

---

## 🛠️ 1. Fixing the Bugs

The original codebase was crashing on startup. We brought it back to life with a few critical fixes:

* **Fixed Typos:** Cleaned up broken syntax across the scripts (like fixing `.lenght` to `.length`).

* **Fixed Variable Scopes:** Connected misnamed variables so objects can talk to each other without throwing reference errors.

* **Safer Matching:** Swapped in strict comparisons (`===`) to ensure accurate data matching.

* **No More Hanging Server:** Added missing `return` statements in the Express routes so requests never get stuck waiting for a response.

---

## ⚙️ 2. Upgrading the Backend API

We built a complete, robust Express API from scratch with a few clever upgrades:

* **Full CRUD Support:** Added all 5 essential routes to create, read, update, and delete notes.
* **Input Validation:** The server automatically blocks empty note titles with a `400 Bad Request` error to keep data clean.
* **Automatic Timestamps:** Every note now tracks exactly when it was created and last updated using ISO strings.
* **Live Search & Sorting:** Built a search filter into the `GET` route and sorted the list so your most recently edited notes always float to the top.

---

## 💻 3. Polishing the Frontend UI

We built a clean, fast web dashboard that syncs perfectly with our backend API:

* **Modern Layout:** Styled the app with Tailwind CSS to make it fully responsive and look great on any screen.
* **Smart Form:** Used a single form that smoothly shifts between "Create Note" and "Edit Note" modes depending on what you click.
* **Smoother Search:** Added a tiny 300ms delay (debouncing) to the search bar so it waits for you to finish typing before asking the server for data.
* **Safety First:** Added a confirmation popup before deleting notes, and included basic HTML sanitization to protect the app from malicious code injections.

---

## 🗄️ 4. Designing the Database Blueprint

To make the app production-ready, we mapped out a scalable database schema in a `schema.sql` file:

* **Connected Tables:** Set up separate tables for `users` and `notes`, linking them safely using foreign keys.
* **Clean Deletions:** Configured `ON DELETE CASCADE` so if a user account is deleted, their notes are automatically cleaned up too.
* **Built for Speed:** Added indexing recommendations to keep database searches and date sorting incredibly fast, even with thousands of notes.