# 🚀 Prahlad Inala | Portfolio & Digital Garden

Welcome to the source code of my personal portfolio and digital garden, built with the cutting-edge ecosystem of React and Next.js. This project isn't just a static resume—it's a fully interactive platform featuring dynamic MDX notes, a built-in command palette, an AI chat widget, and a completely localized headless CMS.

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)

---

## ✨ Features

- 📝 **Digital Garden (MDX)**: A comprehensive notes platform with syntax highlighting, dynamic table of contents, and Giscus comments.
- 🎨 **Keystatic CMS**: Fully integrated local headless CMS. Manage projects, skills, site settings, and notes directly from `/keystatic`.
- ⌘ **Command Palette**: Press `Ctrl+K` (or `Cmd+K`) to instantly navigate the site, toggle themes, or search for content.
- 🖨️ **Print-Perfect Resume**: The `/resume` route features highly-optimized `@media print` rules. Press `Ctrl+P` to instantly generate a professional, ink-friendly A4 PDF.
- 🌓 **Advanced Theming**: Supports Light, Dark, and a special **Focus Mode** (for distraction-free reading).
- 🖼️ **Dynamic SEO & OG Images**: Auto-generates OpenGraph images and injects rigorous JSON-LD structured data for perfect Google indexing.
- 🤖 **Interactive Widgets**: Includes a custom context menu, text-selection actions, and a floating AI Assistant.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **UI Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Content Management:** [Keystatic](https://keystatic.com/)
- **Search:** [Fuse.js](https://fusejs.io/)
- **MDX Parsing:** `next-mdx-remote` & `rehype-highlight`

---

## 🚀 Getting Started

To run this project locally, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/prahladinala/prahladinala-portfolio.git
cd prahladinala-portfolio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```
The site will be available at [http://localhost:3000](http://localhost:3000).

---

## ✍️ Managing Content (CMS)

This project uses **Keystatic** to manage content via local Markdown/JSON files. You do not need an external database.

1. Start the dev server (`npm run dev`).
2. Navigate to [http://localhost:3000/keystatic](http://localhost:3000/keystatic).
3. From the dashboard, you can visually create/edit:
   - **Notes** (Blog posts)
   - **Projects**
   - **Experiences**
   - **Skills**
   - **Global Site Settings** (Toggle Maintenance Mode, Notes, Themes, etc.)

*(Note: In production, Keystatic is locked down. Content changes are made locally and committed to GitHub).*

---

## 🌐 Deployment

This project is optimized for deployment on [Vercel](https://vercel.com).
Since all content is stored as local JSON/MDX files within the repo, pushing to the `master` branch will automatically trigger a new optimized static build.

---

## 📄 License

Designed and developed by Prahlad Inala.  
Released under the [MIT License](LICENSE).
