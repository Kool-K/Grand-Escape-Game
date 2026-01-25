const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('start-screen');
const endScreen = document.getElementById('end-screen');
const endTitle = document.getElementById('end-title');
const endMessage = document.getElementById('end-message');
const turnCount = document.getElementById('turn-count');
const levelIndicator = document.getElementById('level-indicator');
const nextLevelBtn = document.getElementById('next-level-btn');
const dialogBox = document.getElementById('dialog-box');

// --- Configuration ---
const LOGICAL_WIDTH = 950;
const LOGICAL_HEIGHT = 650;
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Visual Settings
const VISUAL_RADIUS = isMobile ? 22 : 24;
// We rely on Swipe for mobile, but keep hit radius for Desktop clicks
const HIT_RADIUS = isMobile ? 65 : 40; 
const ANIMATION_SPEED = 0.15;
const SHADOW_BLUR = isMobile ? 0 : 10;
const SHADOW_OFFSET = isMobile ? 0 : 5;

const COLORS = {
    nobita: "#f1c40f",
    gian: "#e67e22",
    suneo: "#2ecc71",
    sensei: "#795548",
    mom: "#9b59b6",
    goal: "#34ace0",
    road: "#576574",
    roadDash: "#ffffff",
    nodeFill: "rgba(255, 255, 255, 0.95)",
    nodeBorder: "#2c3e50",
    highlight: "#ff4757"
};

const sprites = {
    nobita: new Image(), gian: new Image(), suneo: new Image(),
    sensei: new Image(), doraemon: new Image(), mom: new Image()
};
sprites.nobita.src = "assets/nobita.webp";
sprites.gian.src = "assets/gian.webp";
sprites.suneo.src = "assets/suneo.webp";
sprites.sensei.src = "assets/sensei.webp";
sprites.doraemon.src = "assets/doraemon.webp";
sprites.mom.src = "assets/mom.webp";

