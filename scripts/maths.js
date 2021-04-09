function doesRayIntersectLineSegment(rayOrigin, rayDirection, a, b) {
    let v1 = p5.Vector.sub(rayOrigin, a);
    let v2 = p5.Vector.sub(b, a);
    let v3 = createVector(-rayDirection.y, rayDirection.x);

    let dot = p5.Vector.dot(v2, v3);
    if (Math.abs(dot) < 0.000001) return false;

    let t1 = p5.Vector.div(p5.Vector.cross(v2, v1), dot);
    let t2 = p5.Vector.dot(v1, v3) / dot;

    if (t1.x >= 0 && t1.y >= 0 && t1.z >= 0 && t2 >= 0 && t2 <= 1) return true;
    return false;
}

function getClosestPointOnLine(a, b, p) {
    let vectorFromAtoP = p5.Vector.sub(p, a);
    let vectorFromAtoB = p5.Vector.sub(b, a);

    let dot = p5.Vector.dot(vectorFromAtoP, vectorFromAtoB);
    let t = dot / vectorFromAtoB.magSq();

    return createVector(a.x + vectorFromAtoB.x * t, a.y + vectorFromAtoB.y * t);
}
