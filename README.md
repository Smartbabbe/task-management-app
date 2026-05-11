# Taskly — Task Management App

> A full-featured task manager with Kanban drag-and-drop 
> and list views, priority levels, due date tracking, 
> tag filtering, dark mode, and localStorage persistence.

🔗 **Live demo:** [https://task-management-app-ashen-psi.vercel.app/]

---

## Overview

Taskly is a productivity app built to handle real task 
management needs. It supports two views — a Kanban board 
with drag-and-drop and a traditional list view — with 
tasks that persist across sessions using localStorage.

---

## Features

- **Kanban board view** — drag and drop tasks between 
  To Do, In Progress, and Done columns
- **List view** — traditional task list with sorting 
  and filtering
- **Priority levels** — Low, Medium, High with 
  visual indicators
- **Due date tracking** — set due dates with 
  overdue highlighting
- **Tag filtering** — tag tasks and filter by tag
- **Dark mode** — full dark/light theme toggle
- **localStorage persistence** — tasks save 
  automatically, survive page refresh
- **Fully responsive**

---

## Tech Stack

![React](https://img.shields.io/badge/-React-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/-Tailwind-38BDF8?style=flat&logo=tailwind-css&logoColor=white)
![hello-pangea/dnd](https://img.shields.io/badge/-@hello--pangea/dnd-FF6B6B?style=flat)

---

## Getting Started

```bash
git clone https://github.com/Smartbabbe/task-management-app
cd task-management-app
npm install
npm run dev
```

---

## Key Implementation Details

- Drag and drop powered by @hello-pangea/dnd — 
  a maintained fork of react-beautiful-dnd
- Task state managed with useReducer for 
  predictable state updates
- localStorage sync via useEffect — saves on 
  every state change, loads on mount
- TypeScript interfaces for Task, Priority, 
  Column, and Tag types
- Overdue detection — compares due date to 
  today's date on render

---

## Contact

Built by **Esther Israel**
🌐 [Portfolio](https://personal-portfolio-site-ten-rouge.vercel.app) 
· 📩 estherisrael036@gmail.com 
· 🐦 [@thesmarrtDev](https://twitter.com/thesmarrtDev)
