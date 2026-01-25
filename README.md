# 🚪 Nobita's Great Escape

> **"Doraemooon! Help me!!"** > A strategic puzzle game where you help Nobita outsmart Gian, Suneo, and Sensei to reach safety.

## 🎮 Play it here -> [Start Game](https://kool-k.github.io/Grand-Escape-Game/)

![Project Banner](assets/city_bg.webp) 

## 📖 About The Project

**Nobita's Great Escape** is a turn-based strategy puzzle game built with vanilla JavaScript and the HTML5 Canvas API. Unlike standard mazes, this game uses a **Non-Planar Graph** structure where paths cross over each other, creating complex "choke points" and traps.

The player controls **Nobita**, who must navigate a neighborhood map to reach **Doraemon** and receive a secret gadget. However, three distinct AI enemies are hunting him down, each with a unique behavior pattern.

## ✨ Key Features

* **🧠 Smart "Pincer" AI:**
    * **Gian:** Aggressive chaser who cuts off the shortest path.
    * **Suneo:** "Camper" logic that predicts your movement and blocks mid-map hubs.
    * **Sensei:** Zones areas to trap you in dead ends.
* **👆 New Gesture Controls (Mobile):** * **Slingshot Navigation:** Drag and release to move. A visual arrow guides your path.
    * **Smart Drag:** Detects swipe distance—short swipes pick close nodes, long swipes target further nodes.
    * **Bamboo Copter Feedback:** Smart detection for invalid moves or blocked paths.
* **🕸️ Complex Graph Topology:** A custom-built 35-node mesh with hidden "switchback" routes essential for victory.
* **📱 True Landscape Mode:** Optimized specifically for mobile landscape gaming with "safe-zone" rendering to prevent UI clipping on notched devices.
* **🎨 Polished UI:** Features Glassmorphism overlays, "Juicy" animations, and dynamic feedback.

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (Flexbox, CSS Variables, Media Queries)
* **Logic:** Vanilla JavaScript (ES6+)
* **Rendering:** HTML5 Canvas API (60FPS rendering loop with dirty-rectangle clearing)
* **Algorithms:** Breadth-First Search (BFS) for pathfinding, Linear Interpolation (Lerp) for smooth animations.

## 🎮 How To Play

1.  **Objective:** Move Nobita (Yellow) to Doraemon (Blue/Goal) without landing on the same spot as an enemy.
2.  **Controls:**
    * **💻 Desktop:** Simply **Click** on any connected node (highlighted with a red pulse) to move.
    * **📱 Mobile:** * **Swipe/Drag** towards a red circle. 
        * **Short Swipe:** Moves to the nearest neighbor.
        * **Long Swipe:** Moves to a further node (useful for straight lines).
3.  **Rules:**
    * It is turn-based. You move once, then *all* enemies move once.
    * If an enemy catches you, it's **Game Over**.
    * If you try to move to an unconnected node, the **Bamboo Copter** warning will appear.

## 🚀 Installation & Setup

No build tools or servers required! This is a static web project.

1.  **Clone the repository** (or download the files):
    ```bash
    git clone [https://github.com/Kool-K/Grand-Escape-Game.git](https://github.com/Kool-K/Grand-Escape-Game.git)
    ```
2.  **Add Assets:**
    * Ensure you have an `assets/` folder containing images for: `nobita.webp`, `gian.webp`, `suneo.webp`, `sensei.webp`, `doraemon.webp`, `mom.webp`, and `city_bg.webp`.
3.  **Run the Game:**
    * Simply open `index.html` in any modern web browser (Chrome, Firefox, Safari).
    * *Optional:* Use the "Live Server" extension in VS Code for the best experience.

## 📂 Project Structure

```text
/nobita-escape
│
├── index.html        # Game container, mobile rotation lock, and UI overlays
├── style.css         # Styling, landscape optimizations, and safe-area insets
├── script.js         # Game loop, Graph logic, AI, Gesture Handling, and Canvas rendering
├── /assets           # Character sprites and background images
└── README.md         # You are here!
```

## ⚖️ Disclaimer & Credits
This project is a non-profit fan creation made for educational purposes.

Characters & IP: All rights to Doraemon, Nobita Nobi, Takeshi Goda (Gian), Suneo Honekawa, and other related characters belong to Fujiko F. Fujio, TV Asahi, Shin-Ei Animation, and ADK.

Fair Use: This project is not affiliated with or endorsed by the official license holders. No copyright infringement is intended.

Made with ❤️ and a Memory Bread.