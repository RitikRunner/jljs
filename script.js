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

  if (videoSection && videoFrame && videoWrapper) {
    const getCoverScale = () => {
      const frameWidth = videoFrame.offsetWidth || 1;
      const frameHeight = videoFrame.offsetHeight || 1;
      return Math.max(window.innerWidth / frameWidth, window.innerHeight / frameHeight);
    };

    const videoTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: videoSection,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    videoTimeline
      .to(
        videoFrame,
        {
          scale: () => getCoverScale(),
          ease: "none",
          duration: 0.12,
        },
        0,
      )
      .to(
        videoWrapper,
        {
          borderRadius: 0,
          ease: "none",
          duration: 0.22,
        },
        0,
      )
      .to({}, { duration: 0.78 });
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
});
 
