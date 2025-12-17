# The Minimal Editor

<p align="center">
    <img  src="public/thumbnail-v2.png" width="480" alt="the minimal editor thumbnail" />
</p>

The Minimal Editor is a web plain text editor.

> [Live demo](https://theparitet.github.io/the-minimal-editor-js/)

## Features

- Notes with title and content sections
- Import and export workflows with status feedback
- Distraction-free Zen mode
- Configurable appearance

## Tech

- React (19)
- JavaScript (planned migration to TypeScript)
- Vite

## Roadmap

- Switch from `localStorage` (blocking) to `indexedDB` (async) using a wrapper (like `idb` or `Dexie.js`)
- Implement `StorageManager` browser API to allow persistence with the local machine and allow approximation of taken space.
- Explore the possibility of making the application to be PWA with Service Workers
- Searching and sorting
- Appearance Themes
- Proper file structure (with directories)
- Add automatic title option based on content
- Verbose file panel (with partial content display)
