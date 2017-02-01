var ship;
var bullets;
var asteroids;
var currentLevel;
var gameState;

var GameState = {
	GAME_INTRO: 1,
	LEVEL_INTRO: 2,
	LEVEL_ACTIVE: 3,
	GAME_OVER: 4
};

// p5.js function, initialize the screen
function setup() {
	createCanvas(600, 600);
	resetGame();
}

// p5.js function, update the screen every frame
function draw() {
	background(0);
	
	// Show title screen
	if (gameState == GameState.GAME_INTRO) {
		drawGameIntroScreen();
	}
	
	// Show level display screen
	if (gameState == GameState.LEVEL_INTRO) {
		drawLevelIntroScreen();
	}
	
	// Show active level
	if (gameState == GameState.LEVEL_ACTIVE) {		
		if (isShipTouchingAnyAsteroid()) {
			// Ship touching an asteroid, trigger Game Over
			gameState = GameState.GAME_OVER;
		}
		else if (asteroids.length == 0) {
			// Move to next level if all asteroids destroyed
			prepareNextLevel();
		}
		else {
			// Update the current level
			drawActiveLevel();
		}
	}
	
	// Show game over screen
	if (gameState == GameState.GAME_OVER) {
		drawGameOverScreen();
	}
}

// Reset all game configuration, move to game title screen
function resetGame() {
	bullets = [];
	asteroids = [];
	currentLevel = 0;
	gameState = GameState.GAME_INTRO;
}

// Increment current level, show level intro
function prepareNextLevel() {
	currentLevel++;
	gameState = GameState.LEVEL_INTRO;
}

// Current level started, prepare all items and show active level
function startNextLevel() {
	// Reset ship in middle of screen
	ship = new Ship(width / 2, height / 2);
	bullets = [];
	// Spawn asteroids (= current level #) on the edge of the screen
	for (var i = 0; i < currentLevel; i++) {
		asteroids.push(new Asteroid(createVector(0, 0), random(360)));
	}
	gameState = GameState.LEVEL_ACTIVE;
}

// Title screen
function drawGameIntroScreen() {
	fill(255);
	stroke(0);
	
	textSize(30);
	textAlign(CENTER);
	text("Asteroids", width / 2, 200);
	
	textSize(16);
	text("Press any key to begin", width / 2, 400);
}

// Game Over message
function drawGameOverScreen() {
	fill(255);
	stroke(0);
	
	textSize(30);
	textAlign(CENTER);
	text("Game Over", width / 2, 200);
	
	textSize(16);
	text("Press any key to start over", width / 2, 400);
}

// Show next level number
function drawLevelIntroScreen() {
	fill(255);
	stroke(0);
	
	textSize(30);
	textAlign(CENTER);
	text("Level " + currentLevel, width / 2, 200);
	
	textSize(16);
	text("Press any key to continue", width / 2, 400);
}

// Draw the current level
function drawActiveLevel() {
	var bulletIndex;
	var bullet;
	// Remove off-screen bullets
	for (bulletIndex = bullets.length - 1; bulletIndex >= 0; bulletIndex--) {
		bullet = bullets[bulletIndex];
		if (!bullet.isWithinBounds()) {
			// Remove current Bullet from the array
			bullets.splice(bulletIndex, 1);
		}
	}
	// Show any remaining bullets
	for (bulletIndex = 0; bulletIndex < bullets.length; bulletIndex++) {
		bullet = bullets[bulletIndex];
		bullet.updatePosition();
		bullet.draw();
	}
	
	// Show asteroids
	var asteroidIndex;
	var asteroid;
	for (asteroidIndex = 0; asteroidIndex < asteroids.length; asteroidIndex++) {
		asteroid = asteroids[asteroidIndex];
		asteroid.updatePosition();
		asteroid.draw();
	}
	
	// If bullets are touching asteroids, break the asteroids
	destroyAsteroidsIfShot();
	
	// Show user's ship
	checkLevelActiveUserKeyboard();
	ship.updatePosition();	
	ship.draw();
}

// Checks if ship is touching an asteroid (cause for Game Over)
function isShipTouchingAnyAsteroid() {
	var asteroidIndex;
	var asteroid;
	for (asteroidIndex = 0; asteroidIndex < asteroids.length; asteroidIndex++) {
		asteroid = asteroids[asteroidIndex];
		if (collideCircleCircle(ship.pos.x, ship.pos.y, ship.size, asteroid.pos.x, asteroid.pos.y, asteroid.getDisplaySize())) {
			return true;
		}
	}
	return false;
}

// Compare each item in 'bullets' against each item in 'asteroids'.
// If any collision is occurring, destroy both objects.
function destroyAsteroidsIfShot() {
	var bulletIndex;
	var bullet;
	var asteroidIndex;
	var asteroid;
	
	for (bulletIndex = bullets.length - 1; bulletIndex >= 0; bulletIndex--) {
		bullet = bullets[bulletIndex];
		for (asteroidIndex = asteroids.length - 1; asteroidIndex >= 0; asteroidIndex--) {
			asteroid = asteroids[asteroidIndex];
			
			if (collideCircleCircle(bullet.pos.x, bullet.pos.y, bullet.size, asteroid.pos.x, asteroid.pos.y, asteroid.getDisplaySize())) {
				// Remove current Bullet and Asteroid from their respective arrays
				bullets.splice(bulletIndex, 1);
				asteroids.splice(asteroidIndex, 1);
				asteroid.breakApart();
				continue;
			}
		}
	}
}

// When level is active, movement should occur continuously while keys are pressed,
// not just on keyPressed events. Use this every frame to check if the ship
// should turn or accelerate.
function checkLevelActiveUserKeyboard() {
	// Affect ship speed/angle
	if (keyIsDown(LEFT_ARROW)) {
		ship.turn(-1);
	}
	if (keyIsDown(RIGHT_ARROW)) {
		ship.turn(1);
	}
	if (keyIsDown(UP_ARROW)) {
		ship.accelerate();
	}
}

// Controls keyboard pressed events.
// Use this to switch game states, or to manage active press events during gameplay.
function keyPressed() {
	switch (gameState) {
		case GameState.GAME_INTRO:
			prepareNextLevel();
			break;
		case GameState.LEVEL_INTRO:
			startNextLevel();
			break;
		case GameState.LEVEL_ACTIVE:
			// Shoot bullets with spacebar.
			if (key === " ") {
				ship.shootBullet();
			}
			break;
		case GameState.GAME_OVER:
			resetGame();
			break;
	}
}
	
// Converts angle (degrees) into X/Y vector.
// Result is a 2D p5 vector.
function getAngleCoords(angle) {
	// Convert angle degrees to radians
	// angle 0   becomes X=0,  Y=-1
	// angle 90  becomes X=1,  Y=0
	// angle 180 becomes X=0,  Y=1
	// angle 270 becomes X=-1, Y=0
	var rads = angle * Math.PI / 180;
	var dirX = sin(rads);
	var dirY = -cos(rads);
	
	return createVector(dirX, dirY);
}