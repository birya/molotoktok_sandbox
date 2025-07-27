// Функції для створення та генерації світу
function initWorld() {
    console.log("🌍 Створення світу...");
    
    // Ініціалізуємо масив світу
    for (let x = 0; x < CONFIG.WORLD_WIDTH; x++) {
        world[x] = [];
        for (let y = 0; y < CONFIG.WORLD_HEIGHT; y++) {
            world[x][y] = 0;
        }
    }
    
    generateTerrain();
    generateCaves();
    generateTrees();
    
    // Встановлення позиції гравця
    player.x = CONFIG.WORLD_WIDTH * CONFIG.BLOCK_SIZE / 2;
    player.y = 100 * CONFIG.BLOCK_SIZE;
    
    console.log("👤 Гравець: (" + player.x + ", " + player.y + ")");
    console.log("🌲 Світ створено успішно!");
}

function generateTerrain() {
    // Генерація терену
    for (let x = 0; x < CONFIG.WORLD_WIDTH; x++) {
        const height = Math.floor(120 + Math.sin(x * 0.05) * 20);
        
        // Переконуємося що висота в межах світу
        const clampedHeight = Math.max(0, Math.min(CONFIG.WORLD_HEIGHT - 1, height));
        
        for (let y = clampedHeight; y < CONFIG.WORLD_HEIGHT; y++) {
            if (y === clampedHeight) {
                world[x][y] = 2; // Трава
            } else if (y < clampedHeight + 8) {
                world[x][y] = 1; // Земля
            } else if (y === CONFIG.WORLD_HEIGHT - 1) {
                world[x][y] = 6; // Коренна порода
            } else {
                world[x][y] = 3; // Камінь
            }
        }
    }
}

function generateCaves() {
    // Генерація печер
    for (let i = 0; i < CONFIG.CAVE_COUNT; i++) {
        const caveX = Math.floor(Math.random() * CONFIG.WORLD_WIDTH);
        const caveY = Math.floor(130 + Math.random() * 50);
        const caveSize = Math.floor(3 + Math.random() * 5);
        
        for (let x = Math.max(0, caveX - caveSize); x < Math.min(CONFIG.WORLD_WIDTH, caveX + caveSize); x++) {
            for (let y = Math.max(0, caveY - caveSize); y < Math.min(CONFIG.WORLD_HEIGHT - 1, caveY + caveSize); y++) {
                const distance = Math.sqrt((x - caveX) * (x - caveX) + (y - caveY) * (y - caveY));
                if (distance < caveSize) {
                    world[x][y] = 0;
                }
            }
        }
    }
}

function generateTrees() {
    // Генерація дерев
    for (let x = 10; x < CONFIG.WORLD_WIDTH - 10; x += CONFIG.TREE_GENERATION_SPACING + Math.floor(Math.random() * 10)) {
        for (let y = 0; y < CONFIG.WORLD_HEIGHT; y++) {
            if (getBlock(x, y) === 2) {
                if (Math.random() > (1 - CONFIG.TREE_PROBABILITY)) {
                    generateTree(x, y);
                }
                break;
            }
        }
    }
}

function generateTree(x, y) {
    const treeHeight = 5 + Math.floor(Math.random() * 4);
    
    // Ствол дерева
    for (let ty = 0; ty < treeHeight; ty++) {
        if (y - ty >= 0) setBlock(x, y - ty, 7);
    }
    
    // Листя
    const leafTop = y - treeHeight;
    for (let dx = -3; dx <= 3; dx++) {
        for (let dy = -3; dy <= 2; dy++) {
            const leafX = x + dx;
            const leafY = leafTop + dy;
            const distance = Math.abs(dx) + Math.abs(dy);
            if (distance <= 3 && leafY >= 0 && leafY < CONFIG.WORLD_HEIGHT) {
                if (!(dx === 0 && dy >= -1)) {
                    if (Math.random() > 0.2) {
                        if (getBlock(leafX, leafY) === 0) {
                            setBlock(leafX, leafY, 8);
                        }
                    }
                }
            }
        }
    }
}