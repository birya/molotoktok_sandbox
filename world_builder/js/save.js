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