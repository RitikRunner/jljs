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
      return Math.max(window.innerWidth / frameWidth, window.innerHeight / frameHeight);
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
        0,
      )
      .to(
        videoWrapper,
        {
          borderRadius: "1.8rem",
          ease: "power2.out",
          duration: 0.24,
        },
        0,
      )
      .to(
        videoWrapper,
        {
          "--line-opacity": 0,
          ease: "none",
          duration: 0.01,
        },
        0.16,
      )
      .to(
        videoPlayer,
        {
          opacity: 1,
          scale: 1,
          ease: "power1.out",
          duration: 0.16,
        },
        0.09,
      )
      .to(
        videoFrame,
        {
          scale: () => getCoverScale(),
          ease: "none",
          duration: 0.16,
        },
        0.24,
      )
      .to(
        videoWrapper,
        {
          borderRadius: 0,
          ease: "none",
          duration: 0.2,
        },
        0.24,
      )
      .to({}, { duration: 0.68 })
      .to(
        videoFrame,
        {
          yPercent: -22,
          ease: "none",
          duration: 0.18,
        },
        0.92,
      )
      .to(
        videoWrapper,
        {
          opacity: 0.94,
          ease: "none",
          duration: 0.18,
        },
        0.92,
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
        totalCards - 1,
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

  const maskedTitles = document.querySelectorAll(".footer .c-masked");

  maskedTitles.forEach((title) => {
    const baseTarget = title.querySelector(
      ':scope > [data-text-reveal]:not(.is-masked) .footer-ball-target'
    );
    const maskedTarget = title.querySelector(".is-masked .footer-ball-target");
    if (!baseTarget || !maskedTarget) return;

    const xTo = gsap.quickTo(maskedTarget, "--xpercent", {
      duration: 0.35,
      ease: "power3.out",
    });
    const yTo = gsap.quickTo(maskedTarget, "--ypercent", {
      duration: 0.35,
      ease: "power3.out",
    });

    const setFromEvent = (event) => {
      const rect = baseTarget.getBoundingClientRect();
      const isInsideX = event.clientX >= rect.left && event.clientX <= rect.right;
      const isInsideY = event.clientY >= rect.top && event.clientY <= rect.bottom;

      if (!isInsideX || !isInsideY) return;

      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      xTo(`${Math.max(0, Math.min(100, x))}%`);
      yTo(`${Math.max(0, Math.min(100, y))}%`);
    };

    const updateMask = (event) => {
      setFromEvent(event);
    };

    title.addEventListener("pointerenter", setFromEvent);
    title.addEventListener("pointermove", updateMask);
  });

  const foundersSection = document.querySelector(".founders.u-section");
  const foundersHeadline = document.querySelector(".founders .founders-headline");
  const foundersIntro = document.querySelector(".founders .founders-intro");
  const foundersGrey = document.querySelectorAll(".founders .text-grey");

  if (foundersSection && foundersHeadline && foundersIntro) {
    gsap.timeline({
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
        0,
      )
      .to(
        foundersGrey,
        {
          color: "rgba(245, 241, 232, 0.55)",
          ease: "none",
        },
        0,
      )
      .to(
        foundersIntro,
        {
          color: "rgba(245, 241, 232, 0.82)",
          ease: "none",
        },
        0,
      );
  }
});
 
