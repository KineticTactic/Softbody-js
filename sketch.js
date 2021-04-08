let points = [];
let springs = [];
let poly1, poly2, poly3, poly4, poly5;

let lastFrame;

let columns = 10,
    rows = 15;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);

    for (let i = 0; i < columns; i++) {
        points[i] = [];
        for (let j = 0; j < rows; j++) {
            points[i][j] = new Point(createVector(i * 20 + 200, j * 20 - 400));
        }
    }

    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < columns - 1; i++) {
            springs.push(new Spring(points[i][j], points[i + 1][j], 20));
        }
    }

    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows - 1; j++) {
            springs.push(new Spring(points[i][j], points[i][j + 1], 20));
        }
    }

    for (let i = 0; i < columns - 1; i++) {
        for (let j = 0; j < rows - 1; j++) {
            springs.push(new Spring(points[i][j], points[i + 1][j + 1], Math.sqrt(800)));
        }
    }

    for (let i = columns - 1; i >= 1; i--) {
        for (let j = 0; j < rows - 1; j++) {
            springs.push(new Spring(points[i][j], points[i - 1][j + 1], Math.sqrt(800)));
        }
    }

    poly1 = new Polygon();
    poly1.addVertex(100, 800);
    poly1.addVertex(1900, 800);
    poly1.addVertex(1900, 900);
    poly1.addVertex(100, 900);
    poly1.calculateAABB();

    poly2 = new Polygon();
    poly2.addVertex(100, 100);
    poly2.addVertex(500, 300);
    poly2.addVertex(100, 300);
    poly2.calculateAABB();

    poly3 = new Polygon();
    poly3.addVertex(1200, 400);
    poly3.addVertex(1200, 600);
    poly3.addVertex(900, 600);
    poly3.calculateAABB();

    poly4 = new Polygon();
    poly4.addVertex(100, 800);
    poly4.addVertex(300, 800);
    poly4.addVertex(300, 500);
    poly4.addVertex(100, 500);
    poly4.calculateAABB();

    poly5 = new Polygon();
    poly5.addVertex(1800, 800);
    poly5.addVertex(1900, 800);
    poly5.addVertex(1900, 500);
    poly5.addVertex(1800, 500);
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
            if (difference.magSq() <= 200 * 200) {
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
