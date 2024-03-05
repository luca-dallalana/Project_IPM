// Target class (position and width)
class Target {
    constructor(x, y, w, l, id) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.label = l;
        this.id = id;
    }

    // Checks if a mouse click took place
    // within the target
    clicked(mouse_x, mouse_y) {
        return dist(this.x, this.y, mouse_x, mouse_y) < this.width / 2;
    }

    // Draws the target (i.e., a circle)
    // and its label
    draw() {
        // Draw target
        fill(color(50, 50, 50));
        circle(this.x, this.y, this.width);

        // Draw label
        textFont("Arial", 11);
        textStyle(BOLD);
        fill(color(255, 255, 0));
        textAlign(CENTER);
        text(this.label, this.x, this.y);
        textStyle(NORMAL);
    }
}

class ClusterBorder {
    constructor(x, y, w, h, prefix, textX, textY) {
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
        stroke(255); // Set stroke color to white
        strokeWeight(2); // Set stroke weight to 2
        noFill();    // Make the rectangle transparent
        rect(this.x, this.y, this.width, this.height);
    
        // Draw the cluster prefix in the lower right corner of the rectangle
        fill(255);             // Set fill color to black for the text
        textFont("Arial", 24); // Set the font and size of the text
        textAlign(CENTER, CENTER); // Center the text
        noStroke();            // Remove stroke for the text
        text(this.prefix, this.textX, this.textY);
        console.log(this);
    }
}
