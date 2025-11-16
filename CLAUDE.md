# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Windows 98-themed album website for "Whitmo + Niko With K" featuring a Webamp music player in a nostalgic desktop environment. The entire website is a single-file HTML application with inline CSS and JavaScript, deployed as a static site on Vercel.

**Key Technologies:**
- Pure HTML/CSS/JavaScript (no build process required)
- [Webamp](https://webamp.org/) 1.4.2 (loaded via CDN)
- [98.css](https://jdan.github.io/98.css/) (loaded via CDN)
- Static deployment on Vercel

## Architecture

### Single-File Structure
The entire application lives in `index.html` with no external JavaScript or CSS files. This design choice simplifies deployment and eliminates build dependencies.

**Core Components:**
1. **Desktop Environment** - Windows 98 UI with taskbar, start button, and system clock
2. **Webamp Player** - Initialized with 5 album tracks from the `/music` directory
3. **Desktop Windows** - Three draggable, layered windows (About, Links, Inspiration)
4. **Desktop Icons** - Clickable icons that toggle window visibility

### Window Management System
Windows can be:
- Opened/closed by clicking desktop icons or window close buttons
- Dragged by their title bars (touch and mouse support)
- Brought to front with z-index stacking (highest z-index = 1000 when dragging)
- Multiple windows can be open simultaneously

The `toggleWindow()` function handles show/hide logic, while `makeDraggable()` implements drag-and-drop using both mouse and touch events.

### Music Player Integration
Webamp is configured in the `<script>` section with:
- 5 tracks loaded from `./music/*.wav` files
- Track metadata (artist, title, album, duration)
- Rendered into the `#app` container, centered on screen

## File Structure

```
album-1/
├── index.html              # Single-file application
├── background.webp          # Desktop wallpaper (3.1MB)
├── vercel.json            # CORS headers for static deployment
├── project-status.md      # Project planning/status document
├── music/                 # Album tracks (WAV format)
│   ├── Parade.wav
│   ├── Marusa is sneezing.wav
│   ├── The Boiler.wav
│   ├── Crazy Cat.wav
│   └── Mukha.wav
└── icons/                 # Desktop icon images
    ├── About This.png
    ├── Inspiration.png
    └── Links.png
```

## Development Workflow

### Testing Locally
Since this is a static site with no build process, simply open `index.html` in a browser:
```bash
open index.html
```

Or use a local server for proper CORS handling:
```bash
python3 -m http.server 8000
# Then visit http://localhost:8000
```

### Deployment
The site is configured for Vercel with CORS headers in `vercel.json`. To deploy:
```bash
vercel deploy
```

No build command is needed - Vercel serves the static files directly.

## Code Style & Conventions

### HTML Structure
- All styles are inline in `<style>` tags (no external CSS)
- All JavaScript is inline in `<script>` tags (no external JS)
- Windows 98 UI components use 98.css classes (`.window`, `.title-bar`, `.window-body`)

### CSS Organization
CSS is organized by component:
1. Body & Desktop background
2. Desktop icons
3. Webamp container positioning
4. Taskbar styling
5. Window positioning and visibility
6. Content styling (notes, links, inspiration)
7. Responsive breakpoints

### JavaScript Patterns
- Vanilla JavaScript (no frameworks)
- Direct DOM manipulation
- Event delegation for window interactions
- Functional approach for dragging logic

## Common Tasks

### Adding New Desktop Windows
1. Add desktop icon HTML in `#desktop` with `onclick="toggleWindow('windowId')"`
2. Add window HTML structure using 98.css classes
3. Add window ID to `toggleWindow()` function's `windows` object
4. Initialize with `makeDraggable()` and `bringToFront()` in DOMContentLoaded

### Modifying Track List
Edit the `initialTracks` array in the Webamp initialization:
```javascript
const webamp = new Webamp({
  initialTracks: [
    {
      metaData: { artist: "...", title: "...", album: "..." },
      url: "./music/filename.wav",
      duration: 150, // in seconds
    }
  ]
});
```

### Changing Background
Replace `background.webp` or modify the CSS:
```css
#desktop {
  background-image: url('./background.webp');
}
```

### Updating Content
Content is embedded in the HTML:
- **About**: `.note-content` in `#aboutWindow`
- **Links**: `.links-list` in `#linksWindow`
- **Inspiration**: `.inspiration-list` in `#inspirationWindow`

## Project Status

Refer to `project-status.md` for:
- Current phase progress
- Completed features
- Known limitations
- Future enhancement ideas

The project is deployment-ready with core functionality complete. Main remaining work involves content updates (real social links, inspiration details) rather than technical implementation.
