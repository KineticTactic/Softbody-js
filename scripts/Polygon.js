class Polygon {
    constructor() {
        this.vertices = [];
        this.min = createVector();
        this.max = createVector();
    }

    calculateAABB() {
        let xs = [];
        let ys = [];
        for (let v of this.vertices) {
            xs.push(v.x);
            ys.push(v.y);
        }
        this.min = createVector(Math.min(...xs), Math.min(...ys));
        this.max = createVector(Math.max(...xs), Math.max(...ys));
    }

    addVertex(x, y) {
        this.vertices.push(createVector(x, y));
    }

    render() {
        stroke(255);
        strokeWeight(2);
        for (let i = 0; i < this.vertices.length; i++) {
            let nextIndex = (i + 1) % this.vertices.length;
            line(this.vertices[i].x, this.vertices[i].y, this.vertices[nextIndex].x, this.vertices[nextIndex].y);
        }
    }
}
