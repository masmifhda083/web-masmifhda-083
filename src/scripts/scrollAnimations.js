import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function initScrollAnimations() {
  console.log("Initializing GSAP ScrollTrigger Animations")

  // fade in
  gsap.utils.toArray("[data-animate='fade']").forEach(el => {
    gsap.from(el, {
      y: 40,
      opacity: 0,
      ease: "power3.out",
      duration: 1.5,
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        toggleActions: "play reverse play reverse",
      },
    })
  })
}
