import React, { useEffect } from "react";
import { useSpring, animated } from "react-spring";
import "./FallingCube.css";
const cubeSize = 50; // The size of the cube
const getRandomX = () =>
  Math.floor(Math.random() * (window.innerWidth - cubeSize));
const getRandomY = () => -Math.floor(Math.random() * window.innerHeight); // Random Y above the screen

const CubeFaces = () => {
  return (
    <>
      <div className="face1" />
      <div className="face2" />
      <div className="face3" />
      <div className="face4" />
      <div className="face5" />
      <div className="face6" />
    </>
  );
};
const FallingCube = ({ isAnimating, theme }) => {
  // Get a random starting X and Y position
  const startX = getRandomX();
  const startY = getRandomY();

  // Calculate the distance to travel based on starting Y position
  const endY = document.body.scrollHeight + cubeSize;
  const distance = endY - startY;

  // Speed in pixels per millisecond
  const speed = 0.01;
  // Calculate duration so that cubes with a higher start Y have a longer duration
  const duration = distance / speed;

  const [props, api] = useSpring(() => ({
    from: { xy: [startX, startY] },
    to: async (next) => {
      // Continue the animation in an infinite loop
      while (1) {
        var tempX1 = getRandomX();
        var tempX2 = getRandomX();
        var tempY1 = getRandomY();

        await next({ xy: [tempX1, document.body.scrollHeight] });
        // Reset to a new random position at the top
        await next({ xy: [tempX2, -1000] });
      }
    },
    config: { duration },
    pause: !isAnimating,
  }));
  useEffect(() => {
    const handleResize = () => {
      api.start({ xy: [getRandomX(), document.body.scrollHeight + cubeSize] });
    };

    window.addEventListener("resize", handleResize);
    api.start({ pause: !isAnimating });
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isAnimating, api]);
  return (
    <animated.div
      className={`cube ${theme === "light" ? "cubeDark" : "cubeLight"}`}
      style={{
        transform: props.xy.to(
          (x, y) =>
            `translate3d(${x}px, ${y}px, 0) rotateX(${x}deg) rotateY(${y}deg)`
        ),
      }}
    >
      <CubeFaces />
    </animated.div>
  );
};

export default FallingCube;
