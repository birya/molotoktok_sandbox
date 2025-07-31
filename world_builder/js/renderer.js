// Рендеринг гри
function render() {
    // Очищення екрану
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.scale(zoom, zoom);
    ctx.translate(-camera.x, -camera.y);
    
    // Оптимізація: рендерити тільки видимі блоки
    const startX = Math.max(0, Math.floor(camera.x / CONFIG.BLOCK_SIZE));
    const endX = Math.min(CONFIG.WORLD_WIDTH, Math.ceil((camera.x + canvas.width / zoom) / CONFIG.BLOCK_SIZE));
    const startY = Math.max(0, Math.floor(camera.y / CONFIG.BLOCK_SIZE));
    const endY = Math.min(CONFIG.WORLD_HEIGHT, Math.ceil((camera.y + canvas.height / zoom) / CONFIG.BLOCK_SIZE));
    
    // Рендеринг блоків
    renderBlocks(startX, endX, startY, endY);
    
    // Рендеринг падаючих блоків
    renderFallingBlocks();
    
    // Рендеринг гравця
    drawPlayer(ctx, player.x, player.y, player.width, player.height, 
              player.facing, player.state, player.animFrame);
    
    // Курсор для десктопу
    if (!isMobile) {
        renderCursor();
    }
    
    ctx.restore();
}

function renderBlocks(startX, endX, startY, endY) {
    for (let x = startX; x < endX; x++) {
        for (let y = startY; y < endY; y++) {
            const block = getBlock(x, y);
            if (block !== 0) {
                renderBlock(x, y, block);
            }
        }
    }
}

function renderBlock(x, y, blockType) {
    const blockX = x * CONFIG.BLOCK_SIZE;
    const blockY = y * CONFIG.BLOCK_SIZE;
    
    ctx.fillStyle = BLOCK_TYPES[blockType].color;
    ctx.fillRect(blockX, blockY, CONFIG.BLOCK_SIZE, CONFIG.BLOCK_SIZE);
    
    // Спеціальні текстури для різних блоків
    switch(blockType) {
        case 6: // Коренна порода
            renderBedrockTexture(blockX, blockY);
            break;
        case 7: // Деревина
            renderWoodTexture(blockX, blockY);
            break;
        case 8: // Листя
            renderLeavesTexture(blockX, blockY);
            break;
        case 9: // Двері
            renderDoorTexture(blockX, blockY, x, y);
            break;
        case 10: // Вікно
            renderWindowTexture(blockX, blockY);
            break;
    }
    
    // Контури блоків
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(blockX, blockY, CONFIG.BLOCK_SIZE, CONFIG.BLOCK_SIZE);
}

function renderBedrockTexture(x, y) {
    ctx.fillStyle = '#1A1A1A';
    ctx.fillRect(x + 4, y + 4, 8, 8);
    ctx.fillRect(x + 20, y + 12, 8, 8);
    ctx.fillRect(x + 12, y + 20, 8, 8);
    ctx.fillRect(x + 28, y + 28, 8, 8);
}

function renderWoodTexture(x, y) {
    ctx.fillStyle = 'rgba(139, 69, 19, 0.7)';
    ctx.fillRect(x, y, CONFIG.BLOCK_SIZE, CONFIG.BLOCK_SIZE);
    ctx.fillStyle = 'rgba(101, 67, 33, 0.8)';
    ctx.fillRect(x + 8, y + 8, 24, 24);
    ctx.fillStyle = 'rgba(139, 69, 19, 0.9)';
    ctx.fillRect(x + 12, y + 12, 16, 16);
}

function renderLeavesTexture(x, y) {
    ctx.fillStyle = 'rgba(50, 205, 50, 0.7)';
    ctx.fillRect(x, y, CONFIG.BLOCK_SIZE, CONFIG.BLOCK_SIZE);
    ctx.fillStyle = '#32CD32';
    ctx.fillRect(x + 4, y + 4, 8, 8);
    ctx.fillRect(x + 20, y + 8, 12, 8);
    ctx.fillRect(x + 8, y + 20, 16, 8);
    ctx.fillRect(x + 24, y + 24, 8, 8);
}

