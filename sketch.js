let points = [];
let springs = [];
let poly1, poly2, poly3, poly4, poly5;

let lastFrame;

let columns = 10,
    rows = 15;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);

    console.log(height / 50);
    for (let i = 0; i < columns; i++) {
        points[i] = [];
        for (let j = 0; j < rows; j++) {
            points[i][j] = new Point(createVector(i * (height / 50) + (width / 20) * 2, j * (height / 50) - (width / 20) * 4));
        }
    }

    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < columns - 1; i++) {
            springs.push(new Spring(points[i][j], points[i + 1][j], height / 50));
        }
    }

    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows - 1; j++) {
            springs.push(new Spring(points[i][j], points[i][j + 1], height / 50));
        }
    }

    for (let i = 0; i < columns - 1; i++) {
        for (let j = 0; j < rows - 1; j++) {
            springs.push(new Spring(points[i][j], points[i + 1][j + 1], Math.sqrt((height / 50) ** 2 * 2)));
        }
    }
    console.log(Math.sqrt((height / 50) ** 2 * 2));

    for (let i = columns - 1; i >= 1; i--) {
        for (let j = 0; j < rows - 1; j++) {
            springs.push(new Spring(points[i][j], points[i - 1][j + 1], Math.sqrt((height / 50) ** 2 * 2)));
        }
    }

    poly1 = new Polygon();
    poly1.addVertex(width / 20, (height / 10) * 9);
    poly1.addVertex(width - width / 20, (height / 10) * 9);
    poly1.addVertex(width - width / 20, height);
    poly1.addVertex(width / 20, height);
    poly1.calculateAABB();

    poly2 = new Polygon();
    poly2.addVertex(width / 20, height / 10);
    poly2.addVertex((width / 20) * 5, (height / 10) * 3);
    poly2.addVertex(width / 20, (height / 10) * 3);
    poly2.calculateAABB();

    poly3 = new Polygon();
    poly3.addVertex((width / 20) * 12, (height / 10) * 4);
    poly3.addVertex((width / 20) * 12, (height / 10) * 6);
    poly3.addVertex((width / 20) * 9, (height / 10) * 6);
    poly3.calculateAABB();

    poly4 = new Polygon();
    poly4.addVertex(width / 20, (height / 10) * 9);
    poly4.addVertex((width / 20) * 2, (height / 10) * 9);
    poly4.addVertex((width / 20) * 2, (height / 10) * 5);
    poly4.addVertex(width / 20, (height / 10) * 5);
    poly4.calculateAABB();

    poly5 = new Polygon();
    poly5.addVertex((width / 20) * 18, (height / 10) * 9);
    poly5.addVertex((width / 20) * 19, (height / 10) * 9);
    poly5.addVertex((width / 20) * 19, (height / 10) * 5);
    poly5.addVertex((width / 20) * 18, (height / 10) * 5);
    poly5.calculateAABB();

    lastFrame = millis();

    // a = new Point(createVector(200, 100));
    // b = new Point(createVector(200, 200));
    // spring = new Spring(a, b, 20);
}

function draw() {
    background(20);

    let now = millis();
    // let dt = now - lastFrame;
    let steps = 5;
    let dt = 1000 / (40 * steps);
    lastFrame = now;

    for (let k = 0; k < steps; k++) {
        for (let spring of springs) {
            spring.applyForce();
        }

        for (let row of points) {
            for (let p of row) {
                if (p.isBeingDragged) p.applyForce(p5.Vector.sub(createVector(mouseX, mouseY), p.pos).add(p.dragOffsetVector).mult(0.1));
                p.update(dt);
            }
        }
        for (let i = 0; i < points.length; i++) {
            for (let j = 0; j < points[i].length; j++) {
                points[i][j].selfCollide(points, i, j);
            }
        }

        for (let row of points) {
            for (let p of row) p.collide([poly1, poly2, poly3, poly4, poly5]);
        }
    }

    for (let spring of springs) spring.render();

    for (let row of points) {
        for (let p of row) p.render();
    }

    poly1.render();
    poly2.render();
    poly3.render();
    poly4.render();
    poly5.render();
}

function mousePressed() {
    for (let row of points) {
        for (let p of row) {
            let difference = p5.Vector.sub(p.pos, createVector(mouseX, mouseY));
            if (difference.magSq() <= ((width / 20) * 2) ** 2) {
                p.isBeingDragged = true;
                p.dragOffsetVector = difference;
            }
        }
    }
}

function mouseReleased() {
    console.log("YES");
    for (let row of points) {
        for (let p of row) {
            p.isBeingDragged = false;
        }
    }
}
