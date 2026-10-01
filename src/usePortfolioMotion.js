import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(ScrollTrigger, Flip);

export function usePortfolioMotion(mode) {
  const projectState = useRef(null);
  const projectTransition = useRef(null);
  const prepareProjectTransition = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    projectTransition.current?.kill();
    projectState.current = Flip.getState(".project-card");
  };
  useLayoutEffect(() => {
    if (!projectState.current) return;
    const state = projectState.current;
    projectState.current = null;
    projectTransition.current = Flip.from(state, {
      duration: 0.75, ease: "power3.inOut", absoluteOnLeave: true,
      onEnter: (elements) => gsap.fromTo(elements, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06 }),
      onComplete: () => ScrollTrigger.refresh(),
    });
  }, [mode]);
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const lenis = new Lenis({ lerp: 0.085, smoothWheel: true, syncTouch: false, anchors: { offset: -90 } });
      const tick = (seconds) => lenis.raf(seconds * 1000);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);

      gsap.from(".hero-name-line", { yPercent: 105, opacity: 0, duration: 1.2, stagger: 0.12, ease: "power4.out" });
      const hero = gsap.timeline({
        scrollTrigger: { trigger: ".hero-scene", start: () => `top ${document.querySelector(".site-header").offsetHeight}px`, end: "bottom bottom", scrub: 0.7, invalidateOnRefresh: true },
      });
      hero.to(".hero-name-scroll", {
        scale: 0.18,
        x: () => {
          const name = document.querySelector(".hero-name-scroll");
          const nav = document.querySelector(".nav-name-motion");
          const destination = (nav.offsetWidth ? nav : document.querySelector(".site-header a")).getBoundingClientRect();
          return destination.left + destination.width / 2 - (name.offsetLeft + name.offsetWidth / 2);
        },
        y: () => -document.querySelector(".hero-name-scroll").offsetTop - 46,
        opacity: 0, ease: "power2.inOut", duration: 0.6,
      }, 0);
      hero.to(".nav-name-motion", { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.2 }, 0.45);
      hero.fromTo(".hero-summary", { scale: 0.7, y: 0, opacity: 0.8 }, {
        scale: 1, y: () => -Math.min(window.innerHeight * 0.18, 150), opacity: 1, duration: 0.55, ease: "power2.inOut",
      }, 0.4);
      hero.to(".hero-scroll-cue", { opacity: 0, duration: 0.15 }, 0);
      hero.to(".hero-canvas", { opacity: 0.22, duration: 0.4 }, 0.45);
      hero.fromTo(".emphasis-line", { scaleX: 0 }, { scaleX: 1, duration: 0.25, stagger: 0.08, ease: "power2.out" }, 0.65);
      gsap.utils.toArray(".timeline-item").forEach((item) => {
        ScrollTrigger.create({ trigger: item, start: "top 65%", end: "bottom 35%", toggleClass: "timeline-current" });
      });

      gsap.utils.toArray(".section-heading").forEach((heading) => {
        gsap.from(heading.querySelectorAll(".heading-word"), {
          yPercent: 110, duration: 0.85, stagger: 0.065, ease: "power3.out",
          scrollTrigger: { trigger: heading, start: "top 90%", once: true },
        });
      });
      const navLinks = gsap.utils.toArray(".site-header nav a");
      navLinks.forEach((link) => {
        const activate = () => {
          navLinks.forEach((other) => other.removeAttribute("aria-current"));
          link.setAttribute("aria-current", "location");
        };
        ScrollTrigger.create({
          trigger: link.getAttribute("href"), start: "top 35%", end: "bottom 35%",
          onEnter: activate, onEnterBack: activate,
          onLeave: () => link.removeAttribute("aria-current"),
          onLeaveBack: () => link.removeAttribute("aria-current"),
        });
      });

      gsap.utils.toArray("[data-reveal]").filter((element) => !element.closest("#projects") && !element.matches("section")).forEach((element) => {
        const lateral = element.classList.contains("metric-reveal")
          ? (element.classList.contains("metric-reveal-left") ? -80 : 80)
          : element.classList.contains("timeline-item")
            ? (element.classList.contains("timeline-item-left") ? -35 : 35) : 0;
        gsap.fromTo(element, { opacity: 0, y: lateral ? 0 : 34, x: lateral }, {
          opacity: 1, x: 0, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 92%", once: true },
        });
      });

      const cleanups = [];
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        gsap.utils.toArray(".motion-link, #contact a, .portfolio-footer a").forEach((link) => {
          const x = gsap.quickTo(link, "x", { duration: 0.45, ease: "power3.out" });
          const y = gsap.quickTo(link, "y", { duration: 0.45, ease: "power3.out" });
          const move = (event) => {
            const rect = link.getBoundingClientRect();
            x((event.clientX - rect.left - rect.width / 2) * 0.12);
            y((event.clientY - rect.top - rect.height / 2) * 0.2);
          };
          const leave = () => { x(0); y(0); };
          link.addEventListener("pointermove", move);
          link.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            link.removeEventListener("pointermove", move);
            link.removeEventListener("pointerleave", leave);
          });
        });
      }
      gsap.from(".contact-copy, .contact-links", {
        y: 35, opacity: 0, stagger: 0.1, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: "#contact", start: "top 85%", once: true },
      });

      gsap.fromTo(".timeline-progress", { scaleY: 0 }, {
        scaleY: 1, ease: "none",
        scrollTrigger: { trigger: ".experience-timeline", start: "top 55%", end: "bottom 55%", scrub: 0.4 },
      });
      gsap.fromTo(".reading-progress", { scaleX: 0 }, {
        scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: true },
      });
      gsap.utils.toArray(".metric-item > span").forEach((label) => {
        const original = label.textContent;
        const number = parseInt(original.replace(/,/g, ""), 10);
        const suffix = original.replace(/[\d,]/g, "");
        const counter = { value: 0 };
        gsap.to(counter, {
          value: number, duration: 1.6, ease: "power2.out",
          scrollTrigger: { trigger: label, start: "top 95%", once: true },
          onUpdate: () => { label.textContent = `${Math.round(counter.value).toLocaleString("en-US")}${suffix}`; },
          onComplete: () => { label.textContent = original; },
        });
      });
      const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => {
        cleanups.forEach((cleanup) => cleanup());
        cancelAnimationFrame(refresh);
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    });
    return () => media.revert();
  }, []);

  useEffect(() => {
    const pointerCleanups = [];
    const filters = document.querySelector(".project-filters");
    const indicator = filters.querySelector(".filter-indicator");
    const positionIndicator = () => {
      const active = filters.querySelector('[aria-pressed="true"]');
      gsap.to(indicator, {
        x: active.offsetLeft, y: active.offsetTop,
        width: active.offsetWidth, height: active.offsetHeight,
        duration: 0.5, ease: "power3.inOut", overwrite: true,
      });
    };
    const resizeObserver = new ResizeObserver(positionIndicator);
    resizeObserver.observe(filters);
    positionIndicator();
    const context = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.utils.toArray("#projects .project-card").forEach((element) => {
        if (projectTransition.current?.isActive()) return;
        gsap.fromTo(element, { opacity: 0, y: 24 }, {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 94%", once: true },
        });
      });
      gsap.utils.toArray(".project-card").forEach((card) => {
        ScrollTrigger.create({ trigger: card, start: "top bottom", end: "bottom top", toggleClass: "art-visible" });
        if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
        const artwork = card.querySelector(".artwork");
        const moveX = gsap.quickTo(artwork, "x", { duration: 0.7, ease: "power3.out" });
        const moveY = gsap.quickTo(artwork, "y", { duration: 0.7, ease: "power3.out" });
        const rotateX = gsap.quickTo(artwork, "rotationX", { duration: 0.7, ease: "power3.out" });
        const rotateY = gsap.quickTo(artwork, "rotationY", { duration: 0.7, ease: "power3.out" });
        const move = (event) => {
          const rect = card.getBoundingClientRect();
          moveX(((event.clientX - rect.left) / rect.width - 0.5) * 18);
          moveY(((event.clientY - rect.top) / rect.height - 0.5) * 12);
          rotateX(-((event.clientY - rect.top) / rect.height - 0.5) * 7);
          rotateY(((event.clientX - rect.left) / rect.width - 0.5) * 9);
        };
        const leave = () => { moveX(0); moveY(0); rotateX(0); rotateY(0); };
        card.addEventListener("pointermove", move);
        card.addEventListener("pointerleave", leave);
        pointerCleanups.push(() => {
          card.removeEventListener("pointermove", move);
          card.removeEventListener("pointerleave", leave);
          gsap.killTweensOf(artwork);
        });
      });
    });
    const refresh = () => ScrollTrigger.refresh();
    document.addEventListener("toggle", refresh, true);
    const frame = requestAnimationFrame(refresh);
    return () => {
      resizeObserver.disconnect();
      gsap.killTweensOf(indicator);
      pointerCleanups.forEach((cleanup) => cleanup());
      cancelAnimationFrame(frame);
      document.removeEventListener("toggle", refresh, true);
      context.revert();
    };
  }, [mode]);
  useEffect(() => () => projectTransition.current?.kill(), []);
  return prepareProjectTransition;
}