function renderDoorTexture(x, y, blockX, blockY) {
    const isOpen = isDoorOpen(blockX, blockY);
    
    if (isOpen) {
        // Open door: partially transparent or offset
        ctx.fillStyle = 'rgba(139, 69, 19, 0.3)';
        ctx.fillRect(x + CONFIG.BLOCK_SIZE * 0.8, y, CONFIG.BLOCK_SIZE * 0.2, CONFIG.BLOCK_SIZE);
        
        // Door handle
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(x + CONFIG.BLOCK_SIZE * 0.85, y + CONFIG.BLOCK_SIZE * 0.45, 4, 4);
    } else {
        // Closed door: full wooden texture
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x, y, CONFIG.BLOCK_SIZE, CONFIG.BLOCK_SIZE);
        
        // Door panels
        ctx.fillStyle = '#654321';
        ctx.fillRect(x + 4, y + 4, CONFIG.BLOCK_SIZE - 8, CONFIG.BLOCK_SIZE * 0.4);
        ctx.fillRect(x + 4, y + CONFIG.BLOCK_SIZE * 0.6, CONFIG.BLOCK_SIZE - 8, CONFIG.BLOCK_SIZE * 0.35);
        
        // Door handle
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(x + CONFIG.BLOCK_SIZE - 8, y + CONFIG.BLOCK_SIZE * 0.45, 4, 4);
    }
}

function renderWindowTexture(x, y) {
    // Window frame
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x, y, CONFIG.BLOCK_SIZE, CONFIG.BLOCK_SIZE);
    
    // Glass (transparent blue)
    ctx.fillStyle = 'rgba(135, 206, 235, 0.6)';
    ctx.fillRect(x + 4, y + 4, CONFIG.BLOCK_SIZE - 8, CONFIG.BLOCK_SIZE - 8);
    
    // Window cross
    ctx.fillStyle = '#654321';
    ctx.fillRect(x + CONFIG.BLOCK_SIZE/2 - 1, y + 4, 2, CONFIG.BLOCK_SIZE - 8);
    ctx.fillRect(x + 4, y + CONFIG.BLOCK_SIZE/2 - 1, CONFIG.BLOCK_SIZE - 8, 2);
    
    // Shine effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(x + 6, y + 6, 8, 8);
}

function renderFallingBlocks() {
    for (let i = 0; i < fallingBlocks.length; i++) {
        const fallingBlock = fallingBlocks[i];
        const blockType = fallingBlock.blockType;
        
        if (BLOCK_TYPES[blockType]) {
            ctx.save();
            
            ctx.fillStyle = BLOCK_TYPES[blockType].color;
            ctx.fillRect(fallingBlock.currentX, fallingBlock.currentY, CONFIG.BLOCK_SIZE, CONFIG.BLOCK_SIZE);
            
            // Ефект обертання під час падіння
            ctx.translate(fallingBlock.currentX + CONFIG.BLOCK_SIZE/2, fallingBlock.currentY + CONFIG.BLOCK_SIZE/2);
            ctx.rotate(fallingBlock.fallSpeed * 0.05);
            
            // Тінь
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.fillRect(-CONFIG.BLOCK_SIZE/2, -CONFIG.BLOCK_SIZE/2 + 3, CONFIG.BLOCK_SIZE, CONFIG.BLOCK_SIZE);
            
            ctx.restore();
            
            // Контур падаючого блоку
            ctx.strokeStyle = 'rgba(0,0,0,0.5)';
            ctx.lineWidth = 2;
            ctx.strokeRect(fallingBlock.currentX, fallingBlock.currentY, CONFIG.BLOCK_SIZE, CONFIG.BLOCK_SIZE);
        }
    }
}

function renderCursor() {
    const blockX = Math.floor(mouse.worldX / CONFIG.BLOCK_SIZE);
    const blockY = Math.floor(mouse.worldY / CONFIG.BLOCK_SIZE);
    if (blockX >= 0 && blockX < CONFIG.WORLD_WIDTH && blockY >= 0 && blockY < CONFIG.WORLD_HEIGHT) {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.strokeRect(blockX * CONFIG.BLOCK_SIZE, blockY * CONFIG.BLOCK_SIZE, CONFIG.BLOCK_SIZE, CONFIG.BLOCK_SIZE);
    }
}