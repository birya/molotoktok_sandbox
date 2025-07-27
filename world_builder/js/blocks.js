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
    9: { color: '#8B4513', solid: true, door: true, name: 'Двері', icon: '🚪' }
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
        if (type !== 0 && current !== 0) return;
        world[x][y] = type;
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