# SkillBridge / DumbDuck PWA — UI-UX Pro Max Design System

This document specifies the elevated visual design system, UI tokens, color palettes, micro-interactions, and typography for the DumbDuck mobile Progressive Web Application, synthesized using the UI-UX Pro Max intelligence system and Stitch Build Loop standards.

## 1. Core Typography Hierarchy
- **Headings:** `Poppins` (Bold 700, SemiBold 600) — High impact, crisp, modern academic aesthetic
- **Body Text:** `Inter` (Regular 400, Medium 500, SemiBold 600) — Optimal legibility & WCAG AA contrast ratio (>4.5:1)
- **Monospace / Code:** `Fira Code` (Regular 400, Medium 500) — For statistics, time, dates, code snippets & AI tags

## 2. Calibrated Color System (Emerald-Teal Fresh Luxe Aesthetic)
- **Primary Emerald:** `#10B981` (Vibrant Emerald) / `#059669` (Medium Emerald)
- **Secondary Teal:** `#14B8A6` (Soft Teal) / `#0D9488` (Deep Teal)
- **Accent Lime/Amber:** `#84CC16` (Bright Lime) / `#F59E0B` (Warm Amber Accent)
- **Light Background:** `#F0FDF4` (Soft Mint Off-White) / `#E6F4EA` (Subtle Glass Layer)
- **Dark OLED Surface:** `#064E3B` (Dark Emerald Slate) / `#022C22` (Deep Obsidian Emerald) / `#0F172A` (Slate 900)
- **Card Surface Light:** `#FFFFFF` (Pure White Glass, 80%-95% opacity with `backdrop-blur-md`)
- **Card Surface Dark:** `#065F46` / `#1E293B` (Dark Glass Surface with `backdrop-blur-md`)
- **Text Contrast Light:** Primary Slate `#064E3B` / Muted Emerald `#047857`
- **Text Contrast Dark:** Primary Mint `#F0FDF4` / Muted Mint `#A7F3D0`

## 3. UI Tokens & Physicality Standards
- **Border Radius:** `20px` for hero cards & main widgets, `14px` for action cards/buttons, `9999px` for pill chips
- **Glassmorphism & Borders:** `backdrop-blur-md border border-emerald-100/80 dark:border-emerald-800/40`
- **Elevation & Shadows:** 
  - `shadow-card`: `0 4px 24px -2px rgba(16, 185, 129, 0.08), 0 2px 8px -1px rgba(16, 185, 129, 0.04)`
  - `shadow-glow`: `0 0 24px rgba(16, 185, 129, 0.35)`
  - `shadow-nav`: `0 -4px 24px -2px rgba(16, 185, 129, 0.10)`
- **Micro-Interactions:**
  - Transitions: `transition-all duration-200 ease-out`
  - Hover States: Subtle lift (`hover:-translate-y-0.5 hover:shadow-md`) + border highlight (`hover:border-emerald-300`)
  - Press Feedback: Scale compression (`active:scale-[0.98]`)
  - Cursor Feedback: Explicit `cursor-pointer` on all interactive cards, pills, buttons, and rows

## 4. Pre-Delivery Quality Checklist
- [x] No raw emojis as UI icons — SVG icons (Heroicons/Lucide) exclusively used
- [x] High text contrast ratio (WCAG AA compliance) across both light & dark modes
- [x] Cursor-pointer on all clickable components
- [x] Smooth 150ms-300ms transitions without layout shift
- [x] Element placements strictly preserved with maximum aesthetic refinement

## 5. Design System Notes for Stitch Generation
> [!IMPORTANT]
> When generating or updating screens for the DumbDuck project:
> - Primary Color: `#10B981` (Emerald Green)
> - Secondary Color: `#14B8A6` (Soft Teal)
> - Background Color: `#F0FDF4` (Soft Mint Off-White) / Dark: `#022C22`
> - Card Surface: `#FFFFFF` / `#0F172A` with `20px` border-radius, `shadow-card`, and `backdrop-blur-md`
> - Typography: Poppins for headings, Inter for body, Fira Code for metrics
> - Device Type: MOBILE

