<div align="center">

# ✨ DevCraft Suite ✨
### An Ultra-Premium, Sleek Matte Developer Utility Dashboard

[![Live Demo](https://img.shields.io/badge/Live-Demo-purple?logo=google-chrome&style=for-the-badge)](https://ayanlogix.github.io/dev-craft/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/ayanlogix/dev-craft/pulls)

**DevCraft Suite** is a beautifully designed, high-performance single-page web application featuring essential local tools for developers. Built with a sleek matte Vercel-style aesthetic, fluid micro-animations, and customizable HSL themes.

[**Explore the Code**](file:///C:/Users/Ayan...!!!/.gemini/antigravity/scratch/dev-utility-suite) • [**Report Bug**](https://github.com/ayanlogix/dev-craft/issues) • [**Request Feature**](https://github.com/ayanlogix/dev-craft/issues)


</div>

---

## 🛠️ Included Tools

1. **JSON Formatter & Validator**
   - Syntax highlight JSON inputs on the fly (keys, strings, numbers, booleans, and nulls).
   - Format with 2-spaces indent or minify into a compact string.
   - Real-time syntax validation with helper error diagnostics pointing directly to issues.

2. **JWT Decoder**
   - Decode standard JSON Web Tokens locally.
   - View structured header properties and payload contents with visual syntax highlighting.
   - Decode timestamps (`exp`, `iat`) into readable local dates and displays active/expired status alerts.

3. **Regular Expression Tester**
   - Test patterns in real-time on custom target text bodies.
   - High-fidelity visual highlight overlay illustrating matched segments.
   - Detail capture groups ($1, $2, etc.) and indices.
   - Quick-load preset patterns (Email, URL, Phone, Date, and Numbers).

4. **CSS Glassmorphism Generator**
   - Fine-tune opacity, blur radius, tint color, border width, and saturation using interactive sliders.
   - Live visual credit card preview floating over moving colorful gradient balls.
   - One-click copy for optimized CSS rules and HTML components.

5. **Color Palette Designer**
   - Generate beautiful color theories (Analogous, Monochromatic, Complementary, Triadic, Split-Complementary).
   - Interactive color picker sync.
   - WCAG 2.1 Contrast Ratio checks for text combinations (AA / AAA compliance tests).
   - One-click copy for custom CSS custom properties and Tailwind configurations.

6. **Base64 Encoder/Decoder & Image Converter**
   - Encode standard strings into Base64 or decode Base64 back into plain text in real-time.
   - Drag-and-drop local file processing to instantly convert them into Base64 payloads (supports PNG, JPG, SVG, WebP, etc.).
   - Generates ready-to-copy HTML `<img>` tags, CSS background URL values, Data URLs, and Raw Base64 strings.
   - Inlined interactive thumbnail previews for images and file metadata displays.

---

## 🔒 Security & Privacy First

**Zero Network Calls.** All parsing, decoding, highlighting, and palette generation logic runs strictly in your web browser. No token payloads, JSON data, or tested scripts are ever sent to any remote server. Completely offline-capable.

---

## 🎨 Design Systems & Tech Stack

- **Core Structure:** Semantic HTML5 and pure modular ES6 JavaScript.
- **Styling:** Vanilla CSS3 utilizing CSS custom properties for instant dark/light theme switching.
- **Typography:** Loading [Google Fonts Outfit](https://fonts.google.com/specimen/Outfit) for headers and [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) for user interfaces. Monospace blocks load [Fira Code](https://fonts.google.com/specimen/Fira+Code).
- **Icons:** Custom embedded inline SVGs for instant loading and custom CSS micro-animations.

---

## 📂 Project Architecture

```text
dev-utility-suite/
│
├── index.html          # Core single-page entry layout shell
│
├── styles/
│   ├── main.css        # Variables, reset rules, animations, theme, and sidebar styles
│   └── tools.css       # Layout styles specific to JSON, JWT, Regex, Glass, and Color views
│
└── js/
    ├── main.js         # Navigation router, theme coordinator, and shared utilities
    ├── json-tool.js    # JSON parsing and syntax coloring modules
    ├── jwt-tool.js     # JWT decoding logic and date handlers
    ├── regex-tool.js   # Regex engines and highlight rendering
    ├── glass-tool.js   # CSS glassmorphism code generator
    ├── color-tool.js   # HSL rotations and WCAG compliance tests
    └── base64-tool.js  # Base64 encoder/decoder and file processor
```

---

## 🚀 Getting Started

### Prerequisites

Since this app runs purely on the client-side, you do not need to install complex dependencies! 

### Running Locally

To run the application locally, you can use any simple HTTP server. Below are a few quick options:

#### Option 1: Python HTTP Server (Built-in)
Run the following command from the root directory:
```bash
python -m http.server 8085
```
Then navigate to `http://localhost:8085` in your web browser.

#### Option 2: Live Server (VS Code Extension)
Right-click `index.html` and click **"Open with Live Server"**.

#### Option 3: Node.js (npx)
```bash
npx live-server
```

---

## 🚀 Easy Deployment

This project is fully ready for one-click deployment to static hosts:

### Option 1: Double-Click Netlify Deploy (Instant Live Link)
We have added a custom deployment utility to this project:
1. Open the project folder and double-click **`deploy_to_netlify.bat`**.
2. It will automatically zip your files, create a new site on Netlify, upload it, and print your **Live URL** within seconds!

### Option 2: GitHub Pages (Permanent Free Hosting)
1. Push this directory to your GitHub repository (`https://github.com/ayanlogix/dev-craft.git`).
2. Go to your repository settings on GitHub: **Settings > Pages**.
3. Under **Build and deployment**, select **Deploy from a branch** and select your `main` branch.
4. Click Save. Your suite will be live in a few minutes at:
   `https://ayanlogix.github.io/dev-craft/`

### Option 3: Netlify / Vercel Web App
Simply drag and drop the folder into the Netlify Drop dashboard, or import your Git repository directly. No build settings or configuration adjustments required!


---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
