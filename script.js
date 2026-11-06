/* ==========================================================
   تنظیمات مشترک
   ========================================================== */
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ==========================================================
   ۱. منوی ناوبری
   ========================================================== */
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelectorAll(".main-nav a");
const sections = document.querySelectorAll("main section[id]");

// بستن منوی موبایل بعد از انتخاب لینک
navLinks.forEach(link => {
    link.addEventListener("click", () => {
        if (menuToggle) menuToggle.checked = false;
    });
});

// تشخیص بخش فعال و تغییر لینک فعال منو
const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        navLinks.forEach(link => {
            link.classList.toggle("active", link.hash === `#${entry.target.id}`);
        });
    });
}, {
    rootMargin: "-30% 0px -60% 0px"
});

sections.forEach(section => sectionObserver.observe(section));

/* ==========================================================
   ۲. ظاهر شدن بخش‌ها هنگام اسکرول
   ========================================================== */
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
    });
}, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
});

document.querySelectorAll("main section:not(#home)").forEach(section => {
    [...section.children].forEach((element, index) => {
        element.classList.add("reveal-on-scroll");
        element.style.transitionDelay = `${Math.min(index * 120, 360)}ms`;
        revealObserver.observe(element);
    });
});

/* ==========================================================
   ۳. برف شناور در پس‌زمینه
   ========================================================== */
if (!prefersReducedMotion) {
    const SNOWFLAKE_COUNT = 24;
    const snowLayer = document.createElement("div");

    snowLayer.className = "snow-layer";
    snowLayer.setAttribute("aria-hidden", "true");

    for (let i = 0; i < SNOWFLAKE_COUNT; i++) {
        const snowflake = document.createElement("span");
        const size = Math.random() * 4 + 2;
        const duration = Math.random() * 12 + 12;

        snowflake.className = "snowflake";
        snowflake.style.left = `${Math.random() * 100}%`;
        snowflake.style.width = `${size}px`;
        snowflake.style.height = `${size}px`;
        snowflake.style.opacity = Math.random() * 0.5 + 0.25;
        snowflake.style.animationDuration = `${duration}s`;
        snowflake.style.animationDelay = `${-Math.random() * duration}s`;
        snowflake.style.setProperty("--drift", `${Math.random() * 100 - 50}px`);

        snowLayer.appendChild(snowflake);
    }

    document.body.appendChild(snowLayer);
}

/* ==========================================================
   ۴. گل شیشه‌ای دنبال‌کننده موس (فقط دسکتاپ)
   ========================================================== */
if (hasFinePointer && !prefersReducedMotion) {
    const MIN_DISTANCE = 18;

    const flowerSVG = `
        <svg viewBox="0 0 40 40" aria-hidden="true">
            <path d="M20 2 C23 10 25 12 33 10 C29 17 30 20 38 20
                     C30 23 29 26 33 33 C25 29 23 30 20 38
                     C17 30 15 29 7 33 C11 26 10 23 2 20
                     C10 17 11 14 7 7 C15 11 17 10 20 2 Z"/>
            <path d="M20 5 L20 35 M5 20 L35 20 M9 9 L31 31 M31 9 L9 31" fill="none"/>
            <circle cx="20" cy="20" r="2.5"/>
        </svg>
    `;

    let lastX = 0;
    let lastY = 0;

    document.addEventListener("pointermove", event => {
        const distance = Math.hypot(event.clientX - lastX, event.clientY - lastY);
        if (distance < MIN_DISTANCE) return;

        lastX = event.clientX;
        lastY = event.clientY;

        const flower = document.createElement("span");
        flower.className = "cursor-trail";
        flower.innerHTML = flowerSVG;
        flower.style.left = `${event.clientX - 12}px`;
        flower.style.top = `${event.clientY - 12}px`;

        document.body.appendChild(flower);
        flower.addEventListener("animationend", () => flower.remove(), { once: true });
    });
}