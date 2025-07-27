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
    initWorld();
    
    // Обробник зміни розміру вікна
    window.addEventListener('resize', resizeCanvas);
    
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