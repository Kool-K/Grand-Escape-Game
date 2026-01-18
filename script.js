const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('start-screen');
const endScreen = document.getElementById('end-screen');
const endTitle = document.getElementById('end-title');
const endMessage = document.getElementById('end-message');
const turnCount = document.getElementById('turn-count');
const dialogBox = document.getElementById('dialog-box');

// config
const LOGICAL_WIDTH = 950;
const LOGICAL_HEIGHT = 650;

// mobile detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// visual settings
const VISUAL_RADIUS = 24; 
const HIT_RADIUS = 50; 
const ANIMATION_SPEED = 0.15; 

// Disable shadows on mobile
const SHADOW_BLUR = isMobile ? 0 : 10;
const SHADOW_OFFSET = isMobile ? 0 : 5;

const COLORS = {
    nobita: "#f1c40f", 
    gian: "#e67e22", 
    suneo: "#2ecc71", 
    sensei: "#795548", 
    goal: "#f39c12",
    road: "#576574", 
    roadDash: "#ffffff",
    nodeFill: "rgba(255, 255, 255, 0.95)",
    nodeBorder: "#2c3e50",
    highlight: "#ff4757" 
};

const sprites = {
    nobita: new Image(), gian: new Image(), suneo: new Image(), sensei: new Image(), doraemon: new Image()
};
sprites.nobita.src = "assets/nobita.webp";
sprites.gian.src = "assets/gian.webp";
sprites.suneo.src = "assets/suneo.webp";
sprites.sensei.src = "assets/sensei.webp";
sprites.doraemon.src = "assets/doraemon.webp";

// map/maze
const nodes = [
    { id: 0, x: 80,  y: 80,  neighbors: [1, 5, 12] }, 
    { id: 1, x: 230, y: 70,  neighbors: [0, 2, 6] },
    { id: 2, x: 380, y: 70,  neighbors: [1, 3, 7] },
    { id: 3, x: 530, y: 70,  neighbors: [2, 4, 8] },
    { id: 4, x: 680, y: 80,  neighbors: [3, 9, 11] }, 
    { id: 5, x: 100, y: 190, neighbors: [0, 6, 12, 19] },
    { id: 6, x: 250, y: 200, neighbors: [1, 5, 7, 13] },
    { id: 7, x: 400, y: 190, neighbors: [2, 6, 8, 14] },
    { id: 8, x: 550, y: 200, neighbors: [3, 7, 9, 15] },
    { id: 9, x: 700, y: 190, neighbors: [4, 8, 10] },
    { id: 10, x: 820, y: 200, neighbors: [9, 11, 24] },
    { id: 11, x: 840, y: 80,  neighbors: [4, 10, 34] }, 
    { id: 12, x: 120, y: 320, neighbors: [0, 5, 13, 26] },
    { id: 13, x: 270, y: 310, neighbors: [0, 6, 12, 14, 27] },
    { id: 14, x: 420, y: 320, neighbors: [7, 13, 15, 28] },
    { id: 15, x: 570, y: 310, neighbors: [8, 14, 16, 29] },
    { id: 16, x: 720, y: 320, neighbors: [15, 17, 30] },
    { id: 17, x: 820, y: 310, neighbors: [16, 18, 31] },
    { id: 18, x: 780, y: 150, neighbors: [17, 24] },
    { id: 19, x: 100, y: 450, neighbors: [5, 20, 26] },
    { id: 20, x: 250, y: 440, neighbors: [6, 19, 21, 27] },
    { id: 21, x: 400, y: 460, neighbors: [7, 20, 22, 28] },
    { id: 22, x: 550, y: 440, neighbors: [8, 21, 23, 29] },
    { id: 23, x: 700, y: 460, neighbors: [22, 24, 30] },
    { id: 24, x: 800, y: 440, neighbors: [10, 18, 23, 31] },
    { id: 25, x: 900, y: 380, neighbors: [24, 34] }, 
    { id: 26, x: 140, y: 560, neighbors: [12, 19, 27] },
    { id: 27, x: 290, y: 550, neighbors: [13, 20, 26, 28] },
    { id: 28, x: 440, y: 570, neighbors: [14, 21, 27, 29] },
    { id: 29, x: 590, y: 560, neighbors: [15, 22, 28, 30] },
    { id: 30, x: 740, y: 570, neighbors: [16, 23, 29, 32] },
    { id: 31, x: 830, y: 550, neighbors: [17, 24, 33] },
    { id: 32, x: 680, y: 620, neighbors: [30, 33] },
    { id: 33, x: 800, y: 620, neighbors: [31, 32, 34] },
    { id: 34, x: 920, y: 620, neighbors: [11, 25, 33] } 
];

