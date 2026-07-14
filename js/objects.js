// ============================================
// ECHOSPACE - 6 DIFFERENT 3D OBJECTS WITH TEXTURES
// ============================================

import * as THREE from 'three';

// Store all objects for interactions
let allObjects = [];
let allMeshes = [];

// ============================================
// TEXTURE GENERATION FUNCTIONS
// ============================================

function createTexture(colors) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    const gradient = ctx.createLinearGradient(0, 0, 512, 512);
    colors.forEach((color, index) => {
        gradient.addColorStop(index / (colors.length - 1), color);
    });
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
    
    for (let i = 0; i < 30; i++) {
        ctx.strokeStyle = `rgba(255,255,255,${Math.random() * 0.2})`;
        ctx.lineWidth = 1 + Math.random() * 3;
        ctx.beginPath();
        ctx.arc(
            256 + (Math.random() - 0.5) * 400,
            256 + (Math.random() - 0.5) * 400,
            10 + Math.random() * 60,
            0, Math.PI * 2
        );
        ctx.stroke();
    }
    
    return new THREE.CanvasTexture(canvas);
}

function createWoodTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#8B6914';
    ctx.fillRect(0, 0, 512, 512);
    
    for (let i = 0; i < 50; i++) {
        ctx.strokeStyle = `rgba(100, 60, 10, ${Math.random() * 0.3 + 0.1})`;
        ctx.lineWidth = Math.random() * 3 + 1;
        ctx.beginPath();
        const y = Math.random() * 512;
        ctx.moveTo(0, y);
        for (let x = 0; x < 512; x += 5) {
            ctx.lineTo(x, y + Math.sin(x * 0.02 + i * 0.5) * 15);
        }
        ctx.stroke();
    }
    
    return new THREE.CanvasTexture(canvas);
}

function createMetalTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    gradient.addColorStop(0, '#e8e8e8');
    gradient.addColorStop(0.3, '#cccccc');
    gradient.addColorStop(0.6, '#999999');
    gradient.addColorStop(1, '#555555');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
    
    for (let i = 0; i < 100; i++) {
        ctx.strokeStyle = `rgba(200, 200, 200, ${Math.random() * 0.15})`;
        ctx.lineWidth = Math.random() * 1.5 + 0.5;
        ctx.beginPath();
        const startX = Math.random() * 512;
        const startY = Math.random() * 512;
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX + (Math.random() - 0.5) * 50, startY + (Math.random() - 0.5) * 50);
        ctx.stroke();
    }
    
    return new THREE.CanvasTexture(canvas);
}

function createRubikTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF8C00', '#FFFFFF'];
    const size = 512 / 3;
    
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            ctx.fillStyle = colors[(row * 3 + col) % colors.length];
            ctx.fillRect(col * size, row * size, size - 2, size - 2);
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.strokeRect(col * size, row * size, size - 2, size - 2);
        }
    }
    
    return new THREE.CanvasTexture(canvas);
}

// ============================================
// GALAXY BACKGROUND
// ============================================

function createGalaxyBackground(scene) {
    const starGeometry = new THREE.BufferGeometry();
    const count = 25000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        const radius = 50 + Math.random() * 50;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        const colorChoice = Math.random();
        let color;
        if (colorChoice < 0.6) color = new THREE.Color(0xffffff);
        else if (colorChoice < 0.8) color = new THREE.Color(0x88ccff);
        else if (colorChoice < 0.92) color = new THREE.Color(0xffdd88);
        else color = new THREE.Color(0xff8844);

        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMaterial = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        depthWrite: false
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    
    // Nebula
    const nebulaGeometry = new THREE.BufferGeometry();
    const nebulaCount = 8000;
    const nebulaPos = new Float32Array(nebulaCount * 3);
    const nebulaColors = new Float32Array(nebulaCount * 3);

    for (let i = 0; i < nebulaCount; i++) {
        const radius = 30 + Math.random() * 40;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);

        nebulaPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        nebulaPos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        nebulaPos[i * 3 + 2] = radius * Math.cos(phi);

        const hue = 0.7 + Math.random() * 0.25;
        const color = new THREE.Color().setHSL(hue, 0.8, 0.15 + Math.random() * 0.2);
        nebulaColors[i * 3] = color.r;
        nebulaColors[i * 3 + 1] = color.g;
        nebulaColors[i * 3 + 2] = color.b;
    }

    nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(nebulaPos, 3));
    nebulaGeometry.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));

    const nebulaMaterial = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        depthWrite: false
    });

    const nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
    scene.add(nebula);
    
    allObjects.push({ type: 'galaxy', stars, nebula });
}

