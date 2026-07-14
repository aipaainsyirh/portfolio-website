// ============================================
// ECHOSPACE - LIGHTING (2 techniques)
// ============================================

import * as THREE from 'three';

export function initLighting(scene) {
    // Technique 1: Ambient Light
    const ambientLight = new THREE.AmbientLight(0x404060, 0.5);
    scene.add(ambientLight);
    
    // Technique 2: Directional Light with Shadows
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    // Fill light
    const fillLight = new THREE.DirectionalLight(0x3498db, 0.3);
    fillLight.position.set(-5, 0, 5);
    scene.add(fillLight);
    
    console.log('💡 Lighting: Ambient + Directional');
    
    return { ambientLight, directionalLight, fillLight };
}