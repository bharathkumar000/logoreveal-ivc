gsap.registerPlugin(ScrollTrigger);

// Force scroll to top on every refresh for start of animation
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);


/* ═══════════════════════════════════════════════
   SPARK PARTICLES SYSTEM (OPTIMIZED FOR SMOOTHNESS)
   ═══════════════════════════════════════════════ */

function createSparkBurst(count, centerX, centerY, spread = 400) {
    const colors = ['#00e5ff', '#ffffff', '#80deea'];
    const container = document.getElementById('viewport');

    // Increased cap for a more satisfying 'pop' while staying smooth
    const safeCount = Math.min(count, 80);

    for (let i = 0; i < safeCount; i++) {
        const spark = document.createElement('div');
        spark.className = 'spark';
        container.appendChild(spark);

        const size = Math.random() * 3 + 1;
        const startX = centerX !== null && centerX !== undefined ? centerX : (window.innerWidth / 2 + (Math.random() - 0.5) * 200);
        const startY = centerY !== null && centerY !== undefined ? centerY : (window.innerHeight / 2 + (Math.random() - 0.5) * 200);

        gsap.set(spark, {
            x: startX,
            y: startY,
            width: size,
            height: size,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            opacity: 1,
            scale: 1
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

    const size = Math.random() * 4 + 1.5; // Slightly larger for better visibility
    const startX = minX + Math.random() * (maxX - minX);
    const startY = Math.random() * window.innerHeight;

    gsap.set(spark, {
        x: startX,
        y: startY,
        width: size,
        height: size,
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        opacity: 0,
        scale: 0.5
    });

    gsap.to(spark, {
        y: startY - (100 + Math.random() * 200),
        x: startX + (Math.random() - 0.5) * 100,
        opacity: 0.6,
        scale: 1.2,
        duration: 4 + Math.random() * 4,
        ease: "none",
        onComplete: () => {
            gsap.to(spark, { opacity: 0, duration: 1, onComplete: () => spark.remove() });
        }
    });
}

function createAmbientSpark() {
    // High-density ambient sparks (increased loop to 4 for inauguration feel)
    for (let i = 0; i < 4; i++) {
        // Explicitly heavy on the LEFT EDGE as requested
        spawnAmbient(0, window.innerWidth * 0.35);
        spawnAmbient(0, window.innerWidth * 0.20); // Extra Left layer

        // Right Edge
        spawnAmbient(window.innerWidth * 0.8, window.innerWidth);

        // Wide Center Atmosphere (Center 60%)
        const middleWidth = window.innerWidth * 0.6;
        const middleStart = (window.innerWidth - middleWidth) / 2;
        spawnAmbient(middleStart, middleStart + middleWidth);
    }

    // Fast but steady timing for an immersive feel
    setTimeout(createAmbientSpark, 200 + Math.random() * 300);
}

createAmbientSpark();

/* ═══════════════════════════════════════════════
   MASTER TIMELINE
   ═══════════════════════════════════════════════ */
const tl = gsap.timeline({
    scrollTrigger: {
        trigger: "#spacer",
        start: "top top",
        end: "bottom bottom",
        scrub: 3.5, // Increased scrub for slowed-down, majestic inauguration feel
    }
});

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

tl.to("#logo-area", {
    opacity: 1,
    scale: 1,
    duration: 1.5,
    onStart: () => {
        // High-density center pop
        createSparkBurst(80, window.innerWidth / 2, window.innerHeight / 2, 600);
    }
});

tl.to("#logo-area", {
    filter: "blur(0px)",
    duration: 1, // Faster unblur
    ease: "power1.inOut"
});

tl.to("#logo-area", { y: -50, scale: 0.65, duration: 2 })
    .to("#title-area", {
        opacity: 1,
        y: 0,
        duration: 2,
        ease: "power2.out",
        onStart: () => {
            // Celebratory center burst
            createSparkBurst(60, window.innerWidth / 2, window.innerHeight * 0.7, 500);
        }
    }, "<");
