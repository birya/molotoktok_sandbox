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
        } else {
            showNotification('❌ Помилка збереження!', 'error');
        }
    });
    
    document.getElementById('loadBtn').addEventListener('click', function() {
        if (loadGame()) {
            updateHotbar();
            showNotification('📁 Гру завантажено!', 'success');
        } else {
            showNotification('❌ Збереження не знайдено!', 'error');
        }
    });
    
    document.getElementById('newGameBtn').addEventListener('click', function() {
        if (confirm('Створити новий світ? Поточний прогрес буде втрачено!')) {
            deleteSave();
            initWorld();
            updateHotbar();
            showNotification('🆕 Новий світ створено!', 'success');
        }
    });
    
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