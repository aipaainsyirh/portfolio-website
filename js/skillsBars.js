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
    0x3498db, // blue
    0x2ecc71, // green
    0xe74c3c, // red
    0xf1c40f  // gold
];

let hoveredBar = null;

export function createSkillsBars(container) {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 50);
    camera.position.set(0, 4, 10);
    camera.lookAt(0, 1.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0x446688, 0.6);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);
    const backLight = new THREE.DirectionalLight(0x4488ff, 0.5);
    backLight.position.set(-5, 2, -5);
    scene.add(backLight);

    // Group for all bars
    const group = new THREE.Group();
    scene.add(group);

    const bars = [];
    const barWidth = 0.5;
    const barDepth = 0.5;
    const spacingX = 1.7;
    const spacingZ = 2.0;
    const maxHeight = 3.0;

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

    // Arrange in grid: 4 columns x 5 rows (20 bars)
    const cols = 4;
    const rows = 5;
    allSkills.forEach((item, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = (col - (cols - 1) / 2) * spacingX;
        const z = (row - (rows - 1) / 2) * spacingZ;

        const height = (item.level / 10) * maxHeight;
        const geometry = new THREE.BoxGeometry(barWidth, height, barDepth);
        const material = new THREE.MeshStandardMaterial({
            color: item.color,
            emissive: item.color,
            emissiveIntensity: 0.15,
            roughness: 0.3,
            metalness: 0.1,
            transparent: true,
            opacity: 0.85,
        });
        const bar = new THREE.Mesh(geometry, material);
        bar.position.set(x, height / 2, z);
        bar.userData = {
            skillName: item.skillName,
            member: item.member,
            level: item.level,
            color: item.color,
            originalHeight: height
        };
        group.add(bar);
        bars.push(bar);

        // Add label outline (thin border)
        const edgeGeo = new THREE.EdgesGeometry(geometry);
        const edgeMat = new THREE.LineBasicMaterial({
            color: 0x88ccff,
            transparent: true,
            opacity: 0.2
        });
        const edge = new THREE.LineSegments(edgeGeo, edgeMat);
        edge.position.copy(bar.position);
        group.add(edge);
    });

    // Add floor grid rings
    const ringMat = new THREE.MeshBasicMaterial({
        color: 0x3498db,
        transparent: true,
        opacity: 0.06,
        wireframe: true
    });
    for (let i = 0; i < 3; i++) {
        const ring = new THREE.Mesh(new THREE.RingGeometry(1.5 + i * 1.8, 1.7 + i * 1.8, 32), ringMat);
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = 0.01;
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
    const detailEl = document.getElementById('skill-detail') || document.getElementById('skill-info');

    function onMouseMove(event) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(bars);
        
        // Reset previous hover
        if (hoveredBar) {
            hoveredBar.material.emissiveIntensity = 0.15;
            hoveredBar.scale.set(1, 1, 1);
            hoveredBar = null;
        }
        
        if (intersects.length > 0) {
            const bar = intersects[0].object;
            hoveredBar = bar;
            bar.material.emissiveIntensity = 0.6;
            bar.scale.set(1.05, 1, 1.05);
            
            const data = bar.userData;
            if (detailEl) {
                detailEl.innerHTML = `
                    <div style="background:rgba(0,0,0,0.6);padding:12px 16px;border-radius:10px;border:1px solid ${new THREE.Color(data.color).getStyle()};">
                        <strong style="color:#fff;font-size:1.1rem;">${data.skillName}</strong><br>
                        <span style="color:${new THREE.Color(data.color).getStyle()};">👤 ${data.member}</span><br>
                        <span style="color:#88ccff;">Level: ${data.level}/10</span>
                        <div style="width:100%;height:4px;background:#222;border-radius:4px;margin-top:6px;">
                            <div style="width:${data.level * 10}%;height:100%;background:${new THREE.Color(data.color).getStyle()};border-radius:4px;"></div>
                        </div>
                    </div>
                `;
            }
            renderer.domElement.style.cursor = 'pointer';
        } else {
            if (detailEl && !detailEl.querySelector('h3')) {
                detailEl.innerHTML = `
                    <h3 style="color:#3498db;">🎯 Hover over the 3D bars!</h3>
                    <p style="color:#b0b0b0;">Each bar represents a different skill level</p>
                `;
            }
            renderer.domElement.style.cursor = 'default';
        }
    }

    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseleave', () => {
        if (hoveredBar) {
            hoveredBar.material.emissiveIntensity = 0.15;
            hoveredBar.scale.set(1, 1, 1);
            hoveredBar = null;
        }
        if (detailEl) {
            detailEl.innerHTML = `
                <h3 style="color:#3498db;">🎯 Hover over the 3D bars!</h3>
                <p style="color:#b0b0b0;">Each bar represents a different skill level</p>
            `;
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
        time += 0.005;
        
        controls.update();
        
        // Gentle floating animation for bars
        bars.forEach((bar, i) => {
            const offset = i * 0.3;
            const floatHeight = Math.sin(time * 0.5 + offset) * 0.08;
            const originalY = bar.userData.originalHeight / 2;
            bar.position.y = originalY + floatHeight;
        });
        
        renderer.render(scene, camera);
    }
    animateSkills();

    return { scene, camera, renderer, controls, bars, skillData };
}