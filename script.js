import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

  // --------------------------------
  // HERO MENU
  // --------------------------------
  const heroMenuButton = document.querySelector(".hero-menu-button");
  const heroMenuOverlay = document.querySelector(".hero-menu-overlay");
  const heroMenuClose = document.querySelector(".hero-menu-close");
  const heroMenuLinks = document.querySelectorAll(".hero-menu-nav a");

  function openHeroMenu() {
    if (!heroMenuButton || !heroMenuOverlay) return;

    heroMenuOverlay.classList.add("is-open");
    heroMenuButton.classList.add("is-hidden");
    heroMenuButton.setAttribute("aria-expanded", "true");
    heroMenuOverlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("hero-menu-open");
  }

  function closeHeroMenu() {
    if (!heroMenuButton || !heroMenuOverlay) return;

    heroMenuOverlay.classList.remove("is-open");
    heroMenuButton.classList.remove("is-hidden");
    heroMenuButton.setAttribute("aria-expanded", "false");
    heroMenuOverlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("hero-menu-open");
  }

  if (heroMenuButton && heroMenuOverlay) {
    heroMenuButton.addEventListener("click", openHeroMenu);
  }

  if (heroMenuClose) {
    heroMenuClose.addEventListener("click", closeHeroMenu);
  }

  heroMenuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeHeroMenu();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && heroMenuOverlay?.classList.contains("is-open")) {
      closeHeroMenu();
    }
  });

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const progressRail = document.querySelector(".page-progress");
  const progressDot = document.querySelector(".page-progress-dot");

  const setProgressDot = (progress) => {
    if (!progressRail || !progressDot) return;
    const clamped = Math.min(Math.max(progress, 0), 1);
    const railHeight = progressRail.clientHeight;
    const dotHeight = progressDot.offsetHeight;
    const maxTravel = Math.max(railHeight - dotHeight, 0);
    progressDot.style.transform = `translate(-50%, ${maxTravel * clamped}px)`;
  };

  const syncFromWindowScroll = () => {
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    setProgressDot(progress);
  };

  const lenis = new Lenis();

  const heroRoot = document.querySelector(".css-b45nl7");
  const heroContentBlock = document.querySelector(".css-fmco55");
  const heroShowreelBlock = document.querySelector(".css-157o6oq");
  const heroCardWrap = document.querySelector(
    ".styles_clipPath_wrapper__2EjOL"
  );
  const heroCard = document.querySelector(
    ".styles_clipPath_wrapper_figure__thifo"
  );
  const heroImage = document.querySelector(".styles_content_image__bvRpE");
  const heroProgressWrap = document.querySelector(".css-1ff90ps");
  const heroProgressBar = document.querySelector(".css-lnwywb");
  const heroScrollTarget = document.getElementById("home-hero-scroll-target");

  const heroMuteButton =
    document.querySelector(".VideoControl_iconInner__wCHTN") ||
    document.querySelector(".css-lp5lkp");

  const heroMuteIcon = document.querySelector(
    ".VideoControl_icon__mute__9AGnd"
  );
  const heroUnmuteIcon = document.querySelector(
    ".VideoControl_icon__unmute__fkfIM"
  );

  const heroLines = document.querySelectorAll(".line");
  const heroLineMasks = document.querySelectorAll(".line-mask");

  // --------------------------------
  // HERO BACKGROUND SHAPES STATE
  // --------------------------------
  const heroBgState = {
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
  };

  function updateHeroCursorTargets(event) {
    if (!heroRoot) return;

    const rect = heroRoot.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    heroBgState.targetX = (px - 0.5) * 2;
    heroBgState.targetY = (py - 0.5) * 2;
  }

  function resetHeroCursorTargets() {
    heroBgState.targetX = 0;
    heroBgState.targetY = 0;
  }

  function updateHeroBackgroundShapes() {
    if (!heroRoot) return;

    heroBgState.currentX += (heroBgState.targetX - heroBgState.currentX) * 0.08;
    heroBgState.currentY += (heroBgState.targetY - heroBgState.currentY) * 0.08;

    const leftX = heroBgState.currentX * -20;
    const leftY = heroBgState.currentY * 14;
    const leftR = heroBgState.currentX * -3;
    const leftS = 1 + Math.abs(heroBgState.currentX) * 0.015;

    const rightX = heroBgState.currentX * 24;
    const rightY = heroBgState.currentY * -18;
    const rightR = heroBgState.currentX * 3.5;
    const rightS = 1 + Math.abs(heroBgState.currentY) * 0.015;

    heroRoot.style.setProperty("--shape-left-x", `${leftX}px`);
    heroRoot.style.setProperty("--shape-left-y", `${leftY}px`);
    heroRoot.style.setProperty("--shape-left-r", `${leftR}deg`);
    heroRoot.style.setProperty("--shape-left-s", `${leftS}`);

    heroRoot.style.setProperty("--shape-right-x", `${rightX}px`);
    heroRoot.style.setProperty("--shape-right-y", `${rightY}px`);
    heroRoot.style.setProperty("--shape-right-r", `${rightR}deg`);
    heroRoot.style.setProperty("--shape-right-s", `${rightS}`);
  }

  // --------------------------------
  // HERO SCROLL
  // --------------------------------
  const handleHeroScroll = () => {
    if (!heroRoot) return;

    const rect = heroRoot.getBoundingClientRect();
    const heroHeight = rect.height || window.innerHeight;
    const visibleProgress = Math.min(Math.max(-rect.top / heroHeight, 0), 1);

    if (heroProgressBar) {
      heroProgressBar.style.transform = `scaleX(${visibleProgress})`;
    }

    if (heroContentBlock) {
      const y = visibleProgress * 40;
      const opacity = 1 - visibleProgress * 0.35;
      heroContentBlock.style.transform = `translateY(${y}px)`;
      heroContentBlock.style.opacity = `${opacity}`;
    }

    if (heroCardWrap) {
      const scrollY = visibleProgress * 20;
      heroCardWrap.style.transform = `translate(-50%, calc(-50% + ${scrollY}px))`;
    }

    if (heroImage) {
      const y = visibleProgress * 20;
      heroImage.style.transform = `translate(0px, ${y}px)`;
    }

    heroRoot.style.setProperty("--shape-scroll", `${visibleProgress}`);
  };

  lenis.on("scroll", (e) => {
    ScrollTrigger.update();
    if (typeof e?.progress === "number") {
      setProgressDot(e.progress);
    } else {
      syncFromWindowScroll();
    }

    handleHeroScroll();
  });

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  // background shapes ticker
  gsap.ticker.add(() => {
    updateHeroBackgroundShapes();
  });

  gsap.ticker.lagSmoothing(0);
  window.addEventListener("resize", syncFromWindowScroll);
  syncFromWindowScroll();

  const videoSection = document.querySelector(".video.u-section");
  const videoFrame = document.querySelector(".video .c-video");
  const videoWrapper = document.querySelector(".video .video_wrapper");
  const videoPlayer = document.querySelector(".video .video_plyr");

  if (videoSection && videoFrame && videoWrapper && videoPlayer) {
    const getRevealWidth = () => Math.min(window.innerWidth * 0.9, 1800);
    const getRevealHeight = () => Math.min(window.innerHeight * 0.42, 420);

    const getCoverScale = () => {
      const frameWidth = getRevealWidth() || 1;
      const frameHeight = getRevealHeight() || 1;
      return Math.max(
        window.innerWidth / frameWidth,
        window.innerHeight / frameHeight
      );
    };

    gsap.set(videoFrame, {
      width: "min(88vw, 96rem)",
      height: "1.9rem",
    });

    const videoTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: videoSection,
        start: "top center",
        end: "bottom bottom",
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    videoTimeline
      .to(
        videoFrame,
        {
          width: () => getRevealWidth(),
          height: () => getRevealHeight(),
          ease: "power2.out",
          duration: 0.24,
        },
        0
      )
      .to(
        videoWrapper,
        {
          borderRadius: "1.8rem",
          ease: "power2.out",
          duration: 0.24,
        },
        0
      )
      .to(
        videoWrapper,
        {
          "--line-opacity": 0,
          ease: "none",
          duration: 0.01,
        },
        0.16
      )
      .to(
        videoPlayer,
        {
          opacity: 1,
          scale: 1,
          ease: "power1.out",
          duration: 0.16,
        },
        0.09
      )
      .to(
        videoFrame,
        {
          scale: () => getCoverScale(),
          ease: "none",
          duration: 0.16,
        },
        0.24
      )
      .to(
        videoWrapper,
        {
          borderRadius: 0,
          ease: "none",
          duration: 0.2,
        },
        0.24
      )
      .to({}, { duration: 0.68 })
      .to(
        videoFrame,
        {
          yPercent: -22,
          ease: "none",
          duration: 0.18,
        },
        0.92
      )
      .to(
        videoWrapper,
        {
          opacity: 0.94,
          ease: "none",
          duration: 0.18,
        },
        0.92
      );
  }

  const cards = document.querySelectorAll(".sticky-cards .card");
  const totalCards = cards.length;
  const segmentSize = totalCards > 0 ? 1 / totalCards : 1;

  const cardYOffset = 5;
  const cardScaleStep = 0.075;

  cards.forEach((card, i) => {
    gsap.set(card, {
      xPercent: -50,
      yPercent: -50 + i * cardYOffset,
      scale: 1 - i * cardScaleStep,
    });
  });

  if (cards.length > 0) {
    ScrollTrigger.create({
      trigger: ".sticky-cards",
      start: "top top",
      end: `+=${window.innerHeight * 3.8}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        const activeIndex = Math.min(
          Math.floor(progress / segmentSize),
          totalCards - 1
        );

        const segProgress =
          (progress - activeIndex * segmentSize) / segmentSize;

        cards.forEach((card, i) => {
          if (i < activeIndex) {
            gsap.set(card, {
              yPercent: -250,
              rotationX: 35,
            });
          } else if (i === activeIndex) {
            gsap.set(card, {
              yPercent: gsap.utils.interpolate(-50, -200, segProgress),
              rotationX: gsap.utils.interpolate(0, 35, segProgress),
              scale: 1,
            });
          } else {
            const behindIndex = i - activeIndex;
            const currentYOffset =
              (behindIndex - segProgress) * cardYOffset;
            const currentScale =
              1 - (behindIndex - segProgress) * cardScaleStep;

            gsap.set(card, {
              yPercent: -50 + currentYOffset,
              rotationX: 0,
              scale: currentScale,
            });
          }
        });
      },
    });
  }

  const wrap = document.querySelector("footer");
  const ball = document.querySelector(".c-masked .is-masked");

  const state = {
    currentX: 50,
    currentY: 50,
    targetX: 50,
    targetY: 50,
    inside: false,
    ballRadius: 65,
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function pointInsideRect(x, y, rect) {
    return (
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
    );
  }

  function getConstrainedPoint(mouseX, mouseY, rect, padding) {
    const localX = mouseX - rect.left;
    const localY = mouseY - rect.top;

    const x = clamp(localX, padding, rect.width - padding);
    const y = clamp(localY, padding, rect.height - padding);

    return {
      xPercent: (x / rect.width) * 100,
      yPercent: (y / rect.height) * 100,
    };
  }

  function updateTargetFromMouse(clientX, clientY) {
    if (!wrap || !ball) return;

    const rect = wrap.getBoundingClientRect();
    const padding = state.ballRadius;

    state.inside = pointInsideRect(clientX, clientY, rect);

    const p = getConstrainedPoint(clientX, clientY, rect, padding);
    state.targetX = p.xPercent;
    state.targetY = p.yPercent;
  }

  function setInitialPosition() {
    state.currentX = 50;
    state.currentY = 50;
    state.targetX = 50;
    state.targetY = 50;

    if (!ball) return;

    gsap.set(ball, {
      "--xpercent": `${state.currentX}%`,
      "--ypercent": `${state.currentY}%`,
    });
  }

  gsap.ticker.add(() => {
    if (!ball) return;

    state.currentX += (state.targetX - state.currentX) * 0.14;
    state.currentY += (state.targetY - state.currentY) * 0.14;

    gsap.set(ball, {
      "--xpercent": `${state.currentX}%`,
      "--ypercent": `${state.currentY}%`,
    });
  });

  if (wrap && ball) {
    wrap.addEventListener("mousemove", (e) => {
      updateTargetFromMouse(e.clientX, e.clientY);
    });

    setInitialPosition();
  }

  const foundersGrid = document.querySelector(".founders-grid");
  const founderCards = Array.from(
    document.querySelectorAll(".founders-grid .founder-card")
  );
  const foundersDesktopQuery = window.matchMedia("(min-width: 1001px)");

  function resetFounderCardTransforms() {
    founderCards.forEach((card) => {
      card.classList.remove("is-active");
      card.style.setProperty("--push-x", "0px");
      card.style.setProperty("--push-y", "0px");
      card.style.setProperty("--push-r", "0deg");
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
      card.style.setProperty("--hover-lift", "0px");
    });

    if (foundersGrid) {
      foundersGrid.classList.remove("has-active");
    }
  }

  if (foundersGrid && founderCards.length > 0) {
    founderCards.forEach((card, index) => {
      card.addEventListener("mouseenter", () => {
        if (!foundersDesktopQuery.matches) return;

        foundersGrid.classList.add("has-active");
        card.classList.add("is-active");

        founderCards.forEach((peerCard, peerIndex) => {
          if (peerIndex === index) return;

          const distance = Math.abs(peerIndex - index);
          const direction = peerIndex > index ? 1 : -1;
          const pushX = direction * (1 + distance * 0.9);
          const pushY = distance * 0.35;
          const pushR = direction * distance * 1.4;

          peerCard.style.setProperty("--push-x", `${pushX}rem`);
          peerCard.style.setProperty("--push-y", `${pushY}rem`);
          peerCard.style.setProperty("--push-r", `${pushR}deg`);
        });
      });

      card.addEventListener("mousemove", (event) => {
        if (!foundersDesktopQuery.matches) return;

        const rect = card.getBoundingClientRect();
        const offsetX = (event.clientX - rect.left) / rect.width;
        const offsetY = (event.clientY - rect.top) / rect.height;
        const tiltY = (offsetX - 0.5) * 14;
        const tiltX = (0.5 - offsetY) * 10;

        card.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
        card.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
      });

      card.addEventListener("mouseleave", () => {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
        card.classList.remove("is-active");

        founderCards.forEach((peerCard) => {
          peerCard.style.setProperty("--push-x", "0px");
          peerCard.style.setProperty("--push-y", "0px");
          peerCard.style.setProperty("--push-r", "0deg");
        });

        foundersGrid.classList.remove("has-active");
      });
    });

    foundersDesktopQuery.addEventListener("change", () => {
      resetFounderCardTransforms();
    });
  }

  const foundersSection = document.querySelector(".founders.u-section");
  const foundersHeadline = document.querySelector(
    ".founders .founders-headline"
  );
  const foundersIntro = document.querySelector(".founders .founders-intro");
  const foundersGrey = document.querySelectorAll(".founders .text-grey");

  if (foundersSection && foundersHeadline && foundersIntro) {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: foundersSection,
          start: "80% bottom",
          end: "bottom bottom",
          scrub: 1,
        },
      })
      .to(
        foundersSection,
        {
          backgroundColor: "#0b0b0b",
          color: "#f5f1e8",
          ease: "none",
        },
        0
      )
      .to(
        foundersGrey,
        {
          color: "rgba(245, 241, 232, 0.55)",
          ease: "none",
        },
        0
      )
      .to(
        foundersIntro,
        {
          color: "rgba(245, 241, 232, 0.82)",
          ease: "none",
        },
        0
      );
  }

  // --------------------------------
  // HERO SETUP
  // --------------------------------
  function setupHeroInitialStates() {
    heroLines.forEach((line, index) => {
      gsap.set(line, {
        yPercent: 110,
        opacity: 0,
      });

      line.style.transition =
        "transform 0.9s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.9s ease";
      line.style.transitionDelay = `${index * 0.12}s`;
    });

    if (heroShowreelBlock) {
      gsap.set(heroShowreelBlock, {
        opacity: 0,
        y: 30,
      });
    }

    if (heroMuteIcon) {
      heroMuteIcon.style.display = "block";
    }

    if (heroUnmuteIcon) {
      heroUnmuteIcon.style.display = "none";
    }

    if (heroProgressWrap) {
      heroProgressWrap.style.transformOrigin = "left center";
    }

    if (heroProgressBar) {
      heroProgressBar.style.transformOrigin = "left center";
      heroProgressBar.style.transform = "scaleX(0)";
    }

    heroLineMasks.forEach((mask) => {
      mask.style.overflow = "hidden";
    });

    if (heroRoot) {
      heroRoot.style.setProperty("--shape-left-x", "0px");
      heroRoot.style.setProperty("--shape-left-y", "0px");
      heroRoot.style.setProperty("--shape-left-r", "0deg");
      heroRoot.style.setProperty("--shape-left-s", "1");
      heroRoot.style.setProperty("--shape-right-x", "0px");
      heroRoot.style.setProperty("--shape-right-y", "0px");
      heroRoot.style.setProperty("--shape-right-r", "0deg");
      heroRoot.style.setProperty("--shape-right-s", "1");
      heroRoot.style.setProperty("--shape-scroll", "0");
    }
  }

  function animateHeroLinesIn() {
    requestAnimationFrame(() => {
      heroLines.forEach((line) => {
        line.style.transform = "translateY(0)";
        line.style.opacity = "1";
      });
    });
  }

  function observeHeroShowreel() {
    if (!heroShowreelBlock) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(heroShowreelBlock, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
            });
            observer.unobserve(heroShowreelBlock);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(heroShowreelBlock);
  }

  function updateHeroMuteIcons(isMuted) {
    if (heroMuteIcon) {
      heroMuteIcon.style.display = isMuted ? "block" : "none";
    }
    if (heroUnmuteIcon) {
      heroUnmuteIcon.style.display = isMuted ? "none" : "block";
    }
  }

  function findHeroTargetMedia() {
    if (!heroRoot) return null;

    return (
      heroRoot.querySelector("video") ||
      document.querySelector("video") ||
      heroRoot.querySelector("audio") ||
      null
    );
  }

  function bindHeroMuteButton() {
    if (!heroMuteButton) return;

    const media = findHeroTargetMedia();
    let isMuted = media ? !!media.muted : true;

    updateHeroMuteIcons(isMuted);

    heroMuteButton.addEventListener("click", () => {
      const targetMedia = findHeroTargetMedia();

      if (targetMedia) {
        targetMedia.muted = !targetMedia.muted;
        updateHeroMuteIcons(targetMedia.muted);
      } else {
        isMuted = !isMuted;
        updateHeroMuteIcons(isMuted);
      }
    });
  }

  function bindHeroScrollTarget() {
    if (!heroScrollTarget) return;

    const triggers = document.querySelectorAll(
      '[href="#home-hero-scroll-target"]'
    );

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        lenis.scrollTo(heroScrollTarget);
      });
    });
  }

  function bindInteractiveHeroCard() {
    if (!heroRoot || !heroCard || !heroCardWrap) return;

    let currentRX = 0;
    let currentRY = 0;
    let targetRX = 0;
    let targetRY = 0;
    let currentSlitX = 0;
    let targetSlitX = 0;
    let rafId = null;

    const animate = () => {
      currentRX += (targetRX - currentRX) * 0.12;
      currentRY += (targetRY - currentRY) * 0.12;
      currentSlitX += (targetSlitX - currentSlitX) * 0.12;

      heroCard.style.transform = `
        perspective(1200px)
        rotateX(${currentRX}deg)
        rotateY(${currentRY}deg)
        translateZ(0)
      `;

      heroCard.style.setProperty("--slit-x", `${currentSlitX}px`);

      heroCard.style.boxShadow = `
        ${currentRY * 1.6}px ${18 + Math.abs(currentRX) * 2}px 60px rgba(0, 0, 0, 0.16)
      `;

      rafId = requestAnimationFrame(animate);
    };

    const onMove = (e) => {
      const rect = heroCardWrap.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;

      const cx = px - 0.5;
      const cy = py - 0.5;

      targetRY = cx * 14;
      targetRX = -cy * 10;
      targetSlitX = cx * 22;

      const slit = 11 + Math.abs(cx) * 2.4;
      heroCard.style.setProperty("--slit-width", `${slit}%`);
    };

    const onLeave = () => {
      targetRX = 0;
      targetRY = 0;
      targetSlitX = 0;
      heroCard.style.setProperty("--slit-width", "11%");
    };

    heroCardWrap.addEventListener("mousemove", onMove);
    heroCardWrap.addEventListener("mouseleave", onLeave);

    if (!rafId) {
      animate();
    }
  }

  if (heroRoot) {
    setupHeroInitialStates();
    animateHeroLinesIn();
    observeHeroShowreel();
    bindHeroMuteButton();
    bindHeroScrollTarget();
    bindInteractiveHeroCard();
    handleHeroScroll();

    heroRoot.addEventListener("mousemove", updateHeroCursorTargets);
    heroRoot.addEventListener("mouseleave", resetHeroCursorTargets);

    window.addEventListener("resize", () => {
      syncFromWindowScroll();
      handleHeroScroll();
    });
  }
});