var Asteroid = function(posVector, angleDegrees, size) {
	// Current position on screen
	this.pos = posVector;
	// Direction of travel
	this.angle = angleDegrees || 0;
	// Size of asteroid
	this.size = size || 4;
	
	// Scale of asteroid size to pixels
	var _asteroidSizeScale = 15;
	// Speed modifier of asteroids
	var _speedScale = 5;
	
	this.draw = function() {
		fill(0);
		stroke(255, 255, 255);
		ellipse(this.pos.x, this.pos.y, this.getDisplaySize(), this.getDisplaySize());
	}
	
	this.updatePosition = function() {
		var travelSpeed = _speedScale - this.size;
		
		var speed = this.adjustToTravelSpeed(this.angle, travelSpeed);
		this.pos.x += speed.x;
		this.pos.y += speed.y;
		
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
	
	// Returns actual drawing size of asteroid
	this.getDisplaySize = function() {
		return this.size * _asteroidSizeScale;
	}
	
	// Scale angle vector into a speed vector
	this.adjustToTravelSpeed = function(angle, travelSpeed) {
		var vec = getAngleCoords(angle);
		var combinedSpeed = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
		if (combinedSpeed > 0) {
			var scaleFactor = travelSpeed / combinedSpeed;
			return createVector(vec.x * scaleFactor, vec.y * scaleFactor);
		}
		else {
			// The angle is bogus, so just return itself
			return vec;
		}
	}
	
	this.breakApart = function() {
		var newSize = this.size - 1;
		if (newSize > 0) {
			asteroids.push(new Asteroid(createVector(this.pos.x, this.pos.y), random(360), newSize));
			asteroids.push(new Asteroid(createVector(this.pos.x, this.pos.y), random(360), newSize));
		}
	}
}