// ============================================
// OBJECT 1: AIRPLANE
// ============================================

function createAirplane(scene) {
    const group = new THREE.Group();

    // Fuselage
    const fuselageGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.8, 8);
    const fuselageMat = new THREE.MeshPhysicalMaterial({
        map: createMetalTexture(),
        metalness: 0.6,
        roughness: 0.3
    });
    const fuselage = new THREE.Mesh(fuselageGeo, fuselageMat);
    fuselage.rotation.x = Math.PI / 2;
    fuselage.position.z = 0.2;
    group.add(fuselage);
    allMeshes.push(fuselage);

    // Wings
    const wingGeo = new THREE.BoxGeometry(1.6, 0.05, 0.5);
    const wingMat = new THREE.MeshPhysicalMaterial({
        map: createTexture(['#3498db', '#2ecc71']),
        metalness: 0.3,
        roughness: 0.4
    });
    const wing = new THREE.Mesh(wingGeo, wingMat);
    wing.position.y = 0;
    wing.position.z = 0.1;
    group.add(wing);
    allMeshes.push(wing);

    // Tail
    const tailGeo = new THREE.BoxGeometry(0.4, 0.3, 0.2);
    const tailMat = new THREE.MeshPhysicalMaterial({
        map: createTexture(['#e74c3c', '#f1c40f']),
        metalness: 0.3,
        roughness: 0.4
    });
    const tail = new THREE.Mesh(tailGeo, tailMat);
    tail.position.set(0, 0.2, -0.8);
    group.add(tail);
    allMeshes.push(tail);

    // Wing tips
    const tipGeo = new THREE.BoxGeometry(0.4, 0.2, 0.1);
    const tipMat = new THREE.MeshPhysicalMaterial({
        map: createTexture(['#ff6b6b', '#ffd93d']),
        metalness: 0.3,
        roughness: 0.4
    });
    const tip1 = new THREE.Mesh(tipGeo, tipMat);
    tip1.position.set(-0.9, 0.1, 0.1);
    group.add(tip1);
    allMeshes.push(tip1);
    
    const tip2 = new THREE.Mesh(tipGeo, tipMat);
    tip2.position.set(0.9, 0.1, 0.1);
    group.add(tip2);
    allMeshes.push(tip2);

    group.position.set(-5, 1.5, -2);
    group.scale.set(0.6, 0.6, 0.6);
    group.rotation.y = 0.3;
    scene.add(group);
    
    allObjects.push({ type: 'airplane', group });
}

// ============================================
// OBJECT 2: RUBIK'S CUBE
// ============================================

function createRubiksCube(scene) {
    const group = new THREE.Group();
    const cubeSize = 0.28;
    const spacing = 0.3;

    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            for (let z = -1; z <= 1; z++) {
                const miniCubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
                const miniCubeMat = new THREE.MeshPhysicalMaterial({
                    map: createRubikTexture(),
                    metalness: 0.3,
                    roughness: 0.2
                });
                const miniCube = new THREE.Mesh(miniCubeGeo, miniCubeMat);
                miniCube.position.set(x * spacing, y * spacing, z * spacing);
                group.add(miniCube);
                allMeshes.push(miniCube);
            }
        }
    }

    group.position.set(-3.5, 1.2, -1);
    group.scale.set(0.7, 0.7, 0.7);
    scene.add(group);
    
    allObjects.push({ type: 'rubik', group });
}

