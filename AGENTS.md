# Project Documentation

This is a React web application built with Vite.

## Project Structure

- `src/`: Frontend application source code.
- `src/components/`: Reusable React components and pages.
- `src/lib/`: Utility functions, configuration, and context.
- `src/hooks/`: Custom React hooks.
- `src/pages/`: Page-level components.
- `vite.config.js`: Vite configuration.
- `.env.local`: Local environment variables (never commit secrets).

## Getting Started

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Open the URL printed by Vite in your browser

## Available Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Check code quality
- `npm run lint:fix` - Fix linting issues
- `npm run typecheck` - Run TypeScript type checking
- `npm run preview` - Preview production build locally

## Development Workflow

- Keep changes focused and atomic
- Run `npm run lint` and `npm run typecheck` before committing
- Create a `.env.local` file for environment-specific configuration (not committed to version control)
