# 🚪 Nobita's Great Escape

> **"Doraemooon! Help me!!"** > A strategic puzzle game where you help Nobita outsmart Gian, Suneo, and Sensei to reach safety.

## 🎮 Play it here -> [Start Game](https://kool-k.github.io/Grand-Escape-Game/)

![Project Banner](assets/city_bg.webp) 

## 📖 About The Project

**Nobita's Great Escape** is a turn-based strategy puzzle game built with vanilla JavaScript and the HTML5 Canvas API. Unlike standard mazes, this game uses a **Non-Planar Graph** structure where paths cross over each other, creating complex "choke points" and traps.

The player controls **Nobita**, who must navigate a neighborhood map to reach **Doraemon** and receive a secret gadget. However, three distinct AI enemies are hunting him down, each with a unique behavior pattern.

## ✨ Key Features

* **🧠 Dynamic AI Evolution:**
    * **Level 1 (Patrol Mode):** Enemies follow fixed, predictable routes. This level is designed for players to master the map topology and time their moves.
    * **Level 2 (Chase Mode):** The AI shifts to aggressive pathfinding (BFS). Enemies actively track your position and work together to corner you at choke points.
* **👆 Advanced Gesture Controls:** * **Slingshot Navigation:** Drag and release to move. A visual arrow guides your path.
    * **Smart Drag:** Detects swipe distance—short swipes pick close nodes, long swipes target further nodes.
    * **Bamboo Copter Feedback:** Real-time detection for invalid moves or blocked paths.
* **🕸️ Complex Graph Topology:** A custom-built 35-node mesh with hidden "switchback" routes essential for victory.
* **📱 Optimized Landscape UI:** Designed specifically for mobile landscape play with "safe-zone" rendering to prevent clipping on notched devices.

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (Flexbox, CSS Variables, Media Queries)
* **Logic:** Vanilla JavaScript (ES6+)
* **Algorithms:** Breadth-First Search (BFS) for pathfinding, Linear Interpolation (Lerp) for smooth animations.

## 🎮 How To Play

1.  **Objective:** Move Nobita (Yellow) to Doraemon (Blue/Goal) without landing on the same spot as an enemy.
2.  **Controls:**
    * **💻 Desktop:** **Click** on any connected node (highlighted with a red pulse) to move.
    * **📱 Mobile:** **Swipe/Drag** towards a red circle. Swipe further to reach more distant nodes.
3.  **AI Logic:** * In **Level 1**, villains follow a specific patrol path. Observe their patterns to find the perfect gap to pass.
    * In **Level 2**, villains track your movements in real-time. They work as a team to block your escape routes.

## 🚀 Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone [https://github.com/Kool-K/Grand-Escape-Game.git](https://github.com/Kool-K/Grand-Escape-Game.git)
    ```
2.  **Add Assets:** Ensure you have an `assets/` folder with character sprites and the city background.
3.  **Run the Game:** Open `index.html` in any modern web browser.

## 📂 Project Structure

```text
/nobita-escape
│
├── index.html        # Game container and UI overlays
├── style.css         # Styling, landscape optimizations, and safe-area insets
├── script.js         # Game loop, Graph logic, AI, and Gesture Handling
├── /assets           # Character sprites and background images
└── README.md         # Documentation
```

## ⚖️ Disclaimer & Credits
This project is a fan creation made for educational purposes. Characters belong to Fujiko F. Fujio and associated animation studios.

Fair Use: This project is not affiliated with or endorsed by the official license holders. No copyright infringement is intended.

Made with ❤️ and a Memory Bread by Ketaki Kulkarni.