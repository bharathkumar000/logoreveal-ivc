gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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
const tl = gsap.timeline({
    scrollTrigger: {
        trigger: "#spacer",
        start: "top top",
        end: "bottom bottom",
        scrub: 2, // Smooth but responsive
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

tl.add(() => {
    createSparkBurst(40, window.innerWidth / 2, window.innerHeight / 2, 300);
    setTimeout(() => createSparkBurst(40, window.innerWidth / 2, window.innerHeight / 2, 500), 200);
    setTimeout(() => createSparkBurst(40, window.innerWidth / 2, window.innerHeight / 2, 700), 400);
});

tl.to({}, { duration: 2 });

tl.to("#logo-area", {
    opacity: 1,
    scale: 1,
    duration: 1.5,
});

tl.to("#logo-area", {
    filter: "blur(0px)",
    duration: 1,
    ease: "power1.inOut"
});

tl.to("#logo-area", { y: -40, scale: 1, duration: 2 })
    .to("#title-area", {
        opacity: 1,
        y: 0,
        duration: 2,
        ease: "power2.out",
        onStart: () => {
            createSparkBurst(30, window.innerWidth / 2, window.innerHeight * 0.7, 400);
        }
    }, "<");

// Track the auto-scroll tween so we can kill it on reset
let autoScrollTween = null;
let isAnimating = false;

function resetAnimation() {
    // Kill any running auto-scroll
    if (autoScrollTween) {
        autoScrollTween.kill();
        autoScrollTween = null;
    }

    // Remove any lingering spark elements
    document.querySelectorAll('.spark').forEach(s => s.remove());

    // Instantly scroll to top
    window.scrollTo(0, 0);

    // Reset the ScrollTrigger so it re-reads the scroll position
    ScrollTrigger.refresh();

    // Reset all animated elements to their initial CSS states
    gsap.set("#num3", { opacity: 1, scale: 1 });
    gsap.set("#num2", { opacity: 0, scale: 0.5 });
    gsap.set("#num1", { opacity: 0, scale: 0.5 });
    gsap.set("#countdown", { opacity: 1 });
    gsap.set("#left-curtain", { xPercent: 0, yPercent: 0, scaleX: 1, scaleY: 1, rotation: 0 });
    gsap.set("#right-curtain", { xPercent: 0, yPercent: 0, scaleX: 1, scaleY: 1, rotation: 0 });
    gsap.set("#logo-area", { opacity: 0, scale: 0.5, filter: "blur(20px)", y: 0 });
    gsap.set("#title-area", { opacity: 0, y: 40 });
}

function startAnimation() {
    // Small delay to let the scroll reset settle before auto-scrolling
    setTimeout(() => {
        autoScrollTween = gsap.to(window, {
            scrollTo: { y: document.body.scrollHeight, autoKill: false },
            duration: 15,
            ease: "power1.inOut",
            onComplete: () => {
                isAnimating = false;
            }
        });
    }, 100);
}

// Event listener for Enter key — repeatable
window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (isAnimating) {
            // If already animating, reset first then replay
            resetAnimation();
            // Give a brief moment for reset to apply
            setTimeout(() => {
                isAnimating = true;
                startAnimation();
            }, 200);
        } else {
            isAnimating = true;
            resetAnimation();
            setTimeout(() => {
                startAnimation();
            }, 200);
        }
    }
});
