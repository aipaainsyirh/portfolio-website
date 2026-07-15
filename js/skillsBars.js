import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Skill data: 5 skills per member (4 members = 20 skills)
const skillData = [
    // Member 1: Ismail Bin Esa
    { member: 'Ismail', skills: [
        { name: 'Flutter', level: 8 },
        { name: 'Web Development', level: 9 },
        { name: 'Computer Vision', level: 7 },
        { name: 'OpenGL', level: 8 },
        { name: 'Firebase', level: 7 }
    ]},
    // Member 2: Izz Haeil
    { member: 'Izz Haeil', skills: [
        { name: 'UI/UX Design', level: 9 },
        { name: 'Frontend Dev', level: 8 },
        { name: 'Unity', level: 7 },
        { name: 'MediaPipe', level: 8 },
        { name: 'Python', level: 7 }
    ]},
    // Member 3: Zakwan
    { member: 'Zakwan', skills: [
        { name: 'Unity/VR', level: 8 },
        { name: 'C#', level: 8 },
        { name: 'OpenGL', level: 7 },
        { name: 'PHP', level: 7 },
        { name: 'MySQL', level: 8 }
    ]},
    // Member 4: Aifa
    { member: 'Aifa', skills: [
        { name: 'UI/UX Design', level: 8 },
        { name: 'Frontend Dev', level: 7 },
        { name: 'Python', level: 7 },
        { name: 'OpenCV', level: 7 },
        { name: 'TensorFlow', level: 6 }
    ]}
];

// Colors for members
const memberColors = [
    0x5b8def, // blue
    0x2ecc71, // green
    0xe74c3c, // red
    0xf1c40f  // gold
];

// Shape types for variety
const shapeTypes = ['sphere', 'octahedron', 'dodecahedron', 'torus', 'cone'];

let hoveredObject = null;

// Create colorful background particles for skills section
function createBackgroundParticles(scene) {
    const count = 500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
        const radius = 8 + Math.random() * 15;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.3;
        positions[i * 3 + 2] = radius * Math.cos(phi);

        const color = new THREE.Color().setHSL(0.6 + Math.random() * 0.3, 0.6, 0.3 + Math.random() * 0.3);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
        
        sizes[i] = 0.02 + Math.random() * 0.06;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    return particles;
}