let playerNode = 0;
let goalNode = 34;
let hoverNode = -1;
let isPlaying = false;
let isAnimating = false;
let pulseFrame = 0;
let turn = 0;
let playerAnim = { x: 0, y: 0 }; 

let enemies = [
    { id: 0, currentNode: 25, animX: 0, animY: 0, startNode: 25, type: 'gian', catchPhrase: "Gian: 'Hahaa! You think you're slick? Caught you!'" },
    { id: 1, currentNode: 10, animX: 0, animY: 0, startNode: 10, type: 'suneo', catchPhrase: "Suneo: 'My strategy is perfect! You can't outsmart me!'" },   
    { id: 2, currentNode: 22,  animX: 0, animY: 0, startNode: 22,  type: 'sensei', catchPhrase: "Sensei: 'Nobita! Where are you running to?! Detention!'" }
];

function initAnimation() {
    const start = nodes[0];
    playerAnim.x = start.x;
    playerAnim.y = start.y;
    enemies.forEach(e => {
        const n = nodes[e.currentNode];
        e.animX = n.x;
        e.animY = n.y;
    });
    isAnimating = false;
}

function setupCanvas() {
    let dpr = window.devicePixelRatio || 1;
    if (isMobile && dpr > 2) dpr = 2; 
    
    canvas.width = LOGICAL_WIDTH * dpr;
    canvas.height = LOGICAL_HEIGHT * dpr;
    
    ctx.setTransform(1, 0, 0, 1, 0, 0); 
    ctx.scale(dpr, dpr);
    
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
}

function getShortestPath(start, target) {
    if (start === target) return [start];
    let queue = [[start]], visited = new Set([start]);
    while (queue.length > 0) {
        let path = queue.shift(), node = path[path.length - 1];
        for (let nb of nodes[node].neighbors) {
            if (!visited.has(nb)) {
                visited.add(nb);
                let newPath = [...path, nb];
                if (nb === target) return newPath;
                queue.push(newPath);
            }
        }
    }
    return [];
}

function moveEnemies() {
    let reserved = new Set();
    enemies.forEach(enemy => {
        const path = getShortestPath(enemy.currentNode, playerNode);
        if (path.length > 1) {
            let nextStep = path[1];
            if (reserved.has(nextStep)) {
                let bestAlt = enemy.currentNode, minDist = 999;
                nodes[enemy.currentNode].neighbors.forEach(nb => {
                    if (!reserved.has(nb)) {
                        const d = getShortestPath(nb, playerNode).length;
                        if (d < minDist) { minDist = d; bestAlt = nb; }
                    }
                });
                nextStep = bestAlt;
            }
            reserved.add(nextStep);
            enemy.currentNode = nextStep;
        }
    });
}

function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}

function updateAnimations() {
    let moving = false;
    const pTarget = nodes[playerNode];
    const distP = Math.sqrt((playerAnim.x - pTarget.x)**2 + (playerAnim.y - pTarget.y)**2);
    if (distP > 1) {
        playerAnim.x = lerp(playerAnim.x, pTarget.x, ANIMATION_SPEED);
        playerAnim.y = lerp(playerAnim.y, pTarget.y, ANIMATION_SPEED);
        moving = true;
    } else {
        playerAnim.x = pTarget.x;
        playerAnim.y = pTarget.y;
    }

    enemies.forEach(e => {
        const eTarget = nodes[e.currentNode];
        const distE = Math.sqrt((e.animX - eTarget.x)**2 + (e.animY - eTarget.y)**2);
        if (distE > 1) {
            e.animX = lerp(e.animX, eTarget.x, ANIMATION_SPEED);
            e.animY = lerp(e.animY, eTarget.y, ANIMATION_SPEED);
            moving = true;
        } else {
            e.animX = eTarget.x;
            e.animY = eTarget.y;
        }
    });

    isAnimating = moving;
}

function drawSprite(x, y, img, color) {
    if (!img.complete) return;
    ctx.save();
    
    if (!isMobile) { 
        ctx.shadowColor = "rgba(0,0,0,0.3)"; 
        ctx.shadowBlur = SHADOW_BLUR; 
        ctx.shadowOffsetY = SHADOW_OFFSET;
    }

    ctx.beginPath(); ctx.arc(x, y, VISUAL_RADIUS + 4, 0, Math.PI * 2);
    ctx.fillStyle = "white"; ctx.fill(); 
    ctx.strokeStyle = color; ctx.lineWidth = 4; ctx.stroke();
    
    ctx.shadowColor = "transparent"; 
    ctx.beginPath(); ctx.arc(x, y, VISUAL_RADIUS, 0, Math.PI * 2); ctx.clip();
    ctx.drawImage(img, x - VISUAL_RADIUS, y - VISUAL_RADIUS, VISUAL_RADIUS * 2, VISUAL_RADIUS * 2);
    ctx.restore();
}