// ============================================
// OBJECT 3: DONUT
// ============================================

function createDonut(scene) {
    const geo = new THREE.TorusGeometry(0.8, 0.3, 16, 100);
    const mat = new THREE.MeshPhysicalMaterial({
        map: createTexture(['#e74c3c', '#f39c12', '#f1c40f', '#2ecc71']),
        metalness: 0.2,
        roughness: 0.3,
        clearcoat: 0.5
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(-6.5, 1.5, 1);
    mesh.rotation.x = Math.PI / 3;
    mesh.rotation.z = 0.5;
    mesh.castShadow = true;
    mesh.userData = { name: 'Donut', type: 'torus' };
    scene.add(mesh);
    allMeshes.push(mesh);
    allObjects.push({ type: 'donut', mesh });
}

// ============================================
// OBJECT 4: PYRAMID
// ============================================

function createPyramid(scene) {
    const geo = new THREE.ConeGeometry(0.8, 1.2, 4);
    const mat = new THREE.MeshPhysicalMaterial({
        map: createWoodTexture(),
        metalness: 0.1,
        roughness: 0.7
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(3.5, 1.0, -1);
    mesh.rotation.y = 0.5;
    mesh.castShadow = true;
    mesh.userData = { name: 'Pyramid', type: 'pyramid' };
    scene.add(mesh);
    allMeshes.push(mesh);
    allObjects.push({ type: 'pyramid', mesh });
}

// ============================================
// OBJECT 5: CYLINDER
// ============================================

function createCylinder(scene) {
    const geo = new THREE.CylinderGeometry(0.6, 0.6, 1.2, 32);
    const mat = new THREE.MeshPhysicalMaterial({
        map: createMetalTexture(),
        metalness: 0.7,
        roughness: 0.2
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(5.5, 1.0, -2);
    mesh.rotation.x = 0.2;
    mesh.castShadow = true;
    mesh.userData = { name: 'Cylinder', type: 'cylinder' };
    scene.add(mesh);
    allMeshes.push(mesh);
    allObjects.push({ type: 'cylinder', mesh });
}

// ============================================
// OBJECT 6: SPHERE
// ============================================

function createSphere(scene) {
    const geo = new THREE.SphereGeometry(0.6, 32, 32);
    const mat = new THREE.MeshPhysicalMaterial({
        map: createTexture(['#9b59b6', '#3498db', '#2ecc71']),
        metalness: 0.4,
        roughness: 0.2,
        clearcoat: 0.3
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(6.5, 1.2, 1);
    mesh.castShadow = true;
    mesh.userData = { name: 'Sphere', type: 'sphere' };
    scene.add(mesh);
    allMeshes.push(mesh);
    allObjects.push({ type: 'sphere', mesh });
}

// ============================================
// DECORATIVE RING
// ============================================

function createDecorativeRing(scene) {
    const geo = new THREE.TorusGeometry(0.9, 0.08, 16, 100);
    const mat = new THREE.MeshPhysicalMaterial({
        map: createTexture(['#e74c3c', '#f1c40f', '#2ecc71']),
        metalness: 0.8,
        roughness: 0.1,
        transparent: true,
        opacity: 0.6
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(0, 2.5, 0);
    mesh.rotation.x = Math.PI / 2;
    mesh.rotation.z = 0.3;
    scene.add(mesh);
    allObjects.push({ type: 'ring', mesh });
}

// ============================================
// EXPORT
// ============================================

export function createAllObjects(scene) {
    allObjects = [];
    allMeshes = [];
    
    createGalaxyBackground(scene);
    createAirplane(scene);
    createRubiksCube(scene);
    createDonut(scene);
    createPyramid(scene);
    createCylinder(scene);
    createSphere(scene);
    createDecorativeRing(scene);
    
    return { allObjects, allMeshes };
}

export function getAllObjects() { return allObjects; }
export function getAllMeshes() { return allMeshes; }