// --- NODE DATA ---
const LEVEL_MESH_NODES = [
    { id: 0, x: 80, y: 80, neighbors: [1, 5, 12] },
    { id: 1, x: 230, y: 70, neighbors: [0, 2, 6] },
    { id: 2, x: 380, y: 70, neighbors: [1, 3, 7] },
    { id: 3, x: 530, y: 70, neighbors: [2, 4, 8] },
    { id: 4, x: 680, y: 80, neighbors: [3, 9, 11] },
    { id: 5, x: 100, y: 190, neighbors: [0, 6, 12, 19] },
    { id: 6, x: 250, y: 200, neighbors: [1, 5, 7, 13] },
    { id: 7, x: 400, y: 190, neighbors: [2, 6, 8, 14] },
    { id: 8, x: 550, y: 200, neighbors: [3, 7, 9, 15] },
    { id: 9, x: 700, y: 190, neighbors: [4, 8, 10] },
    { id: 10, x: 820, y: 200, neighbors: [9, 11, 24] },
    { id: 11, x: 840, y: 80, neighbors: [4, 10, 34] },
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

const LEVEL_RING_NODES = [
    { id: 0, x: 90, y: 90, neighbors: [1, 6] },
    { id: 1, x: 230, y: 90, neighbors: [0, 2, 7] },
    { id: 2, x: 370, y: 90, neighbors: [1, 3, 8] },
    { id: 3, x: 510, y: 90, neighbors: [2, 4, 9] },
    { id: 4, x: 650, y: 90, neighbors: [3, 5, 10] },
    { id: 5, x: 790, y: 90, neighbors: [4, 11] },
    { id: 6, x: 120, y: 210, neighbors: [0, 7, 14] },
    { id: 7, x: 260, y: 210, neighbors: [1, 6, 8, 15] },
    { id: 8, x: 400, y: 210, neighbors: [2, 7, 9, 16, 20] },
    { id: 9, x: 540, y: 210, neighbors: [3, 8, 10, 17] },
    { id: 10, x: 680, y: 210, neighbors: [4, 9, 11, 18, 21] },
    { id: 11, x: 820, y: 210, neighbors: [5, 10, 12] },
    { id: 12, x: 790, y: 330, neighbors: [11, 13, 19] },
    { id: 13, x: 640, y: 330, neighbors: [12, 14, 18, 22] },
    { id: 14, x: 500, y: 330, neighbors: [6, 13, 15, 23] },
    { id: 15, x: 360, y: 330, neighbors: [7, 14, 16, 24] },
    { id: 16, x: 220, y: 330, neighbors: [8, 15, 17, 25] },
    { id: 17, x: 360, y: 450, neighbors: [9, 16, 18, 26] },
    { id: 18, x: 520, y: 450, neighbors: [10, 13, 17, 19, 27] },
    { id: 19, x: 680, y: 450, neighbors: [12, 18, 28] },
    { id: 20, x: 120, y: 520, neighbors: [8, 21] },
    { id: 21, x: 260, y: 520, neighbors: [20, 22, 29] },
    { id: 22, x: 400, y: 520, neighbors: [13, 21, 23, 30] },
    { id: 23, x: 540, y: 520, neighbors: [14, 22, 24, 31] },
    { id: 24, x: 680, y: 520, neighbors: [15, 23, 25, 32] },
    { id: 25, x: 820, y: 520, neighbors: [16, 24, 33] },
    { id: 26, x: 300, y: 580, neighbors: [17, 27] }, 
    { id: 27, x: 460, y: 580, neighbors: [18, 26, 28] },
    { id: 28, x: 620, y: 580, neighbors: [19, 27] },
    { id: 29, x: 180, y: 610, neighbors: [21, 30] }, 
    { id: 30, x: 400, y: 610, neighbors: [22, 29, 31] },
    { id: 31, x: 540, y: 610, neighbors: [23, 30, 32] },
    { id: 32, x: 680, y: 610, neighbors: [24, 31, 33] },
    { id: 33, x: 820, y: 610, neighbors: [25, 32] }
];

const LEVELS = {
    1: {
        nodes: LEVEL_RING_NODES,
        startNode: 0,
        goalNode: 33,
        enemies: [
            { id: 0, startNode: 12, type: 'suneo', catchPhrase: "Suneo: 'I can read your moves!'", patrolRoute: [12, 13, 18, 19, 12, 11, 10, 9, 8, 16, 15, 14] },
            { id: 1, startNode: 27, type: 'sensei', catchPhrase: "Sensei: 'No shortcuts Nobita! Stop wasting your time & study!'", patrolRoute: [27, 26, 17, 16, 15, 14, 13, 18, 27] },
            { id: 2, startNode: 5, type: 'mom', catchPhrase: "Mom: 'You’re not escaping! I found your testpaper!'", patrolRoute: [5, 11, 12, 13, 14, 7, 1, 2, 3, 4, 5] },
            { id: 3, startNode: 20, type: 'gian', catchPhrase: "Gian: 'How dare you miss my concert! Caught you!'", delayTurns: 3, speed: 2 }
        ]
    },
    2: {
        nodes: LEVEL_MESH_NODES,
        startNode: 0,
        goalNode: 34,
        enemies: [
            { id: 0, startNode: 25, type: 'gian', catchPhrase: "Gian: 'Hahaa! You think you're slick? Caught you!'" },
            { id: 1, startNode: 10, type: 'suneo', catchPhrase: "Suneo: 'My strategy is perfect! You can't outsmart me!'" },
            { id: 2, startNode: 22, type: 'sensei', catchPhrase: "Sensei: 'Nobita! Where are you running to?! Detention!'" },
            { id: 3, startNode: 18, type: 'mom', catchPhrase: "Mom: 'No more games Nobita! Finish your homework first!'" }
        ]
    }
};

// --- GAME STATE ---
let currentLevel = 1;
let currentNodes = [];
let playerNode = 0;
let goalNode = 0;
let hoverNode = -1;
let isPlaying = false;
let isAnimating = false;
let pulseFrame = 0;
let turn = 0;
let playerAnim = { x: 0, y: 0 };
let enemies = [];
let nextLevelActionType = 'restart';

// --- GESTURE STATE ---
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let dragCurrent = { x: 0, y: 0 };

// --- FUNCTIONS ---
function launchConfetti() {
    const emojis = ['🎊', '🎉', '✨', '⭐', '🎈'];
    for (let i = 0; i < 50; i++) {
        const div = document.createElement('div');
        div.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        div.style.position = 'fixed';
        div.style.left = Math.random() * 100 + 'vw';
        div.style.top = '-50px';
        div.style.fontSize = Math.random() * 20 + 20 + 'px';
        div.style.zIndex = '1000';
        div.style.pointerEvents = 'none';
        div.style.transition = `transform ${Math.random() * 2 + 1}s linear, opacity 2s`;
        document.body.appendChild(div);

        setTimeout(() => {
            div.style.transform = `translateY(100vh) rotate(${Math.random() * 360}deg)`;
            div.style.opacity = '0';
        }, 10);
        setTimeout(() => div.remove(), 3000);
    }
}

function handleLevelWin() {
    isPlaying = false;
    endScreen.classList.remove('hidden');
    const imgSide = endScreen.querySelector('.modal-image-side');

    if (currentLevel === 1) {
        endTitle.innerText = "LEVEL 1 CLEAR!";
        endTitle.style.color = "#34ace0";
        imgSide.innerHTML = `<img src="assets/doraemon.webp">`;
        endMessage.innerHTML = `Awesome! Level 2 is much trickier!`;
        nextLevelBtn.innerText = "START LEVEL 2";
        nextLevelActionType = 'next';
    } else {
        launchConfetti();
        endTitle.innerText = "🎉 CHAMPION! 🎉";
        endTitle.style.color = "#2ecc71";
        imgSide.innerHTML = `<img src="assets/victory_scene.webp">`;
        endMessage.innerHTML = `<strong style="font-size: 1.1rem;">SAVED!</strong><br>More levels coming soon!`;
        nextLevelBtn.innerText = "PLAY AGAIN";
        nextLevelActionType = 'restart_all';
    }
}

function gameOver(isWin, villain = null) {
    if (isWin) {
        handleLevelWin();
        return;
    }
    isPlaying = false;
    endScreen.classList.remove('hidden');
    endTitle.innerText = "CAUGHT!";
    endTitle.style.color = "#ff5252";
    
    const imgSide = endScreen.querySelector('.modal-image-side');
    imgSide.innerHTML = `<img src="assets/${villain?.type || 'gian'}.webp" alt="Villain">`;

    const fullPhrase = villain?.catchPhrase || "Villain: You were caught!";
    const splitIndex = fullPhrase.indexOf(':');
    const name = fullPhrase.substring(0, splitIndex + 1);
    const message = fullPhrase.substring(splitIndex + 1);

    endMessage.innerHTML = `<strong>${name}</strong>${message}`;
    nextLevelBtn.innerText = "TRY AGAIN";
    nextLevelActionType = 'restart';
}

window.nextLevelAction = () => {
    if (nextLevelActionType === 'next') {
        startLevel2();
    } else if (nextLevelActionType === 'restart_all') {
        currentLevel = 1;
        initLevel(1);
        resetLevelState();
        endScreen.classList.add('hidden');
        isPlaying = true;
        requestAnimationFrame(gameLoop);
    } else {
        resetLevel();
    }
};

function initLevel(levelNum) {
    const levelData = LEVELS[levelNum];
    currentNodes = levelData.nodes;
    playerNode = levelData.startNode;
    goalNode = levelData.goalNode;

    enemies = levelData.enemies.map(e => ({
        ...e,
        currentNode: e.startNode,
        animX: 0,
        animY: 0,
        patrolIndex: 0
    }));

    levelIndicator.innerText = levelNum;
    if (levelNum === 2) {
        levelIndicator.parentElement.style.color = "white";
    } else {
        levelIndicator.parentElement.style.background = "#f1c40f";
        levelIndicator.parentElement.style.color = "#2c3e50";
    }
    initAnimation();
}

function initAnimation() {
    const start = currentNodes[playerNode];
    playerAnim.x = start.x;
    playerAnim.y = start.y;
    enemies.forEach(e => {
        const n = currentNodes[e.currentNode];
        e.animX = n.x;
        e.animY = n.y;
    });
    isAnimating = false;
}

function setupCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const visualWidth = window.innerWidth;
    const visualHeight = window.innerHeight;
    const isLandscape = visualHeight < 600 && isMobile; 

    if (isLandscape) {
        canvas.width = visualWidth * dpr;
        canvas.height = visualHeight * dpr;
        const scale = Math.min(visualWidth / LOGICAL_WIDTH, visualHeight / LOGICAL_HEIGHT) * 0.9;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr * scale, dpr * scale);
        const offsetX = (visualWidth / scale - LOGICAL_WIDTH) / 2;
        const offsetY = (visualHeight / scale - LOGICAL_HEIGHT) / 2;
        ctx.translate(offsetX, offsetY);
    } else {
        canvas.width = LOGICAL_WIDTH * dpr;
        canvas.height = LOGICAL_HEIGHT * dpr;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
    }
    ctx.imageSmoothingEnabled = true;
}

