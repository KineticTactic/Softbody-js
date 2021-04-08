class Spring {
    constructor(a, b, restLength) {
        this.a = a;
        this.b = b;
        this.stiffness = 40;
        this.restLength = restLength;
        this.damping = 0.5;
    }

    applyForce() {
        let vectorFromAtoB = p5.Vector.sub(this.b.pos, this.a.pos);
        let deltaDistance = Math.abs(vectorFromAtoB.mag()) - this.restLength;
        let springForceMag = deltaDistance * this.stiffness;

        let normalizedDirectionVector = vectorFromAtoB.normalize();
        let velocityDifference = p5.Vector.sub(this.b.vel, this.a.vel);
        let dampingForceMag = p5.Vector.dot(normalizedDirectionVector, velocityDifference) * this.damping;

        let totalForceMag = springForceMag + dampingForceMag;
        let force = normalizedDirectionVector.mult(totalForceMag);
        this.a.applyForce(force);
        this.b.applyForce(force.mult(-1));
    }

    render() {
        stroke(255, 255, 0);
        strokeWeight(2);
        line(this.a.pos.x, this.a.pos.y, this.b.pos.x, this.b.pos.y);
    }
}
