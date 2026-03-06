/* ═══════════════════════════════════════════════
   SPARK PARTICLES SYSTEM (OPTIMIZED FOR SMOOTHNESS)
   ═══════════════════════════════════════════════ */

function createSparkBurst(count, centerX, centerY, spread = 400) {
    const colors = ['#00e5ff', '#ffffff', '#80deea'];
    const container = document.getElementById('viewport');

    // Flexbox offset correction (viewport is centered)
    const offsetX = -window.innerWidth / 2;
    const offsetY = -window.innerHeight / 2;

    const safeCount = Math.min(count, 40); // Capped for smooth performance

    for (let i = 0; i < safeCount; i++) {
        const spark = document.createElement('div');
        spark.className = 'spark';
        container.appendChild(spark);

        const size = Math.random() * 2 + 0.5;
        const rawX = centerX !== null && centerX !== undefined ? centerX : (window.innerWidth / 2 + (Math.random() - 0.5) * 200);
        const rawY = centerY !== null && centerY !== undefined ? centerY : (window.innerHeight / 2 + (Math.random() - 0.5) * 200);
        const startX = offsetX + rawX;
        const startY = offsetY + rawY;

        gsap.set(spark, {
            x: startX,
            y: startY,
            width: size,
            height: size,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            opacity: 1,
            scale: 1,
            force3D: true
        });

        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * spread;

        gsap.to(spark, {
            x: startX + Math.cos(angle) * distance,
            y: startY + Math.sin(angle) * distance,
            opacity: 0,
            scale: 0,
            duration: 1 + Math.random() * 1,
            ease: "power2.out",
            onComplete: () => spark.remove()
        });
    }
}

// Optimized ambient spark
function spawnAmbient(minX, maxX) {
    const colors = ['#00e5ff', '#ffffff', '#80deea'];
    const container = document.getElementById('viewport');
    const spark = document.createElement('div');
    spark.className = 'spark';
    container.appendChild(spark);

    const offsetX = -window.innerWidth / 2; // Corrects for flexbox centering
    const offsetY = -window.innerHeight / 2;

    const size = Math.random() * 2 + 0.8;
    const startX = offsetX + minX + Math.random() * (maxX - minX);
    const startY = offsetY + window.innerHeight * (0.4 + Math.random() * 0.6);

    gsap.set(spark, {
        x: startX,
        y: startY,
        width: size,
        height: size,
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        opacity: 0,
        scale: 0.5,
        force3D: true
    });

    gsap.to(spark, {
        y: startY - (150 + Math.random() * 300),
        x: startX + (Math.random() - 0.5) * 100,
        opacity: 0.7,
        scale: 1,
        duration: 3 + Math.random() * 3,
        ease: "none",
        onComplete: () => spark.remove()
    });
}

function createAmbientSpark() {
    spawnAmbient(0, window.innerWidth * 0.3);
    spawnAmbient(window.innerWidth * 0.35, window.innerWidth * 0.65);
    spawnAmbient(window.innerWidth * 0.7, window.innerWidth);
    setTimeout(createAmbientSpark, 500 + Math.random() * 300);
}

createAmbientSpark();

/* ═══════════════════════════════════════════════
   MASTER TIMELINE
   ═══════════════════════════════════════════════ */
// Master Timeline - now automatic instead of scroll-triggered, paused by default
const tl = gsap.timeline({ paused: true });

// Event listener for Enter key to start countdown
window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        tl.play();
    }
}, { once: true }); // Only trigger once

tl.to("#num3", {
    opacity: 0, scale: 2.5, duration: 1,
    onStart: () => createSparkBurst(15)
})
    .to("#num2", { opacity: 1, scale: 1, duration: 0.5 })
    .to("#num2", {
        opacity: 0, scale: 2.5, duration: 1,
        onStart: () => createSparkBurst(15)
    }, "+=0.3")
    .to("#num1", { opacity: 1, scale: 1, duration: 0.5 })
    .to("#num1", {
        opacity: 0, scale: 2.5, duration: 1,
        onStart: () => createSparkBurst(15)
    }, "+=0.3");

tl.to("#left-curtain", {
    xPercent: -35,
    yPercent: -5,
    scaleX: 0.5,
    rotation: -5,
    duration: 2,
    ease: "power2.inOut",
    force3D: true,
    transformOrigin: "left top"
})
    .to("#right-curtain", {
        xPercent: 35,
        yPercent: -5,
        scaleX: 0.5,
        rotation: 5,
        duration: 2,
        ease: "power2.inOut",
        force3D: true,
        transformOrigin: "right top"
    }, "<")
    .to("#countdown", { opacity: 0, duration: 0.5 }, "<")

    .to("#left-curtain", {
        xPercent: -130,
        yPercent: -30,
        scaleX: 0.1,
        scaleY: 0.9,
        rotation: -20,
        duration: 3,
        ease: "power2.inOut",
        force3D: true,
        onStart: () => createSparkBurst(30, 0, 0)
    })
    .to("#right-curtain", {
        xPercent: 130,
        yPercent: -30,
        scaleX: 0.1,
        scaleY: 0.9,
        rotation: 20,
        duration: 3,
        ease: "power2.inOut",
        force3D: true,
        onStart: () => createSparkBurst(30, window.innerWidth, 0)
    }, "<");
/* ─── Phase 4a : Center spark burst (anticipation) ─── */
tl.add(() => {
    // Wave 1: Tight center cluster
    createSparkBurst(40, window.innerWidth / 2, window.innerHeight / 2, 300);
    // Wave 2: Medium spread (slightly delayed)
    setTimeout(() => createSparkBurst(40, window.innerWidth / 2, window.innerHeight / 2, 500), 200);
    // Wave 3: Wide spread
    setTimeout(() => createSparkBurst(40, window.innerWidth / 2, window.innerHeight / 2, 700), 400);
});

/* ─── Phase 4b : Pause for spark buildup ─── */
tl.to({}, { duration: 2 }); // 2-second delay while sparks shimmer

/* ─── Phase 4c : Logo reveal (after sparks) ─── */
tl.to("#logo-area", {
    opacity: 1,
    scale: 1,
    duration: 1.5,
});

/* ─── Phase 4d : Logo unblur ─── */
tl.to("#logo-area", {
    filter: "blur(0px)",
    duration: 1,
    ease: "power1.inOut"
});

tl.to("#logo-area", { y: -80, scale: 0.85, duration: 2 })
    .to("#title-area", {
        opacity: 1,
        y: 0,
        duration: 2,
        ease: "power2.out",
        onStart: () => {
            createSparkBurst(30, window.innerWidth / 2, window.innerHeight * 0.7, 400);
        }
    }, "<");
