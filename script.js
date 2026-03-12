import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

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
  lenis.on("scroll", (e) => {
    ScrollTrigger.update();
    if (typeof e?.progress === "number") {
      setProgressDot(e.progress);
    } else {
      syncFromWindowScroll();
    }
  });
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
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
  const segmentSize = 1 / totalCards;

  const cardYOffset = 5;
  const cardScaleStep = 0.075;

  cards.forEach((card, i) => {
    gsap.set(card, {
      xPercent: -50,
      yPercent: -50 + i * cardYOffset,
      scale: 1 - i * cardScaleStep,
    });
  });

  ScrollTrigger.create({
    trigger: ".sticky-cards",
    start: "top top",
    end: `+=${window.innerHeight * 8}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;

      const activeIndex = Math.min(
        Math.floor(progress / segmentSize),
        totalCards - 1
      );

      const segProgress = (progress - activeIndex * segmentSize) / segmentSize;

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
          const currentYOffset = (behindIndex - segProgress) * cardYOffset;
          const currentScale = 1 - (behindIndex - segProgress) * cardScaleStep;

          gsap.set(card, {
            yPercent: -50 + currentYOffset,
            rotationX: 0,
            scale: currentScale,
          });
        }
      });
    },
  });

  const wrap = document.querySelector(".c-masked");
  const baseTarget = document.querySelector(
    ".c-masked [data-text-reveal]:not(.is-masked) .footer-ball-target"
  );
  const ball = document.querySelector(".c-masked .is-masked .footer-ball-target");

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
    if (!wrap || !baseTarget || !ball) return;

    const rect = baseTarget.getBoundingClientRect();
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

  if (wrap && baseTarget && ball) {
    window.addEventListener("mousemove", (e) => {
      updateTargetFromMouse(e.clientX, e.clientY);
    });

    window.addEventListener("resize", () => {
      setInitialPosition();
    });

    setInitialPosition();
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
});
