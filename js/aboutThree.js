import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Team members data matched with shapes
const memberData = [
    {
        index: 0,
        name: 'Ismail Bin Esa',
        role: 'Lead Developer',
        shape: 'cube',
        color: 0x5b8def, // Blue
        detailsId: 'member-details-0'
    },
    {
        index: 1,
        name: 'Izz Haeil bin Hamishamsul',
        role: 'UI/UX Designer & Developer',
        shape: 'torusKnot',
        color: 0x2ecc71, // Green
        detailsId: 'member-details-1'
    },
    {
        index: 2,
        name: 'Mohamad Zakwan Zuhairie',
        role: 'Full Stack Developer',
        shape: 'dodecahedron',
        color: 0xe74c3c, // Red
        detailsId: 'member-details-2'
    },
    {
        index: 3,
        name: 'Nur Aifa Insyirah',
        role: 'Developer & Researcher',
        shape: 'cone',
        color: 0xf1c40f, // Gold
        detailsId: 'member-details-3'
    }
];

let scene, camera, renderer, controls;
let objects = [];
let coreMesh;
let activeIndex = 0;
let isTransitioning = false;
let targetCameraPos = new THREE.Vector3();
let targetLookAt = new THREE.Vector3(0, 0, 0);
let currentLookAt = new THREE.Vector3(0, 0, 0);

// Generate procedural texture for central core
function createCoreTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Cyberpunk grid/circuit background
    ctx.fillStyle = '#0f0f38';
    ctx.fillRect(0, 0, 512, 512);

    // Glowing lines
    ctx.strokeStyle = '#00ffcc';
    ctx.lineWidth = 4;
    for (let i = 0; i < 8; i++) {
        const x = 64 * i + 32;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 512);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, x);
        ctx.lineTo(512, x);
        ctx.stroke();
    }

    // Dots/connections
    ctx.fillStyle = '#ff0077';
    for (let i = 0; i < 30; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * 512, Math.random() * 512, 8 + Math.random() * 8, 0, Math.PI * 2);
        ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

