var Bullet = function(posVector, angleDegrees) {
	// Current position on screen
	this.pos = posVector;
	// Direction of travel
	this.angle = angleDegrees || 0;
	// Drawing size
	this.size = 4;

	
	// Speed for all bullets
	var _bulletTravelSpeed = 6;
	
	// Show bullet on the screen
	this.draw = function() {
		fill(255, 255, 0);
		stroke(255, 255, 0);
		var size = this.size;
		ellipse(this.pos.x, this.pos.y, size, size);
	}
	
	// Alter bullet's position based on the speed vector
	this.updatePosition = function() {
		var speed = this.adjustToTravelSpeed(this.angle, _bulletTravelSpeed);
		this.pos.x += speed.x;
		this.pos.y += speed.y;
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
	
	// Check if bullet is within game screen
	this.isWithinBounds = function() {
		return this.pos.x >= 0 && this.pos.x <= width &&
		       this.pos.y >= 0 && this.pos.y <= height;
	}
}