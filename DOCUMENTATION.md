# Project Implementation Documentation

This document provides a quick overview and setup instructions for my full-stack submission, covering the mandatory bug-squashing task and both optional modules.

## 📁 Project Structure

```text
popaya-assignment/
├── core/                  # 1. Core Task (Mandatory)
│   └── buggy-code/
│       └── debugging-assignment.js
├── backend/               # 2. Backend Task (Optional)
│   └── notes-api/
│       ├── package.json
│       ├── server.js
│       └── schema.sql     # Database Schema Design
└── frontend/              # 3. Frontend Task (Optional)
    ├── app.js
    └── index.html


**## 1. Core Task: Bug Fixes**


The original script was broken and would crash on startup. We got it running smoothly by:

Fixing typos (like changing .lenght to .length).

Correcting misnamed variables so everything connects properly.

Swapping in strict comparisons (===) to ensure accurate data matching.

Adding proper return statements so the server never hangs.

2. Backend Task: API Upgrades
We built the complete Express API from scratch with a few professional upgrades:

Full CRUD: Created all 5 required endpoints (GET, POST, PUT, DELETE).

Validation: Rejects requests with a 400 error if a title is missing, preventing blank notes.

Smart Timestamps: Automatically tracks and updates createdAt and updatedAt timestamps.

Live Search & Sort: Added a substring search engine and sorted the notes so the newest or most recently edited items always appear at the top.

3. Frontend Task: Interactive UI
We built a responsive, fast user interface that syncs perfectly with the backend:

Tailwind CSS: Designed a modern, clean dashboard that looks great on both mobile and desktop.

Smart Form: Used a single form that seamlessly switches between "Create Note" and "Edit Note" modes.

Optimized Search: Added a tiny 300ms delay to the search bar so it waits until you finish typing before hitting the server.

Safety & Security: Added a confirmation prompt before deleting items and put in basic HTML sanitization to protect against XSS attacks.

4. Database Design: Relational Blueprint
To make the project production-ready, we added a schema.sql design file that features:

Clear relational tables for users and notes linked with foreign keys.

A cascade delete setup (ON DELETE CASCADE) to clean up a user's notes automatically if their account is deleted.

Performance indexes to keep note searching and timestamp sorting lightning-fast as the data grows.