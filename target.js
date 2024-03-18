// Target class (position and width)
class Target {
	constructor(x, y, textX, textY, w, l, id) {
		this.x = x;
		this.y = y;
		this.TextX = textX;
		this.textY = textY;
		this.width = w;
		this.label = l;
		this.id = id;
		this.selected = false;
	}

	// Checks if a mouse click took place
	// within the target
	clicked(mouse_x, mouse_y) {
		return (mouse_x > this.x && mouse_x < this.x + this.width && mouse_y > this.y && mouse_y < this.y + this.width)
	}

	// Draws the target (i.e., a circle) and its label
	draw() {
		// Draw a green border around the target if it is selected
		if (this.selected)
			stroke(255, 255, 0);
		else
			stroke(0);
		// Draw target
		fill(color(47, 47, 79));
		rect(this.x, this.y, this.width, this.width);

		// Draw label
		textFont("Arial", 13);
		textStyle(BOLD);
		stroke(0, 0, 0, 0);
		textAlign(LEFT);

		// fill(color(255, 255, 0));
		// text(this.label[1], this.TextX, this.textY);

		let wordLength = textWidth(this.label);
		let textGap = (this.width - wordLength) / 2;
		let currentLabelX = this.x + textGap;

		// Draw the "B" letter in white,
		fill(color(255, 255, 255));
		text(this.label[0], currentLabelX, this.textY);
		currentLabelX += textWidth(this.label[0]);

		// Draw the second and third letters in yellow
		fill(color(255, 255, 255));
		text(this.label[1], currentLabelX, this.textY);
		currentLabelX += textWidth(this.label[1]);
		text(this.label[2], currentLabelX, this.textY);
		currentLabelX += textWidth(this.label[2]);

		// Draw the remaining letters in white
		fill(color(255, 255, 0));
		let remainingText = this.label.substring(3);
		text(remainingText, currentLabelX, this.textY);

		textStyle(NORMAL);
	}
}

class ClusterBorder {
	constructor(x, y, textX, textY, w, h, prefix) {
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
		this.prefix = prefix;
		this.textX = textX;
		this.textY = textY;
	}

	draw() {
		// Draw a transparent rectangle with a white outline around the cluster
		stroke(255);	 // Set stroke color to white
		strokeWeight(2); // Set stroke weight to 2
		noFill();		 // Make the rectangle transparent
		rect(this.x, this.y, this.width, this.height);

		// Draw the cluster prefix on top of the rectangle
		fill(255);			   // Set fill color to black for the text
		textFont("Arial", 24); // Set the font and size of the text
		fill(color(47, 79, 79))
		textAlign(CENTER, CENTER); // Center the text
		noStroke();				   // Remove stroke for the text
		text(this.prefix, this.textX, this.textY);
	}
}
