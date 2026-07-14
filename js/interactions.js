// ============================================
// ECHOSPACE - USER INTERACTIONS
// Mouse: Click, Hover, Right-click
// Keyboard: Space, R, C, H
// ============================================

import * as THREE from 'three';

let hoveredObject = null;
let controlsRef = null;

export function initInteractions(camera, renderer, meshes) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    const clickableMeshes = meshes || [];

    // ===== MOUSE CLICK: Change color =====
    renderer.domElement.addEventListener('click', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(clickableMeshes);
        
        if (intersects.length > 0) {
            const object = intersects[0].object;
            const hue = Math.random();
            const color = new THREE.Color().setHSL(hue, 0.8, 0.5);
            object.material.color.set(color);
            
            object.scale.set(1.2, 1.2, 1.2);
            setTimeout(() => {
                object.scale.set(1, 1, 1);
            }, 200);
            
            console.log(`🖱️ Clicked object!`);
        }
    });

    // ===== MOUSE HOVER: Highlight =====
    renderer.domElement.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(clickableMeshes);
        
        if (intersects.length > 0) {
            const object = intersects[0].object;
            document.body.style.cursor = 'pointer';
            
            if (hoveredObject && hoveredObject !== object) {
                hoveredObject.material.emissive.setHex(0x000000);
                hoveredObject.material.emissiveIntensity = 0;
            }
            
            hoveredObject = object;
            object.material.emissive.setHex(0x444444);
            object.material.emissiveIntensity = 0.3;
            
        } else {
            document.body.style.cursor = 'default';
            if (hoveredObject) {
                hoveredObject.material.emissive.setHex(0x000000);
                hoveredObject.material.emissiveIntensity = 0;
                hoveredObject = null;
            }
        }
    });

    // ===== MOUSE RIGHT-CLICK: Reset color =====
    renderer.domElement.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(clickableMeshes);
        
        if (intersects.length > 0) {
            const object = intersects[0].object;
            object.material.color.setHex(0xcccccc);
            console.log(`↩️ Reset color`);
        }
    });

    // ===== KEYBOARD INTERACTIONS =====
    window.addEventListener('keydown', (event) => {
        switch(event.key) {
            case ' ':
                if (controlsRef) {
                    controlsRef.autoRotate = !controlsRef.autoRotate;
                    console.log(`🔄 Auto-rotate: ${controlsRef.autoRotate ? 'ON' : 'OFF'}`);
                }
                break;
                
            case 'r':
            case 'R':
                camera.position.set(0, 2.5, 10);
                if (controlsRef) {
                    controlsRef.target.set(0, 1.5, 0);
                    controlsRef.update();
                }
                console.log('📷 Camera reset!');
                break;
                
            case 'c':
            case 'C':
                clickableMeshes.forEach(obj => {
                    if (obj.material && obj.material.color) {
                        const hue = Math.random();
                        obj.material.color.setHSL(hue, 0.8, 0.5);
                    }
                });
                console.log('🎨 All colors randomized!');
                break;
                
            case 'h':
            case 'H':
                console.log('============================================');
                console.log('🎮 KEYBOARD CONTROLS:');
                console.log('  SPACE  - Toggle auto-rotate');
                console.log('  R      - Reset camera');
                console.log('  C      - Randomize all colors');
                console.log('  H      - Show this help');
                console.log('============================================');
                console.log('🖱️ MOUSE CONTROLS:');
                console.log('  Click      - Change color');
                console.log('  Hover      - Highlight');
                console.log('  Right-click- Reset color');
                console.log('  Drag       - Rotate camera');
                console.log('  Scroll     - Zoom');
                console.log('============================================');
                break;
        }
    });

    // Store controls reference
    return { 
        setControls: (controls) => { controlsRef = controls; },
        clickableMeshes 
    };
}