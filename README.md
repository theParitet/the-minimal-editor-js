# The Minimal Editor

> [!WARNING]
> This repository contains a **legacy** JavaScript implementation and is no longer maintained.
>
> The **actively maintained and up-to-date** TypeScript version is available [here](https://github.com/theParitet/the-minimal-editor).

<p align="center">
    <img  src="public/thumbnail-v2.png" width="480" alt="the minimal editor thumbnail" />
</p>

The Minimal Editor is a web-based plain text editor designed for simplicity and focus. It runs entirely in your browser and uses local storage to save your work.

> [Live demo](https://theparitet.github.io/the-minimal-editor-js/)

## Features

- **File Management** – Create, edit, and delete notes with dedicated title and content sections.
- **Import & Export** – Import text files into the editor and export notes to your device.
- **Zen Mode** – A distraction-free mode that hides the interface, allowing to focus solely on writing.
- **Local Storage** – Data is automatically saved to the browser's local storage.
- **Responsive Design** – Accounts for different devices and screen sizes.
- **Configurable Appearance** – Customize the editor visuals through settings.

## Tech Stack

- **React 19**
- **Vite**
- **JavaScript**
- **CSS**
- **GitHub Actions** for deployment on **GitHub Pages**

## Getting Started

The list of operations to edit, run and preview the project locally:

### Install & Run

1.  **Clone the repository** (through SSH in this case)

    ```bash
    git clone git@github.com:theParitet/the-minimal-editor-js.git
    cd the-minimal-editor-js
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Start the development server**

    ```bash
    npm run dev
    ```

### Build

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

### Deployment

This project is automatically deployed to **GitHub Pages** via **GitHub Actions** workflows on push. The deployment pipeline enforces code quality standards:

- **Linting** – The code must pass ESLint checks (`npm run lint`).
- **Formatting** – The code must adhere to Prettier formatting (`npm run format:check` to check and `npm run format` to format).

The build is only accepted when these checks pass successfully.

## Project Structure

The project structure is organized as follows:

```
src/
├── Editor/         # Core editor components (input area, controls)
├── Modal/          # Modal components (Settings)
├── Notifications/  # Notification system components
├── Panel/          # Side panel for file management
├── Statuses/       # Import status indicators
├── assets/         # Static assets (fonts, icons)
├── App.jsx         # Main application component
└── main.jsx        # Entry point
```

## Roadmap

- Switch from `localStorage` (blocking) to `indexedDB` (async) using a wrapper (like `idb` or `Dexie.js`)
- Implement `StorageManager` browser API to allow persistence with the local machine and allow approximation of taken space.
- Explore the possibility of making the application to be PWA with Service Workers
- Searching and sorting
- Extended Theming (modern, neumorphism, glass; accent colors)
- Proper file structure (with directories)
- Add automatic title option based on content
- Verbose file panel (with partial content display)
