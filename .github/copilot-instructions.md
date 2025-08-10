# Світобудівник 2D (2D World Builder)

Світобудівник 2D is a pure HTML5/CSS/JavaScript 2D sandbox game for creating and exploring 2D worlds, similar to a 2D version of Minecraft. The game features block placement, world generation, physics, and both desktop and mobile controls.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap and Run the Application
- Clone the repository and navigate to the `world_builder/` directory
- **NO BUILD REQUIRED** - This is a pure client-side HTML5 application with no dependencies
- Start a local web server: `python3 -m http.server 8080` (takes 1-2 seconds to start, outputs "Serving HTTP on 0.0.0.0 port 8080")
- Open browser and navigate to `http://localhost:8080`
- Game loads **INSTANTLY** (under 1 second) with console messages: "🎮 Запуск гри...", "🌍 Створення світу...", "✅ Гра запущена!"
- **VERIFIED**: All timing expectations confirmed through testing

### Testing and Validation
- **ALWAYS** test the application using a web server (HTTP protocol) - the `file://` protocol may have limitations
- **ALWAYS** manually validate functionality after making changes:
  - Load the game and verify no JavaScript console errors
  - Test block selection using the dropdown (changes current block icon and name)
  - Test keyboard controls (WASD for movement, Space for jump)
  - Test mouse controls (left click to place blocks, right click to remove)
  - Test number keys (1-8) for quick block selection
- **SCENARIO VALIDATION**: Complete user scenarios to test:
  1. **Load game → Select different block types → Place blocks with mouse clicks**
     - VERIFIED: Dropdown selection changes current block icon and name instantly
     - VERIFIED: Block changes from 🟫 Земля → ⬜ Камінь → 🟩 Трава
  2. **Use WASD movement → Jump with Space → Switch blocks with number keys**
     - VERIFIED: WASD keys register input (movement in game canvas)
     - VERIFIED: Space key registers for jump function
     - VERIFIED: Number keys 1-2 switch blocks (1=Земля, 2=Трава) and update both icon and dropdown
  3. **Test mobile interface on smaller screen sizes**
     - Mobile UI elements present and functional (joystick, buttons, dropdown)

### Development Workflow
- Make changes to HTML/CSS/JavaScript files
- Refresh browser to see changes (no rebuild needed)
- **NO LINTING OR BUILD TOOLS** - manual code review only
- **NO PACKAGE MANAGER** - no dependencies to install or update
- **NO CI/CD** - no automated builds or tests exist

## Validation

- **ALWAYS** test changes by running the game in a browser via HTTP server
- **NEVER CANCEL** the simple HTTP server startup - it takes only 1-2 seconds (VERIFIED)
- Game loads and responds immediately - if it takes more than 5 seconds, there's an error
- **MANUAL TESTING REQUIRED**: Automated UI tests are not available - all validation must be manual
- **VERIFIED WORKING COMMANDS**: All instructions below have been tested and confirmed working
- You can test the application using Playwright browser automation for validation
- Verify game functionality by interacting with UI elements and controls
- **Expected Console Output**: Look for "🎮 Запуск гри...", "🌍 Створення світу...", "✅ Гра запущена!" messages

## Application Structure

### Repository Layout
```
/
├── README.md              # Basic repository info (in Ukrainian)
├── LICENSE               # License file
└── world_builder/
    ├── index.html        # Main entry point
    ├── README.md         # Game documentation (in Ukrainian)
    ├── css/
    │   └── styles.css    # All UI styling and responsive design
    └── js/              # Modular JavaScript architecture
        ├── config.js     # Game configuration and global variables
        ├── blocks.js     # Block types and block-related functions
        ├── world.js      # World generation and management
        ├── player.js     # Player logic and animation
        ├── physics.js    # Block physics and gravity system
        ├── renderer.js   # Rendering and graphics engine
        ├── controls.js   # Input handling (keyboard, mouse, touch)
        ├── ui.js        # User interface management
        └── game.js      # Main game loop and initialization
```

