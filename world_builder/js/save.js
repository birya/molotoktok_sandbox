// Функції збереження та завантаження гри
function saveGame() {
    try {
        const state = {
            version: 1,
            world: world,
            player: player,
            doorStates: doorStates,
            selectedBlock: selectedBlock,
            buildMode: buildMode
        };
        
        localStorage.setItem('world_builder_save', JSON.stringify(state));
        console.log('✅ Гру збережено!');
        return true;
    } catch (error) {
        console.error('❌ Помилка збереження:', error);
        return false;
    }
}

function loadGame() {
    try {
        const saved = localStorage.getItem('world_builder_save');
        if (!saved) {
            console.log('📄 Збереженої гри не знайдено');
            return false;
        }
        
        const state = JSON.parse(saved);
        
        // Перевірка версії (для майбутньої сумісності)
        if (state.version && state.version > 1) {
            console.warn('⚠️ Збереження з новішою версією, можливі проблеми сумісності');
        }
        
        // Відновлення світу
        if (state.world && Array.isArray(state.world)) {
            world = state.world;
            console.log('🌍 Світ завантажено');
        }
        
        // Відновлення гравця
        if (state.player && typeof state.player === 'object') {
            Object.assign(player, state.player);
            console.log('👤 Стан гравця відновлено');
        }
        
        // Відновлення дверей
        if (state.doorStates && typeof state.doorStates === 'object') {
            doorStates = state.doorStates;
            console.log('🚪 Стан дверей відновлено');
        }
        
        // Відновлення вибраного блоку
        if (typeof state.selectedBlock === 'number' && state.selectedBlock >= 1 && state.selectedBlock <= 11) {
            selectedBlock = state.selectedBlock;
        }
        
        // Відновлення режиму будівництва
        if (typeof state.buildMode === 'boolean') {
            buildMode = state.buildMode;
        }
        
        console.log('✅ Гру завантажено успішно!');
        return true;
        
    } catch (error) {
        console.error('❌ Помилка завантаження:', error);
        return false;
    }
}

function deleteSave() {
    try {
        localStorage.removeItem('world_builder_save');
        console.log('🗑️ Збереження видалено');
        return true;
    } catch (error) {
        console.error('❌ Помилка видалення збереження:', error);
        return false;
    }
}

function hasSavedGame() {
    return localStorage.getItem('world_builder_save') !== null;
}

function getSaveInfo() {
    try {
        const saved = localStorage.getItem('world_builder_save');
        if (!saved) {
            return null;
        }
        
        const state = JSON.parse(saved);
        const saveSize = saved.length;
        const saveSizeKB = Math.round(saveSize / 1024 * 10) / 10;
        
        // Try to get creation date from player position or use current date as fallback
        const saveDate = new Date().toLocaleDateString('uk-UA', {
            year: 'numeric',
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        return {
            version: state.version || 1,
            size: saveSize,
            sizeKB: saveSizeKB,
            date: saveDate,
            hasWorld: Array.isArray(state.world),
            worldSize: Array.isArray(state.world) ? state.world.length : 0,
            hasPlayer: !!state.player,
            playerPos: state.player ? `(${Math.round(state.player.x/40)}, ${Math.round(state.player.y/40)})` : 'невідома'
        };
    } catch (error) {
        console.error('❌ Помилка аналізу збереження:', error);
        return null;
    }
}