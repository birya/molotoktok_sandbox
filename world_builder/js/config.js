// Конфігурація гри
const CONFIG = {
    BLOCK_SIZE: 40,
    WORLD_WIDTH: 400,
    WORLD_HEIGHT: 200,
    GRAVITY: 0.5,
    JUMP_FORCE: -12,
    MOVE_SPEED: 4,
    TREE_GENERATION_SPACING: 6,
    CAVE_COUNT: 100,
    TREE_PROBABILITY: 0.8
};

// Глобальні змінні
let canvas;
let ctx;
let world = [];
let camera = { x: 0, y: 0 };
let zoom = 0.8;
let selectedBlock = 1;
let buildMode = true;
let fallingBlocks = [];
let gravityTimer = 0;
let doorStates = {};

let player = {
    x: 8000,
    y: 4000,
    width: 32,
    height: 72,
    vx: 0,
    vy: 0,
    onGround: false,
    facing: 1,
    animFrame: 0,
    state: 'idle'
};

let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
let keys = {};
let mouse = { x: 0, y: 0, worldX: 0, worldY: 0 };
let joystickActive = false;
let moveDirection = { x: 0, y: 0 };