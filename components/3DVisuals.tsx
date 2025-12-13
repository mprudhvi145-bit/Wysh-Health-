
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// --- DNA Helix Component ---
export const DNAHelix: React.FC<{ className?: string }> = React.memo(({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Safety check for zero dimensions
    if (container.clientWidth === 0 || container.clientHeight === 0) return;

    let animationId: number;
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const dnaGroup = new THREE.Group();
    scene.add(dnaGroup);

    // Resources
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];

    const particlesCount = 80;
    const particleGeo = new THREE.SphereGeometry(0.12, 8, 8);
    geometries.push(particleGeo);

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1 });
    const mat1 = new THREE.MeshBasicMaterial({ color: 0x4D8B83 }); // Teal
    const mat2 = new THREE.MeshBasicMaterial({ color: 0x8763FF }); // Purple
    materials.push(lineMaterial, mat1, mat2);

    for (let i = 0; i < particlesCount; i++) {
        const t = i * 0.3;
        const radius = 2;
        
        // Strand 1
        const x1 = Math.cos(t) * radius;
        const y1 = (i * 0.2) - (particlesCount * 0.1);
        const z1 = Math.sin(t) * radius;

        // Strand 2
        const x2 = Math.cos(t + Math.PI) * radius;
        const y2 = y1;
        const z2 = Math.sin(t + Math.PI) * radius;

        const p1 = new THREE.Mesh(particleGeo, mat1);
        p1.position.set(x1, y1, z1);
        dnaGroup.add(p1);

        const p2 = new THREE.Mesh(particleGeo, mat2);
        p2.position.set(x2, y2, z2);
        dnaGroup.add(p2);

        if (i % 2 === 0) {
            const points = [];
            points.push(new THREE.Vector3(x1, y1, z1));
            points.push(new THREE.Vector3(x2, y2, z2));
            const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(lineGeo, lineMaterial);
            dnaGroup.add(line);
            geometries.push(lineGeo);
        }
    }

    // Interaction
    let mouseX = 0;
    let mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const onDocumentMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - windowHalfX) * 0.001;
      mouseY = (event.clientY - windowHalfY) * 0.001;
    };
    document.addEventListener('mousemove', onDocumentMouseMove);

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      dnaGroup.rotation.y += 0.005; 
      dnaGroup.rotation.y += mouseX * 0.5;
      dnaGroup.rotation.x += mouseY * 0.5;
      dnaGroup.position.y = Math.sin(Date.now() * 0.001) * 0.5;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
        if (!container || container.clientWidth === 0 || container.clientHeight === 0) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', onDocumentMouseMove);
      geometries.forEach(g => g.dispose());
      materials.forEach(m => m.dispose());
      renderer.dispose();
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className={`w-full h-full ${className}`} />;
});

// --- Holographic Model Component ---
export const HolographicModel: React.FC = React.memo(() => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        if (container.clientWidth === 0 || container.clientHeight === 0) return;

        let animationId: number;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 6;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const geometries: THREE.BufferGeometry[] = [];
        const materials: THREE.Material[] = [];

        const coreGeo = new THREE.IcosahedronGeometry(2, 2);
        const coreMat = new THREE.MeshBasicMaterial({ 
            color: 0x4D8B83, wireframe: true, transparent: true, opacity: 0.3 
        });
        const sphere = new THREE.Mesh(coreGeo, coreMat);
        scene.add(sphere);
        geometries.push(coreGeo);
        materials.push(coreMat);

        const innerGeo = new THREE.IcosahedronGeometry(1.5, 1);
        const innerMat = new THREE.MeshBasicMaterial({
            color: 0x8763FF, wireframe: true, transparent: true, opacity: 0.1
        });
        const innerSphere = new THREE.Mesh(innerGeo, innerMat);
        scene.add(innerSphere);
        geometries.push(innerGeo);
        materials.push(innerMat);

        const particlesGeo = new THREE.BufferGeometry();
        const particlesCount = 200;
        const posArray = new Float32Array(particlesCount * 3);
        for(let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 8;
        }
        particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMat = new THREE.PointsMaterial({
            size: 0.05, color: 0x7EC4BD, transparent: true, opacity: 0.8
        });
        const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
        scene.add(particlesMesh);
        geometries.push(particlesGeo);
        materials.push(particlesMat);

        const animate = () => {
            animationId = requestAnimationFrame(animate);
            sphere.rotation.x += 0.002;
            sphere.rotation.y += 0.003;
            innerSphere.rotation.x -= 0.002;
            innerSphere.rotation.y -= 0.002;
            particlesMesh.rotation.y += 0.001;
            const scale = 1 + Math.sin(Date.now() * 0.001) * 0.05;
            sphere.scale.set(scale, scale, scale);
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            if (!container || container.clientWidth === 0 || container.clientHeight === 0) return;
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
            geometries.forEach(g => g.dispose());
            materials.forEach(m => m.dispose());
            renderer.dispose();
            if(container && renderer.domElement.parentNode === container) {
                container.removeChild(renderer.domElement);
            }
        }
    }, []);

    return <div ref={containerRef} className="w-full h-full absolute inset-0" />;
});

// --- Neural Grid Component ---
export const NeuralGrid: React.FC = React.memo(() => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        let w = canvas.width = window.innerWidth;
        let h = canvas.height = window.innerHeight;
        
        const dots: {x: number, y: number, vx: number, vy: number}[] = [];
        for(let i=0; i<60; i++) {
            dots.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }

        const animate = () => {
            ctx.clearRect(0,0,w,h);
            ctx.fillStyle = 'rgba(77, 139, 131, 0.5)';
            ctx.strokeStyle = 'rgba(77, 139, 131, 0.1)';

            dots.forEach((dot, i) => {
                dot.x += dot.vx;
                dot.y += dot.vy;

                if(dot.x < 0 || dot.x > w) dot.vx *= -1;
                if(dot.y < 0 || dot.y > h) dot.vy *= -1;

                ctx.beginPath();
                ctx.arc(dot.x, dot.y, 1.5, 0, Math.PI*2);
                ctx.fill();

                for(let j=i+1; j<dots.length; j++) {
                    const d2 = dots[j];
                    const dist = Math.hypot(dot.x - d2.x, dot.y - d2.y);
                    if(dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(dot.x, dot.y);
                        ctx.lineTo(d2.x, d2.y);
                        ctx.stroke();
                    }
                }
            });
            animationId = requestAnimationFrame(animate);
        }
        
        const handleResize = () => {
            if (canvas) {
                w = canvas.width = window.innerWidth;
                h = canvas.height = window.innerHeight;
            }
        }

        window.addEventListener('resize', handleResize);
        animate();
        
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
        }

    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-40" />;
});
