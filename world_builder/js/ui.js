// UI та інтерфейс
function initUI() {
    // Ініціалізація UI залежно від пристрою
    if (isMobile) {
        document.getElementById('device-info').textContent = 'Мобільний пристрій';
        zoom = 0.6;
    } else {
        document.getElementById('device-info').textContent = 'Комп\'ютер';
        document.getElementById('mobileControls').classList.add('desktop-mode');
        document.getElementById('desktopUI').style.display = 'block';
        zoom = 0.8;
    }
    
    // Додавання обробників подій для кнопок збереження/завантаження
    document.getElementById('saveBtn').addEventListener('click', function() {
        if (saveGame()) {
            showNotification('💾 Гру збережено!', 'success');
            updateSaveStatus(); // Оновити статус після збереження
        } else {
            showNotification('❌ Помилка збереження!', 'error');
        }
    });
    
    document.getElementById('loadBtn').addEventListener('click', function() {
        if (loadGame()) {
            updateHotbar();
            updateSaveStatus();
            showNotification('📁 Гру завантажено!', 'success');
        } else {
            updateSaveStatus(); // Оновити статус навіть при помилці
            showNotification('❌ Збереження не знайдено!', 'error');
        }
    });
    
    document.getElementById('newGameBtn').addEventListener('click', function() {
        if (confirm('Створити новий світ? Поточний прогрес буде втрачено!')) {
            deleteSave();
            initWorld();
            updateHotbar();
            updateSaveStatus(); // Оновити статус після видалення
            showNotification('🆕 Новий світ створено!', 'success');
        }
    });
    
    // Початкове оновлення статусу збереження
    updateSaveStatus();
    
    updateHotbar();
}

function showNotification(message, type = 'info') {
    // Створення елементу сповіщення
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? 'rgba(34,139,34,0.9)' : type === 'error' ? 'rgba(220,20,60,0.9)' : 'rgba(0,0,0,0.9)'};
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 200;
        font-size: 14px;
        border: 1px solid ${type === 'success' ? '#228B22' : type === 'error' ? '#DC143C' : '#666'};
        animation: fadeInOut 3s ease-in-out;
    `;
    
    // Додання CSS анімації
    if (!document.getElementById('notificationStyles')) {
        const style = document.createElement('style');
        style.id = 'notificationStyles';
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
                20% { opacity: 1; transform: translateX(-50%) translateY(0); }
                80% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Видалення після анімації
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

function updateSaveStatus() {
    const saveIndicator = document.getElementById('saveIndicator');
    const saveInfo = document.getElementById('saveInfo');
    const loadBtn = document.getElementById('loadBtn');
    
    if (hasSavedGame()) {
        const info = getSaveInfo();
        if (info) {
            saveIndicator.textContent = '💾 Збереження знайдено';
            saveInfo.textContent = `Версія ${info.version} • ${info.sizeKB}KB • Позиція гравця: ${info.playerPos}`;
            loadBtn.disabled = false;
            loadBtn.title = 'Завантажити збережену гру з localStorage';
        } else {
            saveIndicator.textContent = '⚠️ Пошкоджене збереження';
            saveInfo.textContent = 'Збереження існує, але не може бути прочитане';
            loadBtn.disabled = true;
            loadBtn.title = 'Збереження пошкоджене та не може бути завантажене';
        }
    } else {
        saveIndicator.textContent = '📄 Збережень не знайдено';
        saveInfo.textContent = 'Натисніть "Зберегти" щоб створити збереження';
        loadBtn.disabled = true;
        loadBtn.title = 'Немає збережень для завантаження';
    }
}
function updateHotbar() {
    // Update dropdown selection
    const dropdown = document.getElementById('blockDropdown');
    if (dropdown) {
        dropdown.value = selectedBlock.toString();
    }
    
    // Update legacy hotbar slots if they exist (for backwards compatibility)
    const slots = document.querySelectorAll('.hotbar-slot');
    for (let i = 0; i < slots.length; i++) {
        slots[i].classList.toggle('selected', i + 1 === selectedBlock);
    }
    
    // Update current block display
    const currentBlock = BLOCK_TYPES[selectedBlock];
    if (currentBlock) {
        document.getElementById('currentBlockIcon').textContent = currentBlock.icon;
        document.getElementById('currentBlockName').textContent = currentBlock.name;
        document.getElementById('currentBlockNumber').textContent = 'Блок #' + selectedBlock;
    }
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}