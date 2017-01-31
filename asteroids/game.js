var ship;
var bullets;
var asteroids;
var currentLevel;

function setup() {
	createCanvas(600, 600);
	resetGame();
}

function resetGame() {
	bullets = [];
	asteroids = [];
	currentLevel = 0;
	startNextLevel();
}

function startNextLevel() {
	currentLevel++;
	ship = new Ship(width / 2, height / 2);
	bullets = [];
	for (var i = 0; i < currentLevel; i++) {
		asteroids.push(new Asteroid(createVector(0, 0), random(360)));
	}
}

function draw() {
	background(0);
	
	if (isShipTouchingAnyAsteroid()) {
		resetGame();
	}
	
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
	
	// Move to next level if all asteroids destroyed
	if (asteroids.length == 0) {
		startNextLevel();
	}
	
	// Show user's ship
	checkUserKeyboardInteraction();
	ship.updatePosition();	
	ship.draw();
}

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

function mousePressed() {
//	ship.accelerate();
}

function checkUserKeyboardInteraction() {
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

function keyPressed(evt) {
	if (key === " ") {
		ship.shootBullet();
	}
	// TEMP spawn asteroids by pressing A
	if (key === "A") {
		asteroids.push(new Asteroid(createVector(0, 0), random(360)));
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