export function createSkillsBars(container) {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a2e);
    
    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 50);
    camera.position.set(0, 4, 12);
    camera.lookAt(0, 1.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0a0a2e, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Add background particles
    const bgParticles = createBackgroundParticles(scene);

    // Lights - brighter
    const ambient = new THREE.AmbientLight(0x4466aa, 0.8);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(8, 12, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);
    const backLight = new THREE.DirectionalLight(0x4488ff, 0.8);
    backLight.position.set(-5, 3, -8);
    scene.add(backLight);
    const rimLight = new THREE.DirectionalLight(0x88ccff, 0.6);
    rimLight.position.set(0, -3, 10);
    scene.add(rimLight);
    const fillLight = new THREE.DirectionalLight(0x88aaff, 0.5);
    fillLight.position.set(-3, 5, 5);
    scene.add(fillLight);

    // Group for all objects
    const group = new THREE.Group();
    scene.add(group);

    const objects = [];
    const spacingX = 1.8;
    const spacingZ = 2.2;
    const maxScale = 1.2;

    // Flatten all skills with member info
    const allSkills = [];
    skillData.forEach((memberData, mi) => {
        memberData.skills.forEach(skill => {
            allSkills.push({
                member: memberData.member,
                skillName: skill.name,
                level: skill.level,
                color: memberColors[mi % memberColors.length],
                memberIndex: mi
            });
        });
    });

    // Arrange in grid: 4 columns x 5 rows (20 objects)
    const cols = 4;
    const rows = 5;
    allSkills.forEach((item, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = (col - (cols - 1) / 2) * spacingX;
        const z = (row - (rows - 1) / 2) * spacingZ;

        const scale = 0.3 + (item.level / 10) * maxScale;
        const shapeType = shapeTypes[i % shapeTypes.length];
        
        let geometry, mesh;
        const color = new THREE.Color(item.color);
        
        switch(shapeType) {
            case 'sphere':
                geometry = new THREE.SphereGeometry(0.45, 32, 32);
                break;
            case 'octahedron':
                geometry = new THREE.OctahedronGeometry(0.5);
                break;
            case 'dodecahedron':
                geometry = new THREE.DodecahedronGeometry(0.48);
                break;
            case 'torus':
                geometry = new THREE.TorusGeometry(0.4, 0.15, 16, 32);
                break;
            case 'cone':
                geometry = new THREE.ConeGeometry(0.4, 0.7, 8);
                break;
            default:
                geometry = new THREE.SphereGeometry(0.45, 32, 32);
        }

        const material = new THREE.MeshPhysicalMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.15,
            metalness: 0.3,
            roughness: 0.25,
            clearcoat: 0.3,
            transparent: true,
            opacity: 0.92,
        });

        mesh = new THREE.Mesh(geometry, material);
        mesh.scale.set(scale, scale, scale);
        mesh.position.set(x, 0.6 + scale * 0.4, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        mesh.userData = {
            skillName: item.skillName,
            member: item.member,
            level: item.level,
            color: item.color,
            shapeType: shapeType,
            originalScale: scale,
            originalY: 0.6 + scale * 0.4
        };
        
        group.add(mesh);
        objects.push(mesh);

        // Add glow ring under each object - brighter
        const ringGeo = new THREE.RingGeometry(0.3, 0.55, 32);
        const ringMat = new THREE.MeshBasicMaterial({
            color: item.color,
            transparent: true,
            opacity: 0.25,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = -Math.PI / 2;
        ring.position.set(x, 0.05, z);
        ring.scale.set(scale * 1.3, scale * 1.3, scale * 1.3);
        group.add(ring);

        // Add small orbiting particles around each object
        const particleCount = 8;
        const particleGeo = new THREE.BufferGeometry();
        const particlePos = new Float32Array(particleCount * 3);
        for (let p = 0; p < particleCount; p++) {
            const angle = (p / particleCount) * Math.PI * 2;
            const radius = 0.6 + scale * 0.2;
            particlePos[p * 3] = Math.cos(angle) * radius;
            particlePos[p * 3 + 1] = Math.sin(angle * 2) * 0.1;
            particlePos[p * 3 + 2] = Math.sin(angle) * radius;
        }
        particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
        const particleMat = new THREE.PointsMaterial({
            color: item.color,
            size: 0.05,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending
        });
        const particles = new THREE.Points(particleGeo, particleMat);
        particles.position.copy(mesh.position);
        particles.userData.parentIndex = i;
        group.add(particles);
        mesh.userData.particles = particles;

        // Add small label above each object (3D text alternative - small glowing dot)
        const labelDotGeo = new THREE.SphereGeometry(0.03, 8, 8);
        const labelDotMat = new THREE.MeshBasicMaterial({
            color: 0x88ccff,
            transparent: true,
            opacity: 0.3
        });
        const labelDot = new THREE.Mesh(labelDotGeo, labelDotMat);
        labelDot.position.set(x, 0.6 + scale * 0.4 + scale * 0.6, z);
        group.add(labelDot);
    });

    // Add decorative floating rings around the whole group - brighter
    const ringMat2 = new THREE.MeshBasicMaterial({
        color: 0x5b8def,
        transparent: true,
        opacity: 0.08,
        wireframe: true,
        side: THREE.DoubleSide
    });
    for (let i = 0; i < 2; i++) {
        const ring = new THREE.Mesh(new THREE.RingGeometry(2 + i * 2, 2.2 + i * 2, 48), ringMat2);
        ring.rotation.x = -Math.PI / 2 + (i * 0.1);
        ring.position.y = 0.02;
        group.add(ring);
    }

    // Controls for skills view
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;
    controls.target.set(0, 1.5, 0);
    controls.maxPolarAngle = Math.PI / 2.2;
    controls.minDistance = 4;
    controls.maxDistance = 20;
    controls.enableZoom = true;
    controls.enablePan = false;

    // Raycaster for hover
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const detailEl = document.getElementById('skill-detail');
    const infoEl = document.getElementById('skill-info');

    function onMouseMove(event) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(objects);
        
        // Reset previous hover
        if (hoveredObject) {
            hoveredObject.material.emissiveIntensity = 0.15;
            const s = hoveredObject.userData.originalScale;
            hoveredObject.scale.set(s, s, s);
            hoveredObject = null;
        }
        
        if (intersects.length > 0) {
            const obj = intersects[0].object;
            hoveredObject = obj;
            obj.material.emissiveIntensity = 0.7;
            const s = obj.userData.originalScale * 1.15;
            obj.scale.set(s, s, s);
            
            const data = obj.userData;
            if (detailEl) {
                const colorStyle = new THREE.Color(data.color).getStyle();
                const shapeIcons = {
                    'sphere': '⚪',
                    'octahedron': '🔶',
                    'dodecahedron': '🔷',
                    'torus': '⭕',
                    'cone': '🔺'
                };
                detailEl.innerHTML = `
                    <div style="background:rgba(10,10,40,0.9);padding:14px 20px;border-radius:12px;border:2px solid ${colorStyle};backdrop-filter:blur(5px);">
                        <div style="font-size:1.3rem;margin-bottom:2px;">
                            ${shapeIcons[data.shapeType] || '💎'} 
                            <strong style="color:#ffffff;">${data.skillName}</strong>
                        </div>
                        <div style="color:${colorStyle};font-weight:600;">👤 ${data.member}</div>
                        <div style="color:#88ccff;margin-top:2px;">Level: ${data.level}/10</div>
                        <div style="width:100%;height:6px;background:rgba(255,255,255,0.1);border-radius:4px;margin-top:6px;overflow:hidden;">
                            <div style="width:${data.level * 10}%;height:100%;background:${colorStyle};border-radius:4px;transition:width 0.3s;"></div>
                        </div>
                        <div style="font-size:0.65rem;color:#888;margin-top:4px;text-transform:capitalize;">${data.shapeType}</div>
                    </div>
                `;
            }
            if (infoEl) {
                infoEl.style.opacity = '0.6';
                infoEl.style.transform = 'scale(0.98)';
            }
            renderer.domElement.style.cursor = 'pointer';
        } else {
            if (detailEl) {
                detailEl.innerHTML = '';
            }
            if (infoEl) {
                infoEl.style.opacity = '1';
                infoEl.style.transform = 'scale(1)';
            }
            renderer.domElement.style.cursor = 'default';
        }
    }

    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseleave', () => {
        if (hoveredObject) {
            hoveredObject.material.emissiveIntensity = 0.15;
            const s = hoveredObject.userData.originalScale;
            hoveredObject.scale.set(s, s, s);
            hoveredObject = null;
        }
        if (detailEl) {
            detailEl.innerHTML = '';
        }
        if (infoEl) {
            infoEl.style.opacity = '1';
            infoEl.style.transform = 'scale(1)';
        }
    });

    // Resize handler
    function resize() {
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (w > 0 && h > 0) {
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        }
    }
    window.addEventListener('resize', resize);

    // Animation loop for skills
    let time = 0;
    function animateSkills() {
        requestAnimationFrame(animateSkills);
        time += 0.01;
        
        controls.update();
        
        // Rotate background particles slowly
        if (bgParticles) {
            bgParticles.rotation.y += 0.0005;
        }
        
        // Animate each object
        objects.forEach((obj, i) => {
            const offset = i * 0.2;
            // Floating
            const floatY = Math.sin(time * 0.6 + offset) * 0.15;
            obj.position.y = obj.userData.originalY + floatY;
            
            // Rotation - different for each shape
            if (obj.userData.shapeType === 'sphere') {
                obj.rotation.x += 0.01;
                obj.rotation.y += 0.015;
            } else if (obj.userData.shapeType === 'octahedron') {
                obj.rotation.y += 0.02;
                obj.rotation.z += 0.005;
            } else if (obj.userData.shapeType === 'dodecahedron') {
                obj.rotation.x += 0.008;
                obj.rotation.y += 0.012;
            } else if (obj.userData.shapeType === 'torus') {
                obj.rotation.x += 0.015;
                obj.rotation.y += 0.01;
            } else if (obj.userData.shapeType === 'cone') {
                obj.rotation.y += 0.02;
            }
            
            // Animate particles
            if (obj.userData.particles) {
                const particles = obj.userData.particles;
                const positions = particles.geometry.attributes.position.array;
                for (let p = 0; p < positions.length / 3; p++) {
                    const angle = (p / (positions.length / 3)) * Math.PI * 2 + time * 0.5 + i * 0.1;
                    const radius = 0.6 + obj.userData.originalScale * 0.2;
                    positions[p * 3] = Math.cos(angle) * radius;
                    positions[p * 3 + 1] = Math.sin(angle * 2 + time * 0.3) * 0.15;
                    positions[p * 3 + 2] = Math.sin(angle) * radius;
                }
                particles.geometry.attributes.position.needsUpdate = true;
                particles.position.y = obj.position.y;
            }
        });
        
        renderer.render(scene, camera);
    }
    animateSkills();

    return { scene, camera, renderer, controls, objects, skillData };
}