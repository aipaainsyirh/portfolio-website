
//  ANIMATIONS

let time = 0;

export function initAnimations(allObjects) {
    // Rotation
    function animateRotation() {
        allObjects.forEach(obj => {
            if (obj.type === 'donut' && obj.mesh) {
                obj.mesh.rotation.y += 0.015;
                obj.mesh.rotation.x += 0.005;
            } else if (obj.type === 'pyramid' && obj.mesh) {
                obj.mesh.rotation.y += 0.01;
            } else if (obj.type === 'cylinder' && obj.mesh) {
                obj.mesh.rotation.y += 0.01;
            } else if (obj.type === 'sphere' && obj.mesh) {
                obj.mesh.rotation.x += 0.005;
                obj.mesh.rotation.y += 0.01;
            } else if (obj.type === 'airplane' && obj.group) {
                obj.group.rotation.y += 0.005;
            } else if (obj.type === 'rubik' && obj.group) {
                obj.group.rotation.y += 0.008;
                obj.group.rotation.x += 0.003;
            } else if (obj.type === 'ring' && obj.mesh) {
                obj.mesh.rotation.y += 0.01;
            } else if (obj.type === 'galaxy') {
                if (obj.stars) obj.stars.rotation.y += 0.00005;
                if (obj.nebula) obj.nebula.rotation.y += 0.00008;
            }
        });
    }

    // Floating
    function animateFloating() {
        time += 0.01;
        
        allObjects.forEach(obj => {
            if (obj.type === 'donut' && obj.mesh) {
                obj.mesh.position.y = 1.5 + Math.sin(time * 0.6 + 0.5) * 0.3;
            } else if (obj.type === 'pyramid' && obj.mesh) {
                obj.mesh.position.y = 1.0 + Math.sin(time * 0.7 + 1) * 0.3;
            } else if (obj.type === 'cylinder' && obj.mesh) {
                obj.mesh.position.y = 1.0 + Math.sin(time * 0.8 + 1.5) * 0.3;
            } else if (obj.type === 'sphere' && obj.mesh) {
                obj.mesh.position.y = 1.2 + Math.sin(time * 0.9 + 2) * 0.3;
            } else if (obj.type === 'airplane' && obj.group) {
                obj.group.position.y = 1.5 + Math.sin(time * 0.5) * 0.3;
            } else if (obj.type === 'rubik' && obj.group) {
                obj.group.position.y = 1.2 + Math.sin(time * 0.7 + 0.5) * 0.3;
            } else if (obj.type === 'ring' && obj.mesh) {
                obj.mesh.position.y = 2.5 + Math.sin(time * 0.4) * 0.2;
            }
        });
    }

    return {
        update: function() {
            animateRotation();
            animateFloating();
        }
    };
}