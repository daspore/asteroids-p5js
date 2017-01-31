var Ship = function(x, y, angleDegrees) {
	// Current position on the screen
	this.pos = createVector(x, y);
	// Direction of ship's travel
	this.speed = createVector(0, 0);
	// Angle of ship's orientation (in degrees)
	this.angle = angleDegrees || 0;
	// Drawing size
	this.size = 15;
	
	// Number of degrees to rotate ship
	var _turnSpeed = 4;
	// How much effect a call to accelerate() shouuld affect the ship's speed
	var _accelerationCoefficient = 0.25;
	// Apply a cap on ship's speed, or set to -1 to ignore.
	var _maxShipSpeed = 5;
	
	// Show bullet on the screen
	this.draw = function() {
		// Draw body of the ship
		fill(255);
		stroke(255);
		var size = this.size;
		ellipse(this.pos.x, this.pos.y, size, size);
		
		// Add something to indicate direction the ship is facing
		fill(255, 40, 40);
		stroke(255, 40, 40);
		var aimSize = 5;
		var angleCoords = getAngleCoords(this.angle);
		ellipse(this.pos.x + (angleCoords.x * aimSize), this.pos.y + (angleCoords.y * aimSize), aimSize, aimSize);
	}
	
	// Move ship based on current speed
	this.updatePosition = function() {
		// Update X/Y value
		this.pos.x += this.speed.x;
		this.pos.y += this.speed.y;

		// Wrap position around edges
		// X vs width
		while (this.pos.x < 0) {
			this.pos.x += width;
		}
		while (this.pos.x > width) {
			this.pos.x -= width;
		}
		// Y vs height
		while (this.pos.y < 0) {
			this.pos.y += height;
		}
		while (this.pos.y > height) {
			this.pos.y -= height;
		}
	}
	
	// Rotate ship. Negative is left (use -1), Positive is right (use 1). 
	this.turn = function(dir) {
		this.angle += _turnSpeed * dir;
	}
	
	// Change ship's speed based on its current angle
	// (i.e. add speed in ship's scurrent direction)
	this.accelerate = function() {
		var angleCoords = getAngleCoords(this.angle);
		this.speed.x += _accelerationCoefficient * angleCoords.x;
		this.speed.y += _accelerationCoefficient * angleCoords.y;
		this.ensureMaxSpeed();
	}
	
	// Create a new Bullet object
	this.shootBullet = function() {
		var bullet = new Bullet(createVector(this.pos.x, this.pos.y), this.angle);
		bullets.push(bullet);
	}
	
	// If ship's combined speed is above the max speed,
	// reduce the component speeds appropriately.
	this.ensureMaxSpeed = function() {
		if (_maxShipSpeed < 0) {
			// Invalid max speed, don't restrict current speed
			return;
		}
		if (_maxShipSpeed == 0) {
			// Boring ship, never allow it to move
			this.speed.x = 0;
			this.speed.y = 0;
			return;
		}
		
		// Get Euclidean distance of component-wise speed values
		var combinedSpeed = Math.sqrt(this.speed.x * this.speed.x + this.speed.y * this.speed.y);
		
		if (combinedSpeed > 0 && combinedSpeed > _maxShipSpeed) {
			// Scale speed values to restrict max speed
			var scaleFactor = _maxShipSpeed / combinedSpeed;
			this.speed.x *= scaleFactor;
			this.speed.y *= scaleFactor;
		}
	}
}