function getMousePos(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const visualWidth = window.innerWidth;
    const visualHeight = window.innerHeight;
    const isLandscape = visualHeight < 500 && isMobile;

    if (isLandscape) {
        const scale = Math.min(visualWidth / LOGICAL_WIDTH, visualHeight / LOGICAL_HEIGHT) * 0.9;
        const offsetX = (visualWidth - LOGICAL_WIDTH * scale) / 2;
        const offsetY = (visualHeight - LOGICAL_HEIGHT * scale) / 2;
        return {
            x: (clientX - rect.left - offsetX) / scale,
            y: (clientY - rect.top - offsetY) / scale
        };
    } else {
        const scaleX = LOGICAL_WIDTH / rect.width;
        const scaleY = LOGICAL_HEIGHT / rect.height;
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }
}

window.addEventListener('resize', () => {
    setupCanvas();
    draw();
});

function getShortestPath(start, target) {
    if (start === target) return [start];
    let queue = [[start]], visited = new Set([start]);
    while (queue.length > 0) {
        let path = queue.shift(), node = path[path.length - 1];
        for (let nb of currentNodes[node].neighbors) {
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
        if (enemy.delayTurns && enemy.delayTurns > 0) {
            enemy.delayTurns -= 1;
            reserved.add(enemy.currentNode);
            return;
        }
        let nextStep = enemy.currentNode;
        if (enemy.patrolRoute && enemy.patrolRoute.length > 0) {
            let targetPatrolNode = enemy.patrolRoute[enemy.patrolIndex];
            if (enemy.currentNode === targetPatrolNode) {
                enemy.patrolIndex = (enemy.patrolIndex + 1) % enemy.patrolRoute.length;
                targetPatrolNode = enemy.patrolRoute[enemy.patrolIndex];
            }
            const pathToPatrol = getShortestPath(enemy.currentNode, targetPatrolNode);
            if (pathToPatrol.length > 1) nextStep = pathToPatrol[1];
        } else {
            const pathCount = enemy.speed || 1;
            let currentSimulatedNode = enemy.currentNode;
            for (let i = 0; i < pathCount; i++) {
                const pathToNobita = getShortestPath(currentSimulatedNode, playerNode);
                if (pathToNobita.length > 1) currentSimulatedNode = pathToNobita[1];
            }
            nextStep = currentSimulatedNode;
        }
        if (!reserved.has(nextStep)) {
            enemy.currentNode = nextStep;
            reserved.add(nextStep);
        } else {
            reserved.add(enemy.currentNode);
        }
    });
}