export function initAboutThreeJS() {
    const container = document.getElementById('about-3d-container');
    if (!container) return;

    // 1. Scene Setup
    scene = new THREE.Scene();
    
    // Camera
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 5, 12);
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 1.8; // Don't go too far below
    controls.minDistance = 3;
    controls.maxDistance = 15;
    controls.enablePan = false;

    // 2. Lighting Techniques
    // Tech 1: Ambient Light (General Fill)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Tech 2: Directional Spotlight/PointLight with Shadows (Key light)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Glowing PointLight inside the Core
    const coreLight = new THREE.PointLight(0x00ffcc, 2.5, 12);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // 3. 5 Three.js Objects (1 Central Core + 4 Team Members)
    
    // Core Object (Textured)
    const coreGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const coreMat = new THREE.MeshPhysicalMaterial({
        map: createCoreTexture(),
        emissive: 0x005544,
        roughness: 0.1,
        metalness: 0.8,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });
    coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.set(0, 0, 0);
    coreMesh.castShadow = true;
    coreMesh.receiveShadow = true;
    scene.add(coreMesh);

    // 4 Member Objects orbiting the core
    const orbitalRadius = 3.5;
    memberData.forEach((member, i) => {
        let geo;
        switch (member.shape) {
            case 'cube':
                geo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
                break;
            case 'torusKnot':
                geo = new THREE.TorusKnotGeometry(0.35, 0.12, 64, 8);
                break;
            case 'dodecahedron':
                geo = new THREE.DodecahedronGeometry(0.5);
                break;
            case 'cone':
                geo = new THREE.ConeGeometry(0.5, 0.9, 4);
                break;
            default:
                geo = new THREE.SphereGeometry(0.5, 16, 16);
        }

        const color = new THREE.Color(member.color);
        const mat = new THREE.MeshPhysicalMaterial({
            color: color,
            emissive: color.clone().multiplyScalar(0.2),
            roughness: 0.2,
            metalness: 0.6,
            clearcoat: 0.5
        });

        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Position spaced evenly around orbital ring
        const angle = (i / memberData.length) * Math.PI * 2;
        mesh.position.set(Math.cos(angle) * orbitalRadius, 0, Math.sin(angle) * orbitalRadius);

        // Store reference data
        mesh.userData = {
            memberIndex: member.index,
            originalAngle: angle,
            originalColor: color.clone(),
            originalScale: 1.0
        };

        scene.add(mesh);
        objects.push(mesh);
    });

    // Background particle dust
    const starsGeo = new THREE.BufferGeometry();
    const starsCount = 200;
    const starsPos = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount; i++) {
        starsPos[i * 3] = (Math.random() - 0.5) * 20;
        starsPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
        starsPos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    const starsMat = new THREE.PointsMaterial({
        color: 0x88ccff,
        size: 0.08,
        transparent: true,
        opacity: 0.6
    });
    const starField = new THREE.Points(starsGeo, starsMat);
    scene.add(starField);

    // 4. Mouse Interactions
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredMesh = null;

    container.addEventListener('mousemove', (event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(objects);

        if (intersects.length > 0) {
            const hitMesh = intersects[0].object;
            container.style.cursor = 'pointer';

            if (hoveredMesh !== hitMesh) {
                if (hoveredMesh) {
                    hoveredMesh.material.emissive.set(hoveredMesh.userData.originalColor.clone().multiplyScalar(0.2));
                    hoveredMesh.scale.setScalar(1.0);
                }
                hoveredMesh = hitMesh;
                hoveredMesh.material.emissive.set(hoveredMesh.userData.originalColor.clone().multiplyScalar(0.8));
                hoveredMesh.scale.setScalar(1.2);
            }
        } else {
            container.style.cursor = 'default';
            if (hoveredMesh) {
                hoveredMesh.material.emissive.set(hoveredMesh.userData.originalColor.clone().multiplyScalar(0.2));
                hoveredMesh.scale.setScalar(1.0);
                hoveredMesh = null;
            }
        }
    });

    container.addEventListener('click', (event) => {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(objects);

        if (intersects.length > 0) {
            const clickedMesh = intersects[0].object;
            selectMember(clickedMesh.userData.memberIndex);
        }
    });

    // 5. Keyboard Navigation
    window.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
            selectMember((activeIndex + 1) % memberData.length);
        } else if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
            selectMember((activeIndex - 1 + memberData.length) % memberData.length);
        }
    });

    // Initial select
    selectMember(0);

    // Animation variables
    let time = 0;

    // Loop
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        // Animations:
        // 1. Rotation of the central core and all orbit shapes
        if (coreMesh) {
            coreMesh.rotation.y += 0.005;
            coreMesh.rotation.x += 0.002;
        }

        objects.forEach((obj, idx) => {
            // Self rotation
            obj.rotation.x += 0.01;
            obj.rotation.y += 0.015;

            // 2. Sinusoidal Floating & Orbital Position Math
            const baseAngle = obj.userData.originalAngle;
            // Let the orbit revolve slowly over time
            const speed = 0.15;
            const currentAngle = baseAngle + time * speed;
            
            // Orbiting positions
            const targetX = Math.cos(currentAngle) * orbitalRadius;
            const targetZ = Math.sin(currentAngle) * orbitalRadius;
            const floatY = Math.sin(time * 2 + idx) * 0.25; // Floating animation

            obj.position.set(targetX, floatY, targetZ);
        });

        // Smooth Camera Transition (Camera Movement Navigation)
        if (isTransitioning) {
            camera.position.lerp(targetCameraPos, 0.05);
            currentLookAt.lerp(targetLookAt, 0.05);
            controls.target.copy(currentLookAt);

            if (camera.position.distanceTo(targetCameraPos) < 0.05) {
                isTransitioning = false;
            }
        }

        controls.update();
        renderer.render(scene, camera);
    }

    animate();

    // Resize Handler
    function handleResize() {
        if (!container || !renderer || !camera) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', handleResize);
}

// Select a member and update UI + camera focus
export function selectMember(index) {
    activeIndex = index;

    // Update active details panel in HTML
    memberData.forEach(member => {
        const details = document.getElementById(member.detailsId);
        const card = document.getElementById(`member-card-${member.index}`);
        if (details) {
            if (member.index === index) {
                details.classList.add('active');
            } else {
                details.classList.remove('active');
            }
        }
        if (card) {
            if (member.index === index) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        }
    });

    // Camera target positioning based on selected object
    const selectedObj = objects[index];
    if (selectedObj) {
        // Calculate offset position for camera focus
        const objPos = selectedObj.position.clone();
        
        // Target is looking at the selected object
        targetLookAt.copy(objPos);
        
        // Position camera behind and slightly above the selected object, looking back towards center
        const cameraOffset = objPos.clone().normalize().multiplyScalar(6.5);
        cameraOffset.y += 2.5; // Height offset
        
        targetCameraPos.copy(cameraOffset);
        isTransitioning = true;

        // Visual pulse effect on selected mesh
        selectedObj.scale.set(1.5, 1.5, 1.5);
        setTimeout(() => {
            selectedObj.scale.set(1, 1, 1);
        }, 300);
    }
}
