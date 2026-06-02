# Project Implementation Documentation

This document provides a quick overview and setup instructions for my full-stack submission, covering the mandatory bug-squashing task and both optional modules.

## 📁 Project Structure


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



## 🛠️ 1. Core Task: Bug Fixes

The original script was broken and would crash on startup. We got it running smoothly by making the following updates:

* ### Fixing Typos
  Corrected broken property references across the script, such as changing `.lenght` to `.length`.


* ### Correcting Variable Scopes
  Fixed misnamed variables so all data points and objects connect properly without throwing reference errors.


* ### Strict Type Evaluations
  Swapped in strict comparisons (`===`) to ensure 100% accurate data matching and routing.

  
* ### Server Return Statements
  Added missing return blocks inside the Express route handlers so the server never hangs up on a request.

---

## ⚙️ 2. Backend Task: API Upgrades

We built the complete Express API from scratch with several professional upgrades:



* ### Full CRUD Engine
  Created all 5 required REST endpoints (`GET /notes`, `POST /notes`, `GET /notes/:id`, `PUT /notes/:id`, `DELETE /notes/:id`).



* ### Input Field Validation
  The server actively rejects requests with a `400 Bad Request` error if a note title is missing, keeping the data clean.


* ### Smart Metadata Timestamps
  Automatically generates and updates ISO strings for both `createdAt` and `updatedAt` timestamps.


* ### Live Search & Sorting
  Added a substring search query filter and sorted the array response so the newest or most recently edited items always stay at the top.

---

## 💻 3. Frontend Task: Interactive UI

We built a responsive, fast user interface that synchronizes perfectly with our custom backend:

* ### Tailwind CSS Layout
  Designed a modern, clean dashboard interface that looks great on mobile, tablet, and desktop viewports.


* ### Smart Dynamic Form
  Utilized a single, reactive form that seamlessly changes contexts between "Create Note" and "Edit Note" modes depending on user actions.


* ### Optimized Query Search
  Added a 300ms delay (debouncing) to the search input field so it waits until the user finishes typing before hitting the server.


* ### Safety & Client Security
  Integrated native browser confirmation pop-ups before destructive deletions and included basic HTML sanitization to protect against XSS injection vulnerabilities.

---

## 🗄️ 4. Database Design: Relational Blueprint

To make the architecture production-ready, we designed a `schema.sql` file that maps out scalable data storage:

* ### Relational Integrity
  Created distinct structures for `users` and `notes` tables linked securely via Foreign Key constraints.


* ### Cascading Deletions
  Configured an `ON DELETE CASCADE` rule to automatically purge orphaned notes if a parent user profile is dropped.


* ### Performance Indexing
  Added structural index recommendations (B-Tree and GIN text vectors) to keep full-text searching and chronological sorting blazing fast.