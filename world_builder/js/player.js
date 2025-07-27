// Функції для гравця
function drawPlayer(ctx, x, y, width, height, facing, state, animFrame) {
    ctx.save();
    
    if (facing === -1) {
        ctx.scale(-1, 1);
        x = -x - width;
    }
    
    // Тіло
    ctx.fillStyle = '#4A90E2';
    ctx.fillRect(x + width * 0.15, y + height * 0.35, width * 0.7, height * 0.4);
    
    // Голова
    ctx.fillStyle = '#FFDBAC';
    ctx.fillRect(x + width * 0.2, y + height * 0.05, width * 0.6, height * 0.3);
    
    // Волосся
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x + width * 0.15, y, width * 0.7, height * 0.15);
    
    // Очі
    ctx.fillStyle = '#000';
    ctx.fillRect(x + width * 0.3, y + height * 0.15, width * 0.1, width * 0.1);
    ctx.fillRect(x + width * 0.6, y + height * 0.15, width * 0.1, width * 0.1);
    
    // Руки
    ctx.fillStyle = '#FFDBAC';
    const armOffset = state === 'walking' ? Math.sin(animFrame * 0.3) * 3 : 0;
    ctx.fillRect(x + width * 0.05, y + height * 0.4 + armOffset, width * 0.15, height * 0.35);
    ctx.fillRect(x + width * 0.8, y + height * 0.4 - armOffset, width * 0.15, height * 0.35);
    
    // Ноги
    ctx.fillStyle = '#654321';
    const legOffset = state === 'walking' ? Math.sin(animFrame * 0.3) * 4 : 0;
    ctx.fillRect(x + width * 0.25, y + height * 0.75 + legOffset, width * 0.2, height * 0.25);
    ctx.fillRect(x + width * 0.55, y + height * 0.75 - legOffset, width * 0.2, height * 0.25);
    
    ctx.restore();
}

function updatePlayer() {
    // Рух гравця
    if (isMobile) {
        player.vx = moveDirection.x * CONFIG.MOVE_SPEED;
    } else {
        player.vx = 0;
        if (keys['a'] || keys['A'] || keys['ArrowLeft']) player.vx = -CONFIG.MOVE_SPEED;
        if (keys['d'] || keys['D'] || keys['ArrowRight']) player.vx = CONFIG.MOVE_SPEED;
        if ((keys['w'] || keys['W'] || keys['ArrowUp'] || keys[' ']) && player.onGround) {
            player.vy = CONFIG.JUMP_FORCE;
            player.onGround = false;
        }
    }
    
    // Анімація
    if (Math.abs(player.vx) > 0.1) {
        player.state = 'walking';
        player.facing = player.vx > 0 ? 1 : -1;
        player.animFrame++;
    } else {
        player.state = 'idle';
        player.animFrame = 0;
    }
    
    if (!player.onGround) player.state = 'jumping';
    
    // Фізика
    player.vy += CONFIG.GRAVITY;
    player.x += player.vx;
    player.y += player.vy;
    
    // Межі світу
    if (player.x < 0) player.x = 0;
    if (player.x > CONFIG.WORLD_WIDTH * CONFIG.BLOCK_SIZE - player.width) {
        player.x = CONFIG.WORLD_WIDTH * CONFIG.BLOCK_SIZE - player.width;
    }
    
    // Колізії з блоками
    checkPlayerCollisions();
    
    // Оновлення камери
    camera.x = player.x - canvas.width / (2 * zoom);
    camera.y = player.y - canvas.height / (2 * zoom);
}

function checkPlayerCollisions() {
    const playerBlockX = Math.floor(player.x / CONFIG.BLOCK_SIZE);
    const playerBlockY = Math.floor(player.y / CONFIG.BLOCK_SIZE);
    
    player.onGround = false;
    
    for (let x = playerBlockX; x <= Math.floor((player.x + player.width) / CONFIG.BLOCK_SIZE); x++) {
        for (let y = playerBlockY; y <= Math.floor((player.y + player.height) / CONFIG.BLOCK_SIZE); y++) {
            const block = getBlock(x, y);
            if (BLOCK_TYPES[block] && BLOCK_TYPES[block].solid) {
                const blockLeft = x * CONFIG.BLOCK_SIZE;
                const blockRight = (x + 1) * CONFIG.BLOCK_SIZE;
                const blockTop = y * CONFIG.BLOCK_SIZE;
                const blockBottom = (y + 1) * CONFIG.BLOCK_SIZE;
                
                if (player.x < blockRight && player.x + player.width > blockLeft &&
                    player.y < blockBottom && player.y + player.height > blockTop) {
                    
                    if (player.vy > 0 && player.y < blockTop) {
                        player.y = blockTop - player.height;
                        player.vy = 0;
                        player.onGround = true;
                    } else if (player.vy < 0 && player.y > blockBottom) {
                        player.y = blockBottom;
                        player.vy = 0;
                    }
                    
                    if (player.vx > 0 && player.x < blockLeft) {
                        if (player.onGround && getBlock(x, y - 1) === 0) {
                            player.y = blockTop - player.height;
                        } else {
                            player.x = blockLeft - player.width;
                        }
                    } else if (player.vx < 0 && player.x > blockRight) {
                        if (player.onGround && getBlock(x, y - 1) === 0) {
                            player.y = blockTop - player.height;
                        } else {
                            player.x = blockRight;
                        }
                    }
                }
            }
        }
    }
}