function draw() {
    ctx.clearRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
    
    // Roads
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.lineWidth = 14; ctx.strokeStyle = COLORS.road;
    nodes.forEach(n => { n.neighbors.forEach(nb => { if (nb > n.id) {
        ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(nodes[nb].x, nodes[nb].y); ctx.stroke();
    }})});

    ctx.lineWidth = 2; ctx.strokeStyle = COLORS.roadDash; ctx.setLineDash([8, 10]);
    nodes.forEach(n => { n.neighbors.forEach(nb => { if (nb > n.id) {
        ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(nodes[nb].x, nodes[nb].y); ctx.stroke();
    }})});
    ctx.setLineDash([]);

    // Highlights
    const validMoves = nodes[playerNode].neighbors;
    const pulseScale = 1 + Math.sin(pulseFrame * 0.1) * 0.1; 
    validMoves.forEach(neighborId => {
        const n = nodes[neighborId];
        ctx.save(); ctx.globalAlpha = 0.6; ctx.beginPath();
        ctx.arc(n.x, n.y, VISUAL_RADIUS * 1.8 * pulseScale, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.highlight; ctx.fill(); ctx.restore();
    });

    // Nodes
    nodes.forEach(n => {
        ctx.save();
        let r = VISUAL_RADIUS;
        if (n.id === hoverNode) { r = VISUAL_RADIUS * 1.3; }
        
        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.nodeFill; ctx.strokeStyle = (n.id === hoverNode) ? "#2c3e50" : COLORS.nodeBorder;
        ctx.lineWidth = (n.id === hoverNode) ? 4 : 3;
        ctx.fill(); ctx.stroke(); ctx.restore();
    });

    // Goal
    const goal = nodes[goalNode];
    ctx.save(); 
    if(!isMobile) { ctx.shadowColor = COLORS.goal; ctx.shadowBlur = 15; }
    ctx.beginPath(); ctx.arc(goal.x, goal.y, VISUAL_RADIUS + 5, 0, Math.PI * 2);
    ctx.fillStyle = "white"; ctx.fill();
    ctx.strokeStyle = "#34ace0"; ctx.lineWidth = 4; ctx.stroke();
    if (sprites.doraemon.complete) {
        ctx.beginPath(); ctx.arc(goal.x, goal.y, VISUAL_RADIUS, 0, Math.PI * 2); ctx.clip();
        ctx.drawImage(sprites.doraemon, goal.x - VISUAL_RADIUS, goal.y - VISUAL_RADIUS, VISUAL_RADIUS * 2, VISUAL_RADIUS * 2);
    }
    ctx.restore();

    // Characters
    drawSprite(playerAnim.x, playerAnim.y, sprites.nobita, COLORS.nobita);
    enemies.forEach(e => drawSprite(e.animX, e.animY, sprites[e.type], COLORS[e.type]));
}

function gameLoop() { 
    if (isPlaying) { 
        pulseFrame++; 
        updateAnimations(); 
        draw(); 
        requestAnimationFrame(gameLoop); 
    } 
}

// --- INPUT HANDLING ---
function getMousePos(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = LOGICAL_WIDTH / rect.width;
    const scaleY = LOGICAL_HEIGHT / rect.height;
    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

function handleInput(clientX, clientY) {
    if (!isPlaying || isAnimating) return; 

    const pos = getMousePos(clientX, clientY);
    let clicked = nodes.find(n => Math.sqrt((pos.x - n.x)**2 + (pos.y - n.y)**2) < HIT_RADIUS);
    
    if (clicked) {
        if (nodes[playerNode].neighbors.includes(clicked.id)) {
            handleMove(clicked.id);
        } else if (clicked.id !== playerNode) {
            showTooFarDialog();
        }
    }
}

// Event Listeners
canvas.addEventListener('mousemove', (e) => {
    if (!isPlaying) return;
    const pos = getMousePos(e.clientX, e.clientY);
    let hovered = nodes.find(n => Math.sqrt((pos.x - n.x)**2 + (pos.y - n.y)**2) < HIT_RADIUS);
    if (hovered) { canvas.style.cursor = 'pointer'; hoverNode = hovered.id; } 
    else { canvas.style.cursor = 'default'; hoverNode = -1; }
});

canvas.addEventListener('mousedown', (e) => handleInput(e.clientX, e.clientY));

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); 
    const touch = e.touches[0];
    handleInput(touch.clientX, touch.clientY);
}, { passive: false });

