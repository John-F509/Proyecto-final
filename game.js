const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 400,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let self;
let score = 0;
let scoreElement, messageElement, loseMessageContainer, retryButton;
let tileSize = 40;
let rows = 150;
let cols = 150;
let tiles = [];
let gameOver = false;  // Nueva variable para verificar si el juego ha terminado

function preload() {
    // Cargar recursos aquí si es necesario
}

function create() {
    self = this;
    scoreElement = document.getElementById('score');  // Referencia al elemento de puntuación
    messageElement = document.getElementById('message');  // Referencia al elemento de mensajes
    loseMessageContainer = document.getElementById('loseMessageContainer');  // Contenedor de mensaje de pérdida
    retryButton = document.getElementById('retryButton');  // Botón de reinicio

    // Añadir evento de clic en el botón de reinicio
    retryButton.addEventListener('click', resetGame);

    initGrid();
    drawGrid();

    self.input.on('pointerdown', handlePointerDown, self);
}

function initGrid() {
    gameOver = false;  // Reiniciar la variable gameOver
    score = 0;  // Reiniciar la puntuación
    scoreElement.innerHTML = `Puntuación: ${score}`;
    loseMessageContainer.style.display = 'none';  // Ocultar el mensaje de pérdida

    // Inicializar la cuadrícula con bombas y casillas vacías
    for (let i = 0; i < rows; i++) {
        tiles[i] = [];
        for (let j = 0; j < cols; j++) {
            tiles[i][j] = {
                bomb: Math.random() < 0.15,  // 15% de probabilidad de que sea una bomba
                opened: false,
                rect: null
            };
        }
    }
}

function drawGrid() {
    // Dibujar la cuadrícula en pantalla
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let x = j * tileSize;
            let y = i * tileSize;

            let tile = self.add.rectangle(x, y, tileSize, tileSize, 0xaaaaaa).setOrigin(0);
            tile.setStrokeStyle(2, 0x000000);
            tiles[i][j].rect = tile;
        }
    }
}

function handlePointerDown(pointer) {
    if (gameOver) {
        return;  // Si el juego ha terminado, no permite más clics
    }

    let col = Math.floor(pointer.x / tileSize);
    let row = Math.floor(pointer.y / tileSize);

    if (row >= 0 && row < rows && col >= 0 && col < cols) {
        revealTile(row, col);
    }
}

function revealTile(row, col) {
    if (tiles[row][col].opened) {
        return;
    }

    tiles[row][col].opened = true;

    if (tiles[row][col].bomb) {
        tiles[row][col].rect.setFillStyle(0xff0000);  // Bomba, color rojo
        endGame();  // Terminar el juego si se revela una bomba
        return;
    }

    // Contar bombas adyacentes
    let bombCount = countAdjacentBombs(row, col);
    tiles[row][col].adjacentBombs = bombCount;

    if (bombCount > 0) {
        tiles[row][col].rect.setFillStyle(0xffffff);
        self.add.text(col * tileSize + 10, row * tileSize + 10, bombCount, { fontSize: '20px', fill: '#000' });
        updateScore(10);  // Aumentar puntuación por cada casilla revelada sin bomba
    } else {
        tiles[row][col].rect.setFillStyle(0xdddddd);
        updateScore(5);  // Puntuación menor por casillas vacías
    }
}

function countAdjacentBombs(row, col) {
    let count = 0;
    for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
            if (i >= 0 && i < rows && j >= 0 && j < cols && tiles[i][j].bomb) {
                count++;
            }
        }
    }
    return count;
}

function updateScore(points) {
    score += points;
    scoreElement.innerHTML = `Puntuación: ${score}`;  // Actualizar el DOM con la nueva puntuación
    
    // Animación de actualización de puntuación
    scoreElement.style.color = '#00cc00';
    setTimeout(() => {
        scoreElement.style.color = '#000';
    }, 500);
}

function endGame() {
    gameOver = true;  // Establecer el estado del juego como terminado
    loseMessageContainer.style.display = 'flex';  // Mostrar el mensaje de pérdida en toda la pantalla
}

function resetGame() {
    self.scene.restart();  // Reiniciar la escena de Phaser
}

function update() {
    // Actualizaciones del juego si es necesario
}
