# Engineering Guidelines

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Three.js (React Three Fiber + Drei)
- GSAP
- Supabase
- PostgreSQL

---

# Principles

- Mobile First
- Server Components by default
- Client Components only when necessary
- Reusable components
- Clean architecture
- Performance first

---

# Folder Structure

app/
components/
features/
hooks/
lib/
services/
types/
utils/
public/
styles/

---

# Feature Modules

features/

auth/

studio/

booking/

schedule/

dashboard/

Each feature contains:

components/

hooks/

services/

types/

actions/

---

# Component Rules

- One responsibility per component
- Max 200 lines/component (preferred)
- Reusable before duplicated
- Strong typing
- Props interface required

---

# Naming

PascalCase

Components

camelCase

Functions

kebab-case

Folders

UPPER_CASE

Constants

---

# Styling

Tailwind only.

Avoid inline styles.

Use CSS variables for colors.

Spacing follows design system.

---

# State Management

Local State

React State

Server State

Supabase

Global State (if needed)

Zustand

Avoid unnecessary global state.

---

# Data Fetching

Server Components first.

Client fetching only for:

- realtime
- forms
- interactive data

---

# API

Use Server Actions whenever possible.

Avoid unnecessary API routes.

Validate every input.

---

# Supabase

Use Row Level Security.

Never expose service role key.

Separate client and server instances.

---

# Database

UUID primary keys.

created_at

updated_at

Soft delete when needed.

Foreign keys required.

---

# Forms

React Hook Form

Zod Validation

Inline validation

Clear error messages

---

# Authentication

Supabase Auth

Protected Routes

Middleware

Role-based access

---

# File Upload

Supabase Storage

Compress images

Unique filenames

Limit file size

---

# Images

Next/Image

Lazy loading

WebP / AVIF

Responsive sizes

---

# Three.js Rules

Only in Studio Detail.

Lazy load.

Compressed models (.glb).

OrbitControls limited.

Target 60 FPS.

---

# GSAP Rules

Use for:

- Hero
- Reveal
- Scroll
- Page transition

Avoid over-animation.

---

# Performance

Dynamic imports

Code splitting

Memoization when needed

Lazy loading

Image optimization

Prefetch important routes

---

# Accessibility

Semantic HTML

Keyboard support

Visible focus

ARIA when needed

WCAG AA

---

# SEO

Metadata API

Open Graph

Structured Data

Sitemap

Robots.txt

---

# Git

main

production

develop

development

feature/*

new features

fix/*

bug fixes

---

# Code Quality

ESLint

Prettier

Strict TypeScript

No unused code

Meaningful comments only

---

# Golden Rules

Build reusable components.

Prefer composition.

Keep pages lightweight.

Optimize before adding effects.

Performance over complexity.

Never sacrifice UX for animation.