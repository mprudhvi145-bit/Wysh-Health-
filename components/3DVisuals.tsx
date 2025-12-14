
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const isReducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- DNA Helix Component ---
export const DNAHelix: React.FC<{ className?: string }> = React.memo(({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReducedMotion()) return; // Skip for accessibility/performance

    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | undefined;
    let animationId: number;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let dnaGroup: THREE.Group;
    let initialized = false;

    const init = () => {
      if (container.clientWidth === 0 || container.clientHeight === 0) return;
      
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
      camera.position.z = 10;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      dnaGroup = new THREE.Group();
      scene.add(dnaGroup);

      // Resources
      const particleGeo = new THREE.SphereGeometry(0.12, 8, 8);
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1 });
      const mat1 = new THREE.MeshBasicMaterial({ color: 0x45A29E }); // Teal
      const mat2 = new THREE.MeshBasicMaterial({ color: 0x8860D0 }); // Purple

      const particlesCount = 80;
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
          }
      }
      initialized = true;
      animate();
    };

    // Interaction vars
    let mouseX = 0;
    let mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const onDocumentMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - windowHalfX) * 0.001;
      mouseY = (event.clientY - windowHalfY) * 0.001;
    };

    const animate = () => {
      if (!initialized || !renderer || !scene || !camera) return;
      animationId = requestAnimationFrame(animate);
      dnaGroup.rotation.y += 0.005; 
      dnaGroup.rotation.y += mouseX * 0.5;
      dnaGroup.rotation.x += mouseY * 0.5;
      dnaGroup.position.y = Math.sin(Date.now() * 0.001) * 0.5;
      renderer.render(scene, camera);
    };

    const resizeObserver = new ResizeObserver((entries) => {
        if (!initialized) {
            init();
        } else if (renderer && camera && container) {
             const width = container.clientWidth;
             const height = container.clientHeight;
             if (width === 0 || height === 0) return;
             camera.aspect = width / height;
             camera.updateProjectionMatrix();
             renderer.setSize(width, height);
        }
    });

    resizeObserver.observe(container);
    document.addEventListener('mousemove', onDocumentMouseMove);

    return () => {
      resizeObserver.disconnect();
      document.removeEventListener('mousemove', onDocumentMouseMove);
      if (animationId) cancelAnimationFrame(animationId);
      if (renderer) {
          renderer.dispose();
          if (container.contains(renderer.domElement)) {
              container.removeChild(renderer.domElement);
          }
      }
    };
  }, []);

  if (isReducedMotion()) return <div className={`w-full h-full ${className} bg-teal/5 rounded-full`} />;

  return <div ref={containerRef} className={`w-full h-full ${className}`} />;
});

// --- Holographic Model Component ---
export const HolographicModel: React.FC = React.memo(() => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isReducedMotion()) return;

        const container = containerRef.current;
        if (!container) return;

        let renderer: THREE.WebGLRenderer | undefined;
        let animationId: number;
        let scene: THREE.Scene;
        let camera: THREE.PerspectiveCamera;
        let sphere: THREE.Mesh;
        let innerSphere: THREE.Mesh;
        let particlesMesh: THREE.Points;
        let initialized = false;

        const init = () => {
            if (container.clientWidth === 0 || container.clientHeight === 0) return;

            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
            camera.position.z = 6;

            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            container.appendChild(renderer.domElement);

            const coreGeo = new THREE.IcosahedronGeometry(2, 2);
            const coreMat = new THREE.MeshBasicMaterial({ 
                color: 0x45A29E, wireframe: true, transparent: true, opacity: 0.3 
            });
            sphere = new THREE.Mesh(coreGeo, coreMat);
            scene.add(sphere);

            const innerGeo = new THREE.IcosahedronGeometry(1.5, 1);
            const innerMat = new THREE.MeshBasicMaterial({
                color: 0x8860D0, wireframe: true, transparent: true, opacity: 0.1
            });
            innerSphere = new THREE.Mesh(innerGeo, innerMat);
            scene.add(innerSphere);

            const particlesGeo = new THREE.BufferGeometry();
            const particlesCount = 200;
            const posArray = new Float32Array(particlesCount * 3);
            for(let i = 0; i < particlesCount * 3; i++) {
                posArray[i] = (Math.random() - 0.5) * 8;
            }
            particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            const particlesMat = new THREE.PointsMaterial({
                size: 0.05, color: 0x66FCF1, transparent: true, opacity: 0.8
            });
            particlesMesh = new THREE.Points(particlesGeo, particlesMat);
            scene.add(particlesMesh);

            initialized = true;
            animate();
        };

        const animate = () => {
            if (!initialized || !renderer) return;
            animationId = requestAnimationFrame(animate);
            if (sphere) {
                sphere.rotation.x += 0.002;
                sphere.rotation.y += 0.003;
            }
            if (innerSphere) {
                innerSphere.rotation.x -= 0.002;
                innerSphere.rotation.y -= 0.002;
            }
            if (particlesMesh) {
                particlesMesh.rotation.y += 0.001;
            }
            if (sphere) {
                const scale = 1 + Math.sin(Date.now() * 0.001) * 0.05;
                sphere.scale.set(scale, scale, scale);
            }
            renderer.render(scene, camera);
        };

        const resizeObserver = new ResizeObserver((entries) => {
            if (!initialized) {
                init();
            } else if (renderer && camera && container) {
                 const width = container.clientWidth;
                 const height = container.clientHeight;
                 if (width === 0 || height === 0) return;
                 camera.aspect = width / height;
                 camera.updateProjectionMatrix();
                 renderer.setSize(width, height);
            }
        });
    
        resizeObserver.observe(container);

        return () => {
            resizeObserver.disconnect();
            cancelAnimationFrame(animationId);
            if (renderer) {
                renderer.dispose();
                if(container.contains(renderer.domElement)) {
                    container.removeChild(renderer.domElement);
                }
            }
        }
    }, []);

    if (isReducedMotion()) return <div className="w-full h-full absolute inset-0 flex items-center justify-center text-teal/30 font-bold border border-teal/20 rounded-xl">3D MODEL PAUSED</div>;

    return <div ref={containerRef} className="w-full h-full absolute inset-0" />;
});

// --- Neural Grid Component ---
export const NeuralGrid: React.FC = React.memo(() => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (isReducedMotion()) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        
        // Initial setup
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        let w = canvas.width;
        let h = canvas.height;
        
        const dots: {x: number, y: number, vx: number, vy: number}[] = [];
        // Create dots based on initial size
        const initDots = () => {
            dots.length = 0;
            const count = Math.min(50, Math.floor((w * h) / 20000)); // Reduced density for premium feel
            for(let i=0; i<count; i++) {
                dots.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3
                });
            }
        };
        initDots();

        const animate = () => {
            ctx.clearRect(0,0,w,h);
            // Subtle Teal tint
            ctx.fillStyle = 'rgba(69, 162, 158, 0.4)'; 
            ctx.strokeStyle = 'rgba(69, 162, 158, 0.08)';

            dots.forEach((dot, i) => {
                dot.x += dot.vx;
                dot.y += dot.vy;

                if(dot.x < 0 || dot.x > w) dot.vx *= -1;
                if(dot.y < 0 || dot.y > h) dot.vy *= -1;

                ctx.beginPath();
                ctx.arc(dot.x, dot.y, 1.2, 0, Math.PI*2);
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

    if (isReducedMotion()) return null;

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-20" />;
});