### Key Technologies
- **Pure HTML5** - No frameworks or libraries
- **Vanilla JavaScript** - ES6+ features, modular but script-tag loaded
- **Canvas API** - All rendering done through HTML5 Canvas
- **CSS3** - Responsive design for desktop and mobile
- **No build tools** - No webpack, babel, or other compilation needed
- **No external dependencies** - Everything is self-contained

### Game Features
- **Block Types**: 11 different block types (Dirt, Grass, Stone, Water, Lava, Bedrock, Wood, Leaves, Doors, Windows, Wooden Wall)
- **Controls**: Full desktop (WASD + mouse) and mobile (touch) support
- **Physics**: Block gravity, falling blocks, player movement
- **World Generation**: Automatic terrain, caves, and tree generation
- **Responsive UI**: Adapts to desktop and mobile screen sizes

## Common Tasks

### Game Configuration
- All game settings in `js/config.js`:
  ```javascript
  const CONFIG = {
      BLOCK_SIZE: 40,        // Size of each block in pixels
      WORLD_WIDTH: 400,      // World width in blocks
      WORLD_HEIGHT: 200,     // World height in blocks
      GRAVITY: 0.5,          // Gravity strength
      JUMP_FORCE: -12,       // Player jump strength
      MOVE_SPEED: 4          // Player movement speed
  };
  ```

### Adding New Block Types
1. Add new block type to `BLOCK_TYPES` in `js/blocks.js`
2. Update the dropdown options in `index.html` 
3. Add rendering logic in `js/renderer.js` if needed
4. Test by selecting new block and placing it in game

### Game Controls Reference
- **Desktop**: WASD (move), Space (jump), Mouse (place/remove blocks), 1-8 (select blocks), Mouse wheel (zoom)
- **Mobile**: Virtual joystick (move), Touch buttons (jump/build), Dropdown (block selection), Touch screen (place blocks)

### File Locations for Common Changes
- **UI/Interface**: `index.html` and `css/styles.css`
- **Game Logic**: `js/game.js` and `js/player.js`  
- **Block Behavior**: `js/blocks.js` and `js/physics.js`
- **Graphics/Rendering**: `js/renderer.js`
- **Controls**: `js/controls.js`
- **Configuration**: `js/config.js`

### Debugging
- Open browser Developer Tools Console to see game logs
- Game outputs status messages: "🎮 Запуск гри...", "🌍 Створення світу...", "✅ Гра запущена!"
- All JavaScript files use console.log for debugging output
- No specific debugging tools - use browser DevTools

## Language and Localization

- **Interface Language**: Ukrainian ("Світобудівник" = "World Builder")
- **Code Comments**: Mix of Ukrainian and English
- **User Interface**: All text in Ukrainian
- **Documentation**: README files in Ukrainian
- When making changes, maintain consistency with Ukrainian interface text

## Important Notes

- **NO BUILD PROCESS NEEDED** - Changes take effect immediately on browser refresh
- **NO DEPENDENCIES** - Self-contained application with no external libraries
- **NO AUTOMATED TESTS** - All testing must be manual
- **NO CI/CD** - No GitHub Actions or automated workflows
- **INSTANT LOADING** - Game starts immediately when page loads
- **CLIENT-SIDE ONLY** - No server-side logic or database
- **BROWSER COMPATIBILITY** - Requires modern browser with HTML5 Canvas support

## Troubleshooting

- **Game doesn't load**: Check browser console for JavaScript errors
- **Controls not working**: Ensure page has focus, check for JavaScript errors
- **Blocks not placing**: Verify mouse position is over canvas, check selected block type
- **Performance issues**: Check browser DevTools Performance tab, consider reducing world size in config
- **File:// protocol issues**: Always use HTTP server for testing, not direct file opening

## Performance Optimization

The game includes several performance optimizations:
- **Viewport culling**: Only renders visible blocks
- **Optimized rendering**: Efficient canvas drawing operations
- **Memory management**: Proper object cleanup and reuse
- **Modular code**: Clean separation of concerns for maintainability

Always test performance after making changes, especially to rendering or physics code.