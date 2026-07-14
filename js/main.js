// ============================================
// ECHOSPACE - MAIN ENTRY POINT
// NO FETCH - All content already in HTML
// ============================================

import { initScene } from './scene.js';
import { initLighting } from './lighting.js';
import { createAllObjects } from './objects.js';
import { initAnimations } from './animations.js';
import { initInteractions } from './interactions.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ============================================
// 1. CONTACT FORM HANDLER
// ============================================

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formStatus = document.getElementById('formStatus');
        
        const name = document.getElementById('name')?.value || '';
        const email = document.getElementById('email')?.value || '';
        const subject = document.getElementById('subject')?.value || '';
        const message = document.getElementById('message')?.value || '';
        
        if (name && email && message) {
            formStatus.style.color = '#2ecc71';
            formStatus.style.background = 'rgba(46, 204, 113, 0.1)';
            formStatus.style.border = '1px solid #2ecc71';
            formStatus.textContent = '✅ Message sent successfully!';
            form.reset();
        } else {
            formStatus.style.color = '#e74c3c';
            formStatus.style.background = 'rgba(231, 76, 60, 0.1)';
            formStatus.style.border = '1px solid #e74c3c';
            formStatus.textContent = '❌ Please fill in all required fields.';
        }
        
        setTimeout(() => {
            formStatus.textContent = '';
            formStatus.style.background = 'transparent';
            formStatus.style.border = 'none';
        }, 5000);
    });
}

// ============================================
// 2. SCROLL ANIMATIONS
// ============================================

function initScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => observer.observe(section));
}

// ============================================
// 3. MOBILE MENU
// ============================================

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
}

// ============================================
// 4. THREE.JS INITIALIZATION
// ============================================

function initThreeJS() {
    const { scene, camera, renderer } = initScene();
    initLighting(scene);
    const { allObjects, allMeshes } = createAllObjects(scene);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.15;
    controls.target.set(0, 1.5, 0);
    controls.maxPolarAngle = Math.PI / 2.2;
    controls.minDistance = 3;
    controls.maxDistance = 20;
    controls.enableZoom = true;
    controls.enablePan = false;
    
    const interactionState = initInteractions(camera, renderer, allMeshes);
    const animationState = initAnimations(allObjects);
    
    return {
        scene,
        camera,
        renderer,
        controls,
        allObjects,
        allMeshes,
        animationState,
        interactionState
    };
}

// ============================================
// 5. ANIMATION LOOP
// ============================================

let state = null;

function animate() {
    if (!state) return;
    
    requestAnimationFrame(animate);
    
    if (state.animationState) {
        state.animationState.update();
    }
    
    state.controls.update();
    state.renderer.render(state.scene, state.camera);
}

// ============================================
// 6. WINDOW RESIZE
// ============================================

function initResizeHandler(camera, renderer) {
    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });
}

// ============================================
// 7. INITIALIZATION
// ============================================

function init() {
    console.log('🚀 EchoSpace - Loading...');
    
    // Initialize UI components
    initScrollAnimations();
    initMobileMenu();
    initContactForm();
    
    // Initialize Three.js
    state = initThreeJS();
    
    // Setup resize handler
    initResizeHandler(state.camera, state.renderer);
    
    // Start animation loop
    animate();
    
    console.log('✅ EchoSpace - Ready!');
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', init);