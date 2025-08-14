// Основний файл гри
function initGame() {
    console.log("🎮 Запуск гри...");
    
    // Ініціалізація canvas
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Ініціалізація компонентів
    initUI();
    initControls();
    
    // Спроба завантаження збереженої гри
    if (!loadGame()) {
        // Якщо збереження не знайдено, створюємо новий світ
        initWorld();
    } else {
        // Якщо гру завантажено, оновлюємо інтерфейс
        updateHotbar();
    }
    
    // Оновлення статусу збереження після ініціалізації
    updateSaveStatus();
    
    // Обробник зміни розміру вікна
    window.addEventListener('resize', resizeCanvas);
    
    // Автозбереження при закритті сторінки
    window.addEventListener('beforeunload', saveGame);
    
    console.log("🚀 Запуск ігрового циклу...");
    gameLoop();
    console.log("✅ Гра запущена!");
}

function gameLoop() {
    updatePlayer();
    updateBlockGravity();
    updateFallingBlocks();
    render();
    requestAnimationFrame(gameLoop);
}

// Запуск гри після завантаження сторінки
document.addEventListener('DOMContentLoaded', function() {
    initGame();
});