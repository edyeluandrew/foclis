let scene, camera, renderer;
let mountains = [];
let clouds = [];
let scrollSpeed = 0;
let targetScrollSpeed = 0;
let isScrolling = false;
let scrollTimeout;

function initThreeJS() {
    const canvas = document.getElementById('bg-canvas');
    
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x87CEEB, 80, 400);
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x87CEEB, 1);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(100, 100, 50);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const blueLight = new THREE.DirectionalLight(0x87CEEB, 0.2);
    blueLight.position.set(-50, 50, -50);
    scene.add(blueLight);

    createMountains();
    createClouds();

    camera.position.set(0, 25, 60);
    camera.lookAt(0, 15, 0);

    animate();
}

function createMountains() {

    const mountainRanges = [
        { z: -180, scale: 3.0, color: 0x4169E1, opacity: 0.4 }, 
        { z: -120, scale: 2.2, color: 0x6495ED, opacity: 0.55 }, 
        { z: -70, scale: 1.8, color: 0x778899, opacity: 0.7 },  
        { z: -35, scale: 1.2, color: 0x696969, opacity: 0.85 }  
    ];

    mountainRanges.forEach((range, rangeIndex) => {
        for (let i = 0; i < 12; i++) { 
            const height = (12 + Math.random() * 20) * range.scale;
            const baseRadius = 12 + Math.random() * 15;
            
            const geometry = new THREE.SphereGeometry(baseRadius, 16, 12);
            
            const positions = geometry.attributes.position.array;
            for (let j = 0; j < positions.length; j += 3) {
                const y = positions[j + 1];
                if (y < 0) {
                    positions[j + 1] = Math.max(y * 0.1, -baseRadius * 0.1); 
                } else {
                    positions[j + 1] = y * (height / baseRadius); 
                }
            }
            geometry.attributes.position.needsUpdate = true;
            geometry.computeVertexNormals();
            
            const material = new THREE.MeshLambertMaterial({
                color: range.color,
                transparent: true,
                opacity: range.opacity
            });
            
            const mountain = new THREE.Mesh(geometry, material);
            mountain.position.set(
                (i - 6) * 20 + (Math.random() - 0.5) * 25,
                height * 0.3 - 8,
                range.z + (Math.random() - 0.5) * 30
            );
            
            if (height > 20 && rangeIndex >= 1) {
                const snowCapGeometry = new THREE.SphereGeometry(baseRadius * 0.6, 12, 8);
                const snowCapMaterial = new THREE.MeshLambertMaterial({
                    color: 0xFFFFFF,
                    transparent: true,
                    opacity: 0.8
                });
                const snowCap = new THREE.Mesh(snowCapGeometry, snowCapMaterial);
                snowCap.position.set(0, height * 0.4, 0);
                snowCap.scale.y = 0.5; 
                mountain.add(snowCap);
            }
            
            mountains.push(mountain);
            scene.add(mountain);
        }
    });
}

function createClouds() {

    const cloudLayers = [
        { count: 20, z: 40, y: 45, size: 4, opacity: 0.15, speed: 1.2, spread: 300 },
        { count: 25, z: 10, y: 40, size: 6, opacity: 0.2, speed: 0.8, spread: 280 },   
        { count: 18, z: -20, y: 50, size: 8, opacity: 0.25, speed: 0.6, spread: 250 },  
        { count: 15, z: -60, y: 55, size: 10, opacity: 0.3, speed: 0.4, spread: 220 },  
        { count: 12, z: -100, y: 65, size: 12, opacity: 0.2, speed: 0.3, spread: 200 }, 
        { count: 8, z: -150, y: 75, size: 15, opacity: 0.15, speed: 0.2, spread: 180 }  
    ];

    cloudLayers.forEach((layer, layerIndex) => {
        for (let i = 0; i < layer.count; i++) {
            const cloudGroup = new THREE.Group();
            
            const cloudParts = 3 + Math.floor(Math.random() * 3); 
            for (let j = 0; j < cloudParts; j++) {
                const partSize = layer.size * (0.6 + Math.random() * 0.8);
                const cloudGeometry = new THREE.SphereGeometry(partSize, 12, 8); 
                
                const cloudMaterial = new THREE.MeshLambertMaterial({
                    color: 0xFFFFFF,
                    transparent: true,
                    opacity: layer.opacity * (0.5 + Math.random() * 0.5), 
                    fog: true
                });
                
                const cloudPart = new THREE.Mesh(cloudGeometry, cloudMaterial);
                
                cloudPart.position.set(
                    (Math.random() - 0.5) * layer.size * 3,
                    (Math.random() - 0.5) * layer.size * 1.5,
                    (Math.random() - 0.5) * layer.size * 2
                );
                
                cloudGroup.add(cloudPart);
            }
            
            cloudGroup.position.set(
                (Math.random() - 0.5) * layer.spread, 
                layer.y + (Math.random() - 0.5) * 25,
                layer.z + (Math.random() - 0.5) * 40
            );
            
            const scale = 0.7 + Math.random() * 0.8;
            cloudGroup.scale.set(scale, scale * 0.6, scale);
            
            cloudGroup.userData = {
                baseX: cloudGroup.position.x,
                baseY: cloudGroup.position.y,
                baseZ: cloudGroup.position.z,
                speedMultiplier: layer.speed,
                driftSpeed: 0.005 + Math.random() * 0.015,
                floatAmplitude: 1 + Math.random() * 2,
                floatSpeed: 0.0005 + Math.random() * 0.001
            };
            
            clouds.push(cloudGroup);
            scene.add(cloudGroup);
        }
    });
}

