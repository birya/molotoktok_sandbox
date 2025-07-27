// Фізика блоків та гравітація
function updateBlockGravity() {
    gravityTimer++;
    if (gravityTimer % 20 !== 0) return;
    
    const blocksToFall = [];
    
    for (let y = CONFIG.WORLD_HEIGHT - 2; y >= 0; y--) {
        for (let x = 0; x < CONFIG.WORLD_WIDTH; x++) {
            const block = getBlock(x, y);
            
            if (block === 0 || block === 6) continue;
            
            const alreadyFalling = fallingBlocks.some(f => f.startX === x && f.startY === y);
            if (alreadyFalling) continue;
            
            if (!hasSupport(x, y)) {
                const spaceBelow = getBlock(x, y + 1);
                if (spaceBelow === 0) {
                    blocksToFall.push({x: x, y: y, blockType: block});
                }
            }
        }
    }
    
    for (let i = 0; i < blocksToFall.length; i++) {
        const falling = blocksToFall[i];
        
        let landY = falling.y + 1;
        while (landY < CONFIG.WORLD_HEIGHT - 1 && getBlock(falling.x, landY) === 0) {
            landY++;
        }
        
        if (landY < CONFIG.WORLD_HEIGHT) {
            world[falling.x][falling.y] = 0;
            
            fallingBlocks.push({
                startX: falling.x,
                startY: falling.y,
                currentX: falling.x * CONFIG.BLOCK_SIZE,
                currentY: falling.y * CONFIG.BLOCK_SIZE,
                targetX: falling.x * CONFIG.BLOCK_SIZE,
                targetY: (landY - 1) * CONFIG.BLOCK_SIZE,
                blockType: falling.blockType,
                fallSpeed: 0,
                acceleration: 0.3
            });
        }
    }
}

function updateFallingBlocks() {
    for (let i = fallingBlocks.length - 1; i >= 0; i--) {
        const block = fallingBlocks[i];
        
        block.fallSpeed += block.acceleration;
        block.currentY += block.fallSpeed;
        
        if (block.currentY >= block.targetY) {
            const finalX = Math.floor(block.targetX / CONFIG.BLOCK_SIZE);
            const finalY = Math.floor(block.targetY / CONFIG.BLOCK_SIZE);
            world[finalX][finalY] = block.blockType;
            
            fallingBlocks.splice(i, 1);
        }
    }
}