function updateAnimations() {
    let moving = false;
    const lerp = (start, end, t) => start * (1 - t) + end * t;
    const pTarget = currentNodes[playerNode];
    const distP = Math.sqrt((playerAnim.x - pTarget.x) ** 2 + (playerAnim.y - pTarget.y) ** 2);
    if (distP > 1) {
        playerAnim.x = lerp(playerAnim.x, pTarget.x, ANIMATION_SPEED);
        playerAnim.y = lerp(playerAnim.y, pTarget.y, ANIMATION_SPEED);
        moving = true;
    } else {
        playerAnim.x = pTarget.x;
        playerAnim.y = pTarget.y;
    }
    enemies.forEach(e => {
        const eTarget = currentNodes[e.currentNode];
        const distE = Math.sqrt((e.animX - eTarget.x) ** 2 + (e.animY - eTarget.y) ** 2);
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
    ctx.save();
    if (!isMobile) { ctx.shadowColor = "rgba(0,0,0,0.3)"; ctx.shadowBlur = SHADOW_BLUR; ctx.shadowOffsetY = SHADOW_OFFSET; }
    ctx.beginPath(); ctx.arc(x, y, VISUAL_RADIUS + 4, 0, Math.PI * 2);
    ctx.fillStyle = "white"; ctx.fill(); ctx.strokeStyle = color; ctx.lineWidth = 4; ctx.stroke();
    if (img.complete && img.naturalHeight !== 0) {
        ctx.shadowColor = "transparent"; ctx.beginPath(); ctx.arc(x, y, VISUAL_RADIUS, 0, Math.PI * 2); ctx.clip();
        ctx.drawImage(img, x - VISUAL_RADIUS, y - VISUAL_RADIUS, VISUAL_RADIUS * 2, VISUAL_RADIUS * 2);
    } else {
        ctx.beginPath(); ctx.arc(x, y, VISUAL_RADIUS - 2, 0, Math.PI * 2);
        ctx.fillStyle = color; ctx.fill();
    }
    ctx.restore();
}

function draw() {
    ctx.clearRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
    ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.lineWidth = 14; ctx.strokeStyle = COLORS.road;
    currentNodes.forEach(n => {
        n.neighbors.forEach(nb => {
            if (nb > n.id) {
                ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(currentNodes[nb].x, currentNodes[nb].y); ctx.stroke();
            }
        })
    });
    ctx.lineWidth = 2; ctx.strokeStyle = COLORS.roadDash; ctx.setLineDash([8, 10]);
    currentNodes.forEach(n => {
        n.neighbors.forEach(nb => {
            if (nb > n.id) {
                ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(currentNodes[nb].x, currentNodes[nb].y); ctx.stroke();
            }
        })
    });
    ctx.setLineDash([]);
    const validMoves = currentNodes[playerNode].neighbors;
    const pulseScale = 1 + Math.sin(pulseFrame * 0.1) * 0.1;
    validMoves.forEach(neighborId => {
        const n = currentNodes[neighborId];
        ctx.save(); ctx.globalAlpha = 0.6; ctx.beginPath();
        ctx.arc(n.x, n.y, VISUAL_RADIUS * 1.8 * pulseScale, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.highlight; ctx.fill(); ctx.restore();
    });
    currentNodes.forEach(n => {
        ctx.save();
        let r = VISUAL_RADIUS; if (n.id === hoverNode) r = VISUAL_RADIUS * 1.3;
        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.nodeFill; ctx.strokeStyle = (n.id === hoverNode) ? "#2c3e50" : COLORS.nodeBorder;
        ctx.lineWidth = (n.id === hoverNode) ? 4 : 3;
        ctx.fill(); ctx.stroke(); ctx.restore();
    });

    // --- DRAW SLINGSHOT ARROW ---
    if (isDragging) {
        ctx.save();
        ctx.beginPath();
        const startX = currentNodes[playerNode].x;
        const startY = currentNodes[playerNode].y;
        // Limit arrow length visually
        const dx = dragCurrent.x - dragStart.x;
        const dy = dragCurrent.y - dragStart.y;
        const angle = Math.atan2(dy, dx);
        const len = Math.min(Math.sqrt(dx*dx + dy*dy), 100); 
        
        const arrowEndX = startX + Math.cos(angle) * len;
        const arrowEndY = startY + Math.sin(angle) * len;

        ctx.moveTo(startX, startY);
        ctx.lineTo(arrowEndX, arrowEndY);
        ctx.strokeStyle = "#ff4757";
        ctx.lineWidth = 6;
        ctx.stroke();

        // Arrowhead
        ctx.beginPath();
        ctx.moveTo(arrowEndX, arrowEndY);
        ctx.lineTo(arrowEndX - 15 * Math.cos(angle - Math.PI / 6), arrowEndY - 15 * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(arrowEndX - 15 * Math.cos(angle + Math.PI / 6), arrowEndY - 15 * Math.sin(angle + Math.PI / 6));
        ctx.fillStyle = "#ff4757";
        ctx.fill();
        ctx.restore();
    }

    const goal = currentNodes[goalNode];
    ctx.save();
    if (!isMobile) { ctx.shadowColor = COLORS.goal; ctx.shadowBlur = 15; }
    ctx.beginPath(); ctx.arc(goal.x, goal.y, VISUAL_RADIUS + 5, 0, Math.PI * 2);
    ctx.fillStyle = "white"; ctx.fill(); ctx.strokeStyle = COLORS.goal; ctx.lineWidth = 4; ctx.stroke();
    if (sprites.doraemon.complete) {
        ctx.beginPath(); ctx.arc(goal.x, goal.y, VISUAL_RADIUS, 0, Math.PI * 2); ctx.clip();
        ctx.drawImage(sprites.doraemon, goal.x - VISUAL_RADIUS, goal.y - VISUAL_RADIUS, VISUAL_RADIUS * 2, VISUAL_RADIUS * 2);
    }
    ctx.restore();
    drawSprite(playerAnim.x, playerAnim.y, sprites.nobita, COLORS.nobita);
    enemies.forEach(e => drawSprite(e.animX, e.animY, sprites[e.type], COLORS[e.type]));
}

function gameLoop() { if (isPlaying) { pulseFrame++; updateAnimations(); draw(); requestAnimationFrame(gameLoop); } }

// --- UNIFIED INPUT HANDLER (SWIPE + CLICK) ---
function handleStart(x, y) {
    if (!isPlaying || isAnimating) return;
    const pos = getMousePos(x, y);
    dragStart = pos;
    dragCurrent = pos;
    isDragging = true;
}

function handleMoveInput(x, y) {
    if (!isDragging) {
        // Just hover logic for desktop mouse
        const pos = getMousePos(x, y);
        let hovered = currentNodes.find(n => Math.sqrt((pos.x - n.x) ** 2 + (pos.y - n.y) ** 2) < HIT_RADIUS);
        if (hovered) { canvas.style.cursor = 'pointer'; hoverNode = hovered.id; }
        else { canvas.style.cursor = 'default'; hoverNode = -1; }
        return;
    }
    // Update drag current for arrow drawing
    dragCurrent = getMousePos(x, y);
}

function handleEnd(x, y) {
    if (!isDragging) return;
    isDragging = false;
    
    const pos = getMousePos(x, y);
    const dx = pos.x - dragStart.x;
    const dy = pos.y - dragStart.y;
    const dist = Math.sqrt(dx*dx + dy*dy);

    // THRESHOLD:
    // If distance is very small (< 20px), treat as TAP/CLICK.
    // If distance is larger, treat as SWIPE.
    
    if (dist < 20) {
        // --- TAP LOGIC ---
        // Find if we clicked ON a valid neighbor
        const validMoves = currentNodes[playerNode].neighbors;
        const clickedNode = validMoves.find(nid => {
            const n = currentNodes[nid];
            const d = Math.sqrt((pos.x - n.x)**2 + (pos.y - n.y)**2);
            return d < HIT_RADIUS; // Generous hit radius for mobile taps
        });

        if (clickedNode !== undefined) {
            handleMove(clickedNode);
        } else {
            // Check if they tapped a non-neighbor node (Invalid Move)
            const anyNode = currentNodes.find(n => Math.sqrt((pos.x - n.x)**2 + (pos.y - n.y)**2) < HIT_RADIUS);
            if (anyNode && anyNode.id !== playerNode) showTooFarDialog();
        }
    } else {
        // --- SWIPE LOGIC ---
        const swipeAngle = Math.atan2(dy, dx);
        
        // Check all neighbors to see which one aligns with the swipe angle
        let bestNeighbor = null;
        let minAngleDiff = Math.PI / 4; // Tolerance: 45 degrees

        currentNodes[playerNode].neighbors.forEach(nid => {
            const n = currentNodes[nid];
            const nx = n.x - currentNodes[playerNode].x;
            const ny = n.y - currentNodes[playerNode].y;
            const nAngle = Math.atan2(ny, nx);
            
            // Calculate difference, normalizing to -PI to PI
            let diff = nAngle - swipeAngle;
            while (diff > Math.PI) diff -= 2*Math.PI;
            while (diff < -Math.PI) diff += 2*Math.PI;
            diff = Math.abs(diff);

            if (diff < minAngleDiff) {
                minAngleDiff = diff;
                bestNeighbor = nid;
            }
        });

        if (bestNeighbor !== null) {
            handleMove(bestNeighbor);
        } else {
            // Swipe was valid length but no path in that direction
            showTooFarDialog();
        }
    }
    // Clear arrow immediately
    draw(); 
}

// Event Listeners
canvas.addEventListener('mousedown', e => handleStart(e.clientX, e.clientY));
canvas.addEventListener('mousemove', e => handleMoveInput(e.clientX, e.clientY));
canvas.addEventListener('mouseup', e => handleEnd(e.clientX, e.clientY));

canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    handleStart(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: false });

canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    handleMoveInput(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: false });

canvas.addEventListener('touchend', e => {
    e.preventDefault();
    // Use changedTouches for the end position
    handleEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
}, { passive: false });


function handleMove(targetId) {
    playerNode = targetId; turn++; turnCount.innerText = turn;
    if (playerNode === goalNode) { setTimeout(() => gameOver(true), 500); return; }
    moveEnemies();
    let killer = enemies.find(e => e.currentNode === playerNode);
    if (killer) setTimeout(() => gameOver(false, killer), 500);
}

function showTooFarDialog() {
    dialogBox.classList.remove('hidden');
    if (window.dialogTimer) clearTimeout(window.dialogTimer);
    const warnColor = COLORS.gian;
    dialogBox.innerHTML = `
        <h1 style="margin: 0 0 10px 0; color: ${warnColor}; font-size: 1.8rem; text-transform: uppercase;">INVALID MOVE!</h1>
        <div style="margin-bottom: 15px;"><img src="assets/bamboo_copter.webp" style="width: 80px; height: 80px; border-radius: 50%; border: 4px solid ${warnColor}; background: white; padding: 5px; object-fit: contain;"></div>
        <p style="margin:0; font-size:1.1rem; color:#2c3e50; font-weight: 700; line-height: 1.4;">No path that way!<br><span style="font-weight:normal; font-style:italic; font-size: 1rem;">"I will need a bamboo copter to go there!"</span></p>
    `;
    window.dialogTimer = setTimeout(() => dialogBox.classList.add('hidden'), 1300);
}

// --- Updated Instructions with Swipe Logic ---
const helpInstructions = `
    <p>🟡 <strong>Desktop:</strong> Tap to Move.</p>
    <p>👆 <strong>Mobile:</strong> Swipe towards a red circle.</p>
    <p>👹 Avoid Gian, Suneo, and Sensei.</p>
    <p>🧠 Trick them by looping!</p>
`;

function showHelp() {
    const title = startScreen.querySelector('h1');
    const instructionsDiv = startScreen.querySelector('.instructions');
    const startBtn = startScreen.querySelector('.big-btn');

    title.innerText = "How To Play";
    instructionsDiv.innerHTML = helpInstructions;
    
    startBtn.innerText = "RESUME GAME";
    startBtn.setAttribute("onclick", "resumeGame()");

    if (startScreen.classList.contains('hidden')) {
        startScreen.classList.remove('hidden');
        isPlaying = false; 
    }
}

window.resumeGame = () => {
    startScreen.classList.add('hidden');
    isPlaying = true;
    requestAnimationFrame(gameLoop);
};

window.startGame = () => {
    startScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    
    // Inject instructions into the start screen for the first time
    document.querySelector('.instructions').innerHTML = helpInstructions;

    const startBtn = startScreen.querySelector('.big-btn');
    startBtn.innerText = "PLAY NOW";
    startBtn.setAttribute("onclick", "startGame()");

    currentLevel = 1;
    initLevel(1);
    resetLevelState();

    isPlaying = true;
    requestAnimationFrame(gameLoop);
};

window.resetLevel = () => { endScreen.classList.add('hidden'); initLevel(currentLevel); resetLevelState(); isPlaying = true; requestAnimationFrame(gameLoop); };
function startLevel2() { endScreen.classList.add('hidden'); currentLevel = 2; initLevel(2); isPlaying = true; resetLevelState(); requestAnimationFrame(gameLoop); }
function resetLevelState() { turn = 0; turnCount.innerText = 0; initAnimation(); draw(); }

setupCanvas();
initLevel(1);
// Ensure instructions are set on load
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.instructions').innerHTML = helpInstructions;
    draw();
});