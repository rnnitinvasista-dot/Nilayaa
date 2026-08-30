# NILAYAA INTERIORS — 3D Interactive Luxury Web Experience

An architectural 3D website engineered for **Nilayaa Interiors** (Bengaluru, India), designed using the **UI/UX Pro Max** design intelligence system.

---

## 🌟 Key Highlights & Features

1. **Real-Time Interactive 3D Architectural Showroom**:
   - Built with **Three.js (WebGL 2.0)** and custom PBR shaders.
   - **Architectural Lighting Simulator**: Day Sun ☀️, Golden Sunset 🌅, and Velvet Midnight 🌙 with dynamic shadow recalculation.
   - **Real-Time Material Swatches**: Instant surface swapping between Italian Calacatta Gold Marble, Smoked Chevron Oak Wood, Brushed Champagne Brass, and Venetian Stucco Plaster.
   - **Multi-Perspective Camera System**: Fly-through Cinematic Tour 🎥, Lounge View 🛋️, Architectural Floorplan 📐, and Global Wide Angle 🌐.
   - **Interactive 3D Spatial Hotspots**: Live screen-space projected annotations for furniture and architectural specifications.

2. **UI/UX Pro Max Luxury Design System**:
   - **Color Palette**: Obsidian Charcoal (`#0a0a0f`), Architectural Surface (`#12121a`), Champagne Gold (`#d4af37`), and Warm Bronze (`#c5a880`).
   - **Typography Stack**: Display headings in `Cinzel` & `Playfair Display` with body typography in `Plus Jakarta Sans` and metrics in `JetBrains Mono`.
   - **Glassmorphic Elevations**: Multi-layer frosted glass panels with `backdrop-filter: blur(20px)` and subtle gold glowing boundaries.

3. **Interactive Renovation Before & After Slider**:
   - Split-screen swipeable comparison slider showcasing raw shell vs. luxury turnkey execution for an Indiranagar penthouse.

4. **Interactive Interior Project Cost & Timeline Estimator**:
   - Dynamic real-time calculation based on property format (2BHK, 3BHK, 4BHK, Villa), carpet area, design finishing tier, and custom scope add-ons.
   - Immediate budget projection in Lakhs/Crores with execution timeline estimates.

5. **Bengaluru Studio Location & Consultation Booking**:
   - Integrated Google Maps link & Basavanagudi studio coordinates (`https://share.google/hEvtEjy7T6Bou6YSK`).
   - Instant consultation booking form with direct WhatsApp API connect.

---

## 🚀 Quick Start

### Option 1: Direct Browser Viewing
Double-click or open `index.html` in any modern web browser (Chrome, Edge, Safari, Firefox).

### Option 2: Local Node.js Server
Run the zero-dependency built-in server:
```bash
node server.js
```
Then navigate to `http://localhost:3000` in your browser.

---

## 📁 Project Structure

```
d:/new project/
├── index.html                   # Master entry point & semantic HTML5 structure
├── server.js                    # Zero-dependency Node.js HTTP server
├── package.json                 # Project configuration
├── README.md                    # Project documentation
├── css/
│   └── style.css                # UI/UX Pro Max luxury design system & responsive styling
├── js/
│   ├── scene3d.js               # Three.js 3D WebGL engine & procedural PBR textures
│   ├── configurator.js          # Material, lighting & camera UI controller
│   ├── calculator.js            # Interior project cost & timeline estimator
│   └── app.js                   # Navigation, before/after slider, portfolio & form handling
└── .agents/skills/ui-ux-pro-max # Installed UI/UX Pro Max design intelligence skill
```
