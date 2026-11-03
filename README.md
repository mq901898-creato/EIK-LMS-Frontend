# EIK LMS frontend

React, Vite, and Material UI frontend for the EIK Learning Management System.

## Local development

1. Copy `.env.example` to `.env`.
2. Set `VITE_API_URL` to the backend API URL, including `/api` (for example, `http://localhost:5000/api`).
3. Install dependencies and run the frontend:

   ```sh
   npm install
   npm run dev
   ```

## Deploy to Vercel

Import the frontend GitHub repository as a Vercel project. Use the repository root as the project root and the Vite preset (or let Vercel detect it). The build command is `npm run build`; the output directory is `dist`.

Add this environment variable in the Vercel project settings for Production, Preview, and Development:

| Name | Value |
| --- | --- |
| `VITE_API_URL` | `https://<your-backend-project>.vercel.app/api` |

Use the actual backend deployment URL. Vite embeds `VITE_` variables at build time, so redeploy after changing one. Client-side route refreshes are rewritten to the app entry point by `vercel.json`.
