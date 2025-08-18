"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

export default function NeonParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // تنظیم اندازه canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // به‌روزرسانی تعداد ذرات بر اساس اندازه جدید
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      
      let newParticleCount = 100; // دسکتاپ
      if (isMobile) {
        newParticleCount = 30; // موبایل
      } else if (isTablet) {
        newParticleCount = 60; // تبلت
      }
      
      // اگر تعداد ذرات تغییر کرده، ذرات جدید ایجاد کن
      if (particlesRef.current.length !== newParticleCount) {
        const newParticles: Particle[] = [];
        for (let i = 0; i < newParticleCount; i++) {
          newParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.1,
            vy: (Math.random() - 0.5) * 0.1,
            size: Math.random() * 2 + 1,
          });
        }
        particlesRef.current = newParticles;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // ایجاد ذرات
    const particles: Particle[] = [];
    // تعداد ذرات بر اساس اندازه صفحه
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    
    let particleCount = 100; // دسکتاپ
    if (isMobile) {
      particleCount = 30; // موبایل
    } else if (isTablet) {
      particleCount = 60; // تبلت
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
        size: Math.random() * 2 + 1,
      });
    }

    particlesRef.current = particles;

    // ردیابی موس
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);

    // انیمیشن
    let animationId: number;

    const animate = () => {
      // پاک‌سازی با شفافیت کم برای افکت trail
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // به‌روزرسانی و رسم ذرات
      particles.forEach((particle) => {
        // نیروی موس
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 200;

                 if (distance < maxDistance) {
           const force = 0.1;
           const angle = Math.atan2(dy, dx);
           particle.vx += Math.cos(angle) * force * (1 - distance / maxDistance);
           particle.vy += Math.sin(angle) * force * (1 - distance / maxDistance);
         }

        // محدود کردن سرعت
        const maxSpeed = 0.8;
        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (speed > maxSpeed) {
          particle.vx = (particle.vx / speed) * maxSpeed;
          particle.vy = (particle.vy / speed) * maxSpeed;
        }

        // به‌روزرسانی موقعیت
        particle.x += particle.vx;
        particle.y += particle.vy;

        // مرزها
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // نگه داشتن ذرات در صفحه
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        // رسم ذره
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        // گرادیان شعاعی برای درخشش
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        );
        gradient.addColorStop(0, "rgba(0, 102, 255, 0.8)");
        gradient.addColorStop(0.5, "rgba(0, 102, 255, 0.3)");
        gradient.addColorStop(1, "rgba(0, 102, 255, 0)");
        
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // رسم خطوط اتصال
      particles.forEach((particle1, i) => {
        particles.slice(i + 1).forEach((particle2) => {
          const dx = particle1.x - particle2.x;
          const dy = particle1.y - particle2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxConnectionDistance = 150;

          if (distance < maxConnectionDistance) {
            const opacity = 1 - distance / maxConnectionDistance;
            
            // خط اصلی
            ctx.beginPath();
            ctx.moveTo(particle1.x, particle1.y);
            ctx.lineTo(particle2.x, particle2.y);
            ctx.strokeStyle = `rgba(0, 102, 255, ${opacity * 0.3})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // لایه glow
            ctx.beginPath();
            ctx.moveTo(particle1.x, particle1.y);
            ctx.lineTo(particle2.x, particle2.y);
            ctx.strokeStyle = `rgba(0, 102, 255, ${opacity * 0.1})`;
            ctx.lineWidth = 3;
            ctx.stroke();
          }
        });
      });

      // رسم خطوط به موس
      particles.forEach((particle) => {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxMouseDistance = 200;

        if (distance < maxMouseDistance) {
          const opacity = 1 - distance / maxMouseDistance;
          const lineWidth = 1 + (opacity * 3); // 1 تا 4 پیکسل

          // خط اصلی به موس
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(0, 102, 255, ${opacity * 0.8})`;
          ctx.lineWidth = lineWidth;
          ctx.stroke();

          // glow خط به موس
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(0, 102, 255, ${opacity * 0.3})`;
          ctx.lineWidth = lineWidth * 2;
          ctx.stroke();
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
}
