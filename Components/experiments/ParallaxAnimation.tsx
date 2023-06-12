import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const ParallaxAnimation = () => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(".parallax-layer", {
      yPercent: -20,
      ease: "none",
      scrollTrigger: {
        trigger: ".parallax-container",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });
  }, []);

  return (
    <div className="parallax-container">
      <div className="parallax-layer">Layer 1</div>
      <div className="parallax-layer">Layer 2</div>
      <div className="parallax-layer">Layer 3</div>
    </div>
  );
};

export default ParallaxAnimation;
