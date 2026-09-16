const body = document.body;
const themeSwitch = document.getElementById("theme-switch");

function applySavedTheme() {
    const savedTheme = localStorage.getItem("portfolio-theme") || "dark";

    if (savedTheme === "light") {
        body.classList.add("light-mode");
        if (themeSwitch) {
            themeSwitch.setAttribute("aria-pressed", "true");
        }
    }
}

function updateTheme() {
    const isLight = body.classList.toggle("light-mode");

    if (themeSwitch) {
        themeSwitch.setAttribute("aria-pressed", String(isLight));
    }

    localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
}

async function copyEmailToClipboard(email) {
    try {
        await navigator.clipboard.writeText(email);
    } catch (error) {
        const tempInput = document.createElement("textarea");
        tempInput.value = email;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
    }
}

function showCopyToast(message) {
    const toast = document.getElementById("copy-toast");

    if (!toast) {
        return;
    }

    const toastText = toast.querySelector(".toast-text");

    if (toastText) {
        toastText.textContent = message;
    }

    toast.classList.add("show");

    window.setTimeout(() => {
        toast.classList.remove("show");
    }, 1800);
}

function setupEmailCopy() {
    const emailLinks = document.querySelectorAll(".email-copy");

    if (!emailLinks.length) {
        return;
    }

    emailLinks.forEach((emailLink) => {
        emailLink.addEventListener("click", async (event) => {
            event.preventDefault();
            const email = emailLink.dataset.email;

            try {
                await copyEmailToClipboard(email);
                showCopyToast("Email copied");
            } catch (error) {
                showCopyToast("Copy failed");
            }
        });
    });
}

function setupResumeButton() {
    const resumeLink = document.querySelector(".resume-link");

    if (!resumeLink) {
        return;
    }

    resumeLink.addEventListener("click", (event) => {
        event.preventDefault();
        showCopyToast("Resume opened");

        window.setTimeout(() => {
            window.open(resumeLink.href, "_blank");
        }, 250);
    });
}

function setupContactForm() {
    const contactForm = document.querySelector(".contact-form");

    if (!contactForm) {
        return;
    }

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!contactForm.checkValidity()) {
            showCopyToast("Please complete all fields");
            return;
        }

        const formData = new FormData(contactForm);
        const name = (formData.get("name") || "").toString().trim();
        const email = (formData.get("email") || "").toString().trim();
        const message = (formData.get("message") || "").toString().trim();

        const subject = encodeURIComponent(`Portfolio inquiry from ${name || "Visitor"}`);
        const body = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        );

        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent("carlos.alcantara.iii.27@gmail.com")}&su=${subject}&body=${body}`;
        const gmailWindow = window.open(gmailUrl, "_blank", "noopener,noreferrer");

        if (!gmailWindow) {
            window.location.href = `mailto:carlos.alcantara.iii.27@gmail.com?subject=${subject}&body=${body}`;
        }

        showCopyToast("Opening Gmail");
        contactForm.reset();
    });
}

function setupScrollTopButton() {
    const scrollButton = document.getElementById("scroll-top");

    if (!scrollButton) {
        return;
    }

    function updateScrollButton() {
        const visible = window.scrollY > window.innerHeight * 0.4;
        scrollButton.classList.toggle("visible", visible);
    }

    updateScrollButton();
    window.addEventListener("scroll", updateScrollButton);

    scrollButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

function setupCertificationsCarousel() {
    const carousel = document.querySelector(".certifications-carousel");

    if (!carousel) {
        return;
    }

    const cards = Array.from(carousel.querySelectorAll(".certification-card"));
    const previousButton = carousel.querySelector(".certification-previous");
    const nextButton = carousel.querySelector(".certification-next");
    let currentIndex = 0;

    function showCertification(index, direction = "next") {
        currentIndex = (index + cards.length) % cards.length;

        cards.forEach((card, cardIndex) => {
            const isActive = cardIndex === currentIndex;
            card.classList.toggle("is-active", isActive);
            card.classList.toggle("slide-from-left", isActive && direction === "previous");
            card.classList.toggle("slide-from-right", isActive && direction === "next");
            card.setAttribute("aria-hidden", String(!isActive));
        });
    }

    previousButton.addEventListener("click", () => {
        showCertification(currentIndex - 1, "previous");
    });

    nextButton.addEventListener("click", () => {
        showCertification(currentIndex + 1, "next");
    });

    showCertification(currentIndex);
}

function setupScrollReveal() {
    const revealItems = document.querySelectorAll("main > section:not(#hero)");

    if (!revealItems.length) {
        return;
    }

    revealItems.forEach((item) => {
        item.classList.add("scroll-reveal");
    });

    if (!("IntersectionObserver" in window)) {
        revealItems.forEach((item) => item.classList.add("is-visible"));
        return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -40px"
    });

    revealItems.forEach((item) => revealObserver.observe(item));
}

if (themeSwitch) {
    applySavedTheme();
    themeSwitch.addEventListener("click", updateTheme);
}

setupEmailCopy();
setupResumeButton();
setupContactForm();
setupScrollTopButton();
setupCertificationsCarousel();
setupScrollReveal();
