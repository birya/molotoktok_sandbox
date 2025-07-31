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
    
    updateHotbar();
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