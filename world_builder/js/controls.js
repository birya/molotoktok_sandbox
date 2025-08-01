// Система керування
function initControls() {
    // Клавіатура
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Миша
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('contextmenu', handleContextMenu);
    canvas.addEventListener('wheel', handleMouseWheel);
    
    // Мобільне керування
    if (isMobile) {
        initMobileControls();
    }
    
    // Хотбар
    initHotbar();
}

function handleKeyDown(e) {
    keys[e.key] = true;
    const num = parseInt(e.key);
    if (num >= 1 && num <= 9) {
        selectedBlock = num;
        updateHotbar();
    } else if (e.key === '0') {
        selectedBlock = 10;
        updateHotbar();
    }
}

function handleKeyUp(e) {
    keys[e.key] = false;
}

function handleMouseMove(e) {
    if (!isMobile) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.worldX = camera.x + mouse.x / zoom;
        mouse.worldY = camera.y + mouse.y / zoom;
    }
}

function handleMouseDown(e) {
    if (!isMobile) {
        // Update mouse position in case mousemove wasn't triggered
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.worldX = camera.x + mouse.x / zoom;
        mouse.worldY = camera.y + mouse.y / zoom;
        
        const blockX = Math.floor(mouse.worldX / CONFIG.BLOCK_SIZE);
        const blockY = Math.floor(mouse.worldY / CONFIG.BLOCK_SIZE);
        
        if (e.button === 0) {
            // Left click: place block or interact with door
            const existingBlock = getBlock(blockX, blockY);
            if (existingBlock === 9) {
                // Click on door to toggle it
                toggleDoor(blockX, blockY);
            } else {
                // Place new block
                setBlock(blockX, blockY, selectedBlock);
            }
        } else if (e.button === 2) {
            // Right click: remove block
            setBlock(blockX, blockY, 0);
        }
    }
}

function handleContextMenu(e) {
    if (!isMobile) e.preventDefault();
}

function handleMouseWheel(e) {
    if (!isMobile) {
        e.preventDefault();
        const factor = e.deltaY > 0 ? 0.9 : 1.1;
        zoom = Math.max(0.3, Math.min(3, zoom * factor));
    }
}

function initMobileControls() {
    const joystick = document.getElementById('joystick');
    const knob = document.getElementById('joystickKnob');
    
    joystick.addEventListener('touchstart', function(e) {
        e.preventDefault();
        joystickActive = true;
    });
    
    joystick.addEventListener('touchmove', function(e) {
        e.preventDefault();
        if (!joystickActive) return;
        
        const touch = e.touches[0];
        const rect = joystick.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        let deltaX = touch.clientX - centerX;
        let deltaY = touch.clientY - centerY;
        
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = 35;
        
        if (distance > maxDistance) {
            deltaX = (deltaX / distance) * maxDistance;
            deltaY = (deltaY / distance) * maxDistance;
        }
        
        knob.style.transform = 'translate(' + (deltaX - 15) + 'px, ' + (deltaY - 15) + 'px)';
        moveDirection.x = deltaX / maxDistance;
    });
    
    joystick.addEventListener('touchend', function(e) {
        e.preventDefault();
        joystickActive = false;
        knob.style.transform = 'translate(-50%, -50%)';
        moveDirection.x = 0;
    });
    
    document.getElementById('jumpBtn').addEventListener('touchstart', function(e) {
        e.preventDefault();
        if (player.onGround) {
            player.vy = CONFIG.JUMP_FORCE;
            player.onGround = false;
        }
    });
    
    document.getElementById('buildBtn').addEventListener('touchstart', function(e) {
        e.preventDefault();
        buildMode = !buildMode;
        e.target.textContent = buildMode ? 'БУДУВАТИ' : 'КОПАТИ';
    });
    
    canvas.addEventListener('touchend', function(e) {
        e.preventDefault();
        const touch = e.changedTouches[0];
        const rect = canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        const worldX = camera.x + x / zoom;
        const worldY = camera.y + y / zoom;
        const blockX = Math.floor(worldX / CONFIG.BLOCK_SIZE);
        const blockY = Math.floor(worldY / CONFIG.BLOCK_SIZE);
        
        if (buildMode) {
            // Check if clicking on a door to toggle it
            const existingBlock = getBlock(blockX, blockY);
            if (existingBlock === 9) {
                toggleDoor(blockX, blockY);
            } else {
                setBlock(blockX, blockY, selectedBlock);
            }
        } else {
            setBlock(blockX, blockY, 0);
        }
    });
}

function initHotbar() {
    const dropdown = document.getElementById('blockDropdown');
    if (dropdown) {
        // Set default selected value
        dropdown.value = selectedBlock.toString();
        
        // Handle dropdown change
        dropdown.addEventListener('change', function() {
            const newBlock = parseInt(this.value);
            if (newBlock >= 1 && newBlock <= 11) {
                selectedBlock = newBlock;
                updateHotbar();
            }
        });
        
        // Prevent dropdown from interfering with game controls
        dropdown.addEventListener('mousedown', function(e) {
            e.stopPropagation();
        });
        
        dropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}