function handleMove(targetId) {
    playerNode = targetId; 
    turn++; 
    turnCount.innerText = turn;
    
    if (playerNode === goalNode) { 
        setTimeout(() => gameOver(true), 500); 
        return; 
    }
    
    moveEnemies(); 
    
    let killer = enemies.find(e => e.currentNode === playerNode);
    if (killer) setTimeout(() => gameOver(false, killer), 500);
}

// too far dialog
function showTooFarDialog() {
    dialogBox.classList.remove('hidden');
    if (window.dialogTimer) clearTimeout(window.dialogTimer);

    const warnColor = COLORS.gian; 

    dialogBox.innerHTML = `
        <h1 style="margin: 0 0 10px 0; color: ${warnColor}; font-size: 1.8rem; text-transform: uppercase;">TOO FAR!</h1>
        <div style="margin-bottom: 15px;">
            <img src="assets/bamboo_copter.webp" style="width: 80px; height: 80px; border-radius: 50%; border: 4px solid ${warnColor}; background: white; padding: 5px; object-fit: contain;">
        </div>
        <p style="margin:0; font-size:1.1rem; color:#2c3e50; font-weight: 700; line-height: 1.4;">
            Tap a red circle!<br>
            <span style="font-weight:normal; font-style:italic; font-size: 1rem;">"I will need a bamboo copter to go there!"</span>
        </p>
    `;

    window.dialogTimer = setTimeout(() => {
        dialogBox.classList.add('hidden');
    }, 1300);
}

// show dialog function can be used to show any dialog with speaker and text
function showDialog(speaker, text) {
    dialogBox.classList.remove('hidden');
    dialogBox.innerHTML = `<p><strong>${speaker}:</strong> ${text}</p>`;
    if (window.dialogTimer) clearTimeout(window.dialogTimer);
    window.dialogTimer = setTimeout(() => { dialogBox.classList.add('hidden'); }, 1500);
}

function closeDialog() { dialogBox.classList.add('hidden'); }

function startGame() {
    startScreen.classList.add('hidden'); 
    endScreen.classList.add('hidden');
    isPlaying = true; 
    resetLevel(); 
    requestAnimationFrame(gameLoop);
}

function resetLevel() {
    playerNode = 0; 
    turn = 0; 
    turnCount.innerText = 0;
    enemies.forEach(e => e.currentNode = e.startNode);
    initAnimation(); 
    draw();
}

const GADGETS = ["Anywhere Door", "Bamboo Copter", "Time Machine", "Dress-Up Camera", "Air Cannon", "Invisible Cloak", "Small Light"];

function gameOver(isWin, villain = null) {
    isPlaying = false; 
    endScreen.classList.remove('hidden');
    
    let htmlContent = "";
    if (isWin) { 
        const randomGadget = GADGETS[Math.floor(Math.random() * GADGETS.length)];
        endTitle.innerText = "SAVED!"; 
        endTitle.style.color = "#34ace0"; 
        
        htmlContent = `
            <div style="margin-bottom: 15px;">
                <img src="assets/doraemon.webp" style="width: 80px; height: 80px; border-radius: 50%; border: 4px solid #34ace0; background: white;">
            </div>
            You reached Doraemon!<br>
            Doraemon: Here's the <br>
            <strong style="color:#e67e22; font-size:1.2rem; display:block; margin-top:4px;">${randomGadget}!</strong>Now Run!
        `;
    } else { 
        endTitle.innerText = "CAUGHT!"; 
        endTitle.style.color = COLORS.gian; 
        
        let villainImg = `assets/${villain.type}.webp`;
        let borderColor = COLORS[villain.type] || "#000";
        
        htmlContent = `
            <div style="margin-bottom: 15px;">
                <img src="${villainImg}" style="width: 80px; height: 80px; border-radius: 50%; border: 4px solid ${borderColor}; background: white;">
            </div>
            <p style="font-style: italic; font-size: 1.1rem; color: #576574;">"${villain.catchPhrase}"</p>
        `;
    }
    
    endMessage.innerHTML = htmlContent;
}

window.startGame = startGame; 
window.resetLevel = resetLevel; 
window.closeDialog = closeDialog;
setupCanvas();
window.addEventListener('resize', () => { setupCanvas(); draw(); });
initAnimation();


let imagesLoaded = 0;
const totalImages = Object.keys(sprites).length;

function checkAllImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        // Only draw once everyone is ready
        draw(); 
    }
}

// Attach checker to every sprite
for (let key in sprites) {
    sprites[key].onload = checkAllImagesLoaded;
}