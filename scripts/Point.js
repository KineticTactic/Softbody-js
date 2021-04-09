class Point {
    constructor(pos) {
        this.pos = pos;
        this.vel = createVector();
        this.force = createVector();
        this.mass = 1;
        this.collidedWith = [];
        this.isBeingDragged = false;
        this.dragOffsetVector = createVector();
        this.radius = height / 200 + 1;
    }

    collide(polygons) {
        for (let poly of polygons) {
            // Check AABB
            if (this.pos.x > poly.min.x && this.pos.y > poly.min.y && this.pos.x < poly.max.x && this.pos.y < poly.max.y) {
                let edgesIntersecting = 0;
                let closestPointsOnEdges = [];
                for (let i = 0; i < poly.vertices.length; i++) {
                    let a = poly.vertices[i];
                    let b = poly.vertices[(i + 1) % poly.vertices.length];
                    if (doesRayIntersectLineSegment(this.pos, createVector(1, 1), a, b)) edgesIntersecting++;
                    closestPointsOnEdges.push(getClosestPointOnLine(a, b, this.pos));
                }
                if (edgesIntersecting % 2 !== 0) {
                    // Colliding
                    let closestEdgeDistance = Infinity;
                    let closestPointOnEdge;
                    for (let i = 0; i < closestPointsOnEdges.length; i++) {
                        let distanceToEdge = p5.Vector.sub(closestPointsOnEdges[i], this.pos).mag();
                        if (distanceToEdge <= closestEdgeDistance) {
                            closestEdgeDistance = distanceToEdge;
                            closestPointOnEdge = closestPointsOnEdges[i];
                        }
                    }
                    let normalVector = p5.Vector.sub(closestPointOnEdge, this.pos).normalize();
                    this.pos = closestPointOnEdge;
                    this.vel = p5.Vector.sub(this.vel, p5.Vector.mult(normalVector, 2 * p5.Vector.dot(this.vel, normalVector)));

                    stroke(255, 0, 0);
                    strokeWeight(10);
                    point(closestPointOnEdge);
                }
            }
        }
    }

    selfCollide(points, indexI, indexJ) {
        for (let i = 0; i < points.length; i++) {
            for (let j = 0; j < points[i].length; j++) {
                if (i !== indexI || j !== indexJ || !this.collidedWith.includes([i, j])) {
                    let other = points[i][j];
                    let differenceVector = p5.Vector.sub(this.pos, other.pos);
                    let distance = differenceVector.mag();
                    if (distance < this.radius * 2 && distance !== 0) {
                        let penetrationDepth = this.radius * 2 - distance;
                        let normalVector = p5.Vector.normalize(differenceVector);

                        this.pos = p5.Vector.add(this.pos, p5.Vector.mult(normalVector, penetrationDepth));
                        other.pos = p5.Vector.add(other.pos, p5.Vector.mult(p5.Vector.mult(normalVector, -1), penetrationDepth));

                        this.vel = p5.Vector.sub(this.vel, p5.Vector.mult(normalVector, 2 * p5.Vector.dot(this.vel, normalVector)));
                        other.vel = p5.Vector.sub(other.vel, p5.Vector.mult(normalVector, 2 * p5.Vector.dot(other.vel, normalVector)));

                        this.collidedWith.push([i, j]);
                        other.collidedWith.push([indexI, indexJ]);
                    }
                }
            }
        }
    }

    applyForce(f) {
        this.force.add(f);
    }

    update(dt) {
        this.force.add(createVector(0, 1).mult(this.mass)); // Gravity
        this.force.mult(dt / 100).div(this.mass);
        this.vel.add(this.force);
        this.vel.limit(80);
        this.pos.add(p5.Vector.mult(this.vel, dt / 100));
        this.force.mult(0);
    }

    render() {
        stroke(255);
        strokeWeight(this.radius * 2);
        point(this.pos.x, this.pos.y);

        if (this.isBeingDragged) {
            stroke(255, 0, 0, 100);
            strokeWeight(1);
            line(this.pos.x, this.pos.y, mouseX + this.dragOffsetVector.x, mouseY + this.dragOffsetVector.y);
        }
    }
}
