// Типи блоків та їх властивості
const BLOCK_TYPES = {
    0: { color: null, solid: false, name: '', icon: '' },
    1: { color: '#8B4513', solid: true, name: 'Земля', icon: '🟫' },
    2: { color: '#228B22', solid: true, name: 'Трава', icon: '🟩' },
    3: { color: '#C0C0C0', solid: true, name: 'Камінь', icon: '⬜' },
    4: { color: '#4169E1', solid: true, name: 'Вода', icon: '🟦' },
    5: { color: '#DC143C', solid: true, name: 'Лава', icon: '🟥' },
    6: { color: '#2F2F2F', solid: true, indestructible: true, name: 'Коренна порода', icon: '⬛' },
    7: { color: '#8B4513', solid: false, name: 'Деревина', icon: '🟤' },
    8: { color: '#228B22', solid: false, name: 'Листя', icon: '🍃' },
    9: { color: '#8B4513', solid: true, door: true, name: 'Двері', icon: '🚪' },
    10: { color: '#87CEEB', solid: false, name: 'Вікно', icon: '🪟' }
};

// Функції для роботи з блоками
function getBlock(x, y) {
    if (x < 0 || x >= CONFIG.WORLD_WIDTH || y < 0 || y >= CONFIG.WORLD_HEIGHT) return 0;
    return world[x][y];
}

function setBlock(x, y, type) {
    if (x >= 0 && x < CONFIG.WORLD_WIDTH && y >= 0 && y < CONFIG.WORLD_HEIGHT) {
        const current = world[x][y];
        if (type === 0 && BLOCK_TYPES[current] && BLOCK_TYPES[current].indestructible) return;
        
        // Special handling for removing doors
        if (type === 0 && current === 9) {
            removeDoor(x, y);
            return;
        }
        
        // Special handling for doors (2x1 blocks)
        if (type === 9) {
            return placeDoor(x, y);
        }
        
        if (type !== 0 && current !== 0) return;
        world[x][y] = type;
    }
}

function placeDoor(x, y) {
    // Doors are 2 blocks high, 1 block wide
    // Check if both positions are available
    if (x >= 0 && x < CONFIG.WORLD_WIDTH && y >= 1 && y < CONFIG.WORLD_HEIGHT) {
        const bottomBlock = getBlock(x, y);
        const topBlock = getBlock(x, y - 1);
        
        if (bottomBlock === 0 && topBlock === 0) {
            world[x][y] = 9; // Bottom part of door
            world[x][y - 1] = 9; // Top part of door
            
            // Initialize door as closed
            const doorId = x + ',' + (y - 1); // Use top block position as door ID
            doorStates[doorId] = false; // false = closed, true = open
            return true;
        }
    }
    return false;
}

function removeDoor(x, y) {
    // When removing a door block, remove both parts
    if (getBlock(x, y) === 9) {
        // Check if this is part of a door
        const bottomId = x + ',' + y;
        const topId = x + ',' + (y - 1);
        const aboveId = x + ',' + (y + 1);
        
        // Remove door parts and door state
        if (getBlock(x, y - 1) === 9) {
            // This is bottom part, remove both
            world[x][y] = 0;
            world[x][y - 1] = 0;
            delete doorStates[topId];
        } else if (getBlock(x, y + 1) === 9) {
            // This is top part, remove both
            world[x][y] = 0;
            world[x][y + 1] = 0;
            delete doorStates[bottomId];
        } else {
            // Single block (shouldn't happen but handle it)
            world[x][y] = 0;
            delete doorStates[bottomId];
        }
    }
}

function hasSupport(x, y) {
    const positions = [
        {dx: 0, dy: 1}, {dx: -1, dy: 0}, {dx: 1, dy: 0}, {dx: 0, dy: -1},
        {dx: -1, dy: 1}, {dx: 1, dy: 1}, {dx: -1, dy: -1}, {dx: 1, dy: -1}
    ];
    
    const block = getBlock(x, y);
    
    // Листя має спеціальну логіку підтримки
    if (block === 8) {
        // Листя підтримується будь-яким solid блоком АБО деревиною
        for (let i = 0; i < positions.length; i++) {
            const checkX = x + positions[i].dx;
            const checkY = y + positions[i].dy;
            const supportBlock = getBlock(checkX, checkY);
            
            // Листя підтримується solid блоками або деревиною
            if ((BLOCK_TYPES[supportBlock] && BLOCK_TYPES[supportBlock].solid) || supportBlock === 7) {
                return true;
            }
        }
        
        // Додаткова перевірка: листя підтримується іншим листям, що підтримується деревиною
        for (let i = 0; i < positions.length; i++) {
            const checkX = x + positions[i].dx;
            const checkY = y + positions[i].dy;
            const supportBlock = getBlock(checkX, checkY);
            
            if (supportBlock === 8) { // Інше листя
                if (hasWoodSupport(checkX, checkY, 3)) {
                    return true;
                }
            }
        }
        
        return false;
    } else {
        // Звичайні блоки підтримуються тільки solid блоками
        for (let i = 0; i < positions.length; i++) {
            const checkX = x + positions[i].dx;
            const checkY = y + positions[i].dy;
            const supportBlock = getBlock(checkX, checkY);
            
            if (BLOCK_TYPES[supportBlock] && BLOCK_TYPES[supportBlock].solid) {
                return true;
            }
        }
        return false;
    }
}

function hasWoodSupport(x, y, radius) {
    // Перевіряємо чи є деревина в радіусі
    for (let dx = -radius; dx <= radius; dx++) {
        for (let dy = -radius; dy <= radius; dy++) {
            const checkX = x + dx;
            const checkY = y + dy;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= radius) {
                const block = getBlock(checkX, checkY);
                if (block === 7) { // Деревина
                    return true;
                }
            }
        }
    }
    return false;
}

function isDoorOpen(x, y) {
    // Check if door at this position is open
    const doorId = x + ',' + y;
    const doorIdBelow = x + ',' + (y + 1);
    
    // Check both possible door IDs (top or bottom part)
    return doorStates[doorId] === true || doorStates[doorIdBelow] === true;
}

function toggleDoor(x, y) {
    // Toggle door state when clicked
    if (getBlock(x, y) === 9) {
        let doorId;
        
        // Determine which part of the door was clicked
        if (getBlock(x, y - 1) === 9) {
            // Clicked bottom part, door ID is top part
            doorId = x + ',' + (y - 1);
        } else if (getBlock(x, y + 1) === 9) {
            // Clicked top part, door ID is this position  
            doorId = x + ',' + y;
        } else {
            // Single block door (fallback)
            doorId = x + ',' + y;
        }
        
        if (doorStates.hasOwnProperty(doorId)) {
            doorStates[doorId] = !doorStates[doorId];
            return true;
        }
    }
    return false;
}