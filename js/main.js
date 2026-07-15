import { initScene } from './scene.js';
import { initLighting } from './lighting.js';
import { createAllObjects } from './objects.js';
import { initAnimations } from './animations.js';
import { initInteractions } from './interactions.js';
import { createSkillsBars } from './skillsBars.js';
import { initAboutThreeJS, selectMember } from './aboutThree.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


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
            formStatus.textContent = 'Please fill in all required fields.';
        }
        
        setTimeout(() => {
            formStatus.textContent = '';
            formStatus.style.background = 'transparent';
            formStatus.style.border = 'none';
        }, 5000);
    });
}

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

// Smooth scroll without hash - using scrollIntoView
function initSmoothScroll() {
    const allLinks = document.querySelectorAll('a[href^="#"]');
    
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                e.preventDefault();
                e.stopPropagation();
                
                targetSection.scrollIntoView({ behavior: 'smooth' });
                
                // Update active nav link
                const sectionName = targetId.substring(1);
                document.querySelectorAll('.nav-links a').forEach(navLink => {
                    navLink.classList.remove('active');
                    if (navLink.getAttribute('data-section') === sectionName) {
                        navLink.classList.add('active');
                    }
                });
                
                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                if (navLinks) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav-links a');
        const scrollPosition = window.pageYOffset + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}


// THREE.JS INITIALIZATION

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
    
    // Initialize skills bars in the skills section with its own galaxy
    const skillsContainer = document.getElementById('skills-3d');
    if (skillsContainer) {
        createSkillsBars(skillsContainer);
    }
    
    // Initialize About Us ThreeJS Showcase
    initAboutThreeJS();
    
    // Bind member tabs selection
    const tabs = document.querySelectorAll('.member-tab-btn');
    tabs.forEach((tab, idx) => {
        tab.addEventListener('click', () => {
            selectMember(idx);
        });
    });
    window.selectAboutMember = selectMember;
    
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


function initResizeHandler(camera, renderer) {
    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });
}


function init() {
    console.log('🚀 EchoSpace - Loading...');
    
    // Initialize UI components
    initScrollAnimations();
    initMobileMenu();
    initSmoothScroll();
    initContactForm();
    
    // Initialize Three.js
    state = initThreeJS();
    
    // resize handler
    initResizeHandler(state.camera, state.renderer);
    
    // animation loop
    animate();
    
    console.log('✅ EchoSpace - Ready!');
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', init);