function animate() {
    requestAnimationFrame(animate);

    scrollSpeed += (targetScrollSpeed - scrollSpeed) * 0.1;

    const time = Date.now();

    clouds.forEach((cloud, index) => {
        const userData = cloud.userData;
        
        cloud.position.x += userData.driftSpeed * userData.speedMultiplier;
        
        if (cloud.position.x > 200) {
            cloud.position.x = -200;
        } else if (cloud.position.x < -200) {
            cloud.position.x = 200;
        }
        
        cloud.position.z = userData.baseZ + scrollSpeed * userData.speedMultiplier * 0.3;
        
        cloud.position.y = userData.baseY + 
            Math.sin(time * userData.floatSpeed + index * 0.5) * userData.floatAmplitude;
        
        cloud.rotation.y += 0.0005 * userData.speedMultiplier;
        cloud.rotation.z += Math.sin(time * 0.0003 + index) * 0.002;
        
        const breathe = 1 + Math.sin(time * 0.0008 + index * 0.3) * 0.05;
        cloud.scale.x = cloud.scale.x * breathe;
        cloud.scale.z = cloud.scale.z * breathe;
    });

    if (Math.abs(scrollSpeed) > 0.1) {
        camera.position.x += scrollSpeed * 0.015;
        camera.position.y += scrollSpeed * 0.008;
        
        camera.position.x = Math.max(-8, Math.min(8, camera.position.x));
        camera.position.y = Math.max(20, Math.min(35, camera.position.y));
    }

    const cameraTime = Date.now() * 0.0002;
    camera.position.x += Math.sin(cameraTime) * 0.3;
    camera.position.y += Math.cos(cameraTime * 1.1) * 0.2;
    camera.lookAt(0, 15, 0);

    renderer.render(scene, camera);
}

function handleScroll() {
    const scrollY = window.scrollY;
    const formSection = document.getElementById('application-form');
    const formOffset = formSection.offsetTop;
    const formHeight = formSection.offsetHeight;
    
    const scrollProgress = Math.max(0, Math.min(1, (scrollY - formOffset + window.innerHeight) / (formHeight + window.innerHeight)));
    
    if (scrollY >= formOffset - window.innerHeight && scrollY <= formOffset + formHeight) {
        targetScrollSpeed = (window.scrollY - window.lastScrollY || 0) * 0.05; 
        isScrolling = true;
        
        clearTimeout(scrollTimeout);
        
        scrollTimeout = setTimeout(() => {
            targetScrollSpeed = 0;
            isScrolling = false;
        }, 200);
    } else {
        targetScrollSpeed *= 0.98; 
    }
    
    window.lastScrollY = window.scrollY;
}

function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function createSnowParticles() {
    const snowGeometry = new THREE.BufferGeometry();
    const snowCount = 150; 
    const positions = new Float32Array(snowCount * 3);
    
    for (let i = 0; i < snowCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 250; 
        positions[i + 1] = Math.random() * 120 + 10;    
        positions[i + 2] = (Math.random() - 0.5) * 250; 
    }
    
    snowGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const snowMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 1.5,
        transparent: true,
        opacity: 0.4, 
        blending: THREE.AdditiveBlending
    });
    
    const snow = new THREE.Points(snowGeometry, snowMaterial);
    scene.add(snow);
    
    function animateSnow() {
        const positions = snow.geometry.attributes.position.array;
        
        for (let i = 1; i < positions.length; i += 3) {
            positions[i] -= 0.05 + Math.random() * 0.03; 
            

            positions[i - 1] += (Math.random() - 0.5) * 0.02;
            
            if (positions[i] < 0) {
                positions[i] = 120;
                positions[i - 1] = (Math.random() - 0.5) * 250;
                positions[i + 1] = (Math.random() - 0.5) * 250;
            }
        }
        
        snow.geometry.attributes.position.needsUpdate = true;
        requestAnimationFrame(animateSnow);
    }
    
    animateSnow();
}

function initializeSnowParticles() {
    setTimeout(() => {
        if (scene) {
            createSnowParticles();
        }
    }, 3000);
}

window.ThreeAnimations = {
    init: initThreeJS,
    handleScroll: handleScroll,
    handleResize: handleResize,
    initSnow: initializeSnowParticles
};