import React, { useEffect } from "react";
import { useSpring, animated } from "react-spring";
import "./ButtonCube.css";

const CubeFaces = () => {
  return (
    <>
      <div className="face1bc" />
      <div className="face2bc" />
      <div className="face3bc" />
      <div className="face4bc" />
      <div className="face5bc" />
      <div className="face6bc" />
    </>
  );
};

const ButtonCube = ({ isAnimating }) => {
  const [props, api] = useSpring(() => ({
    from: { rotateY: 0 },
    to: async (next) => {
      while (1) {
        await next({ rotateY: 360 });
        await next({ rotateY: 0 });
      }
    },
    pause: !isAnimating,
    config: { duration: 5000 }, // Duration of one full spin
  }));

  useEffect(() => {
    api.start({ pause: !isAnimating });
  }, [isAnimating, api]);

  return (
    <animated.div
      className="bcube"
      style={{
        transform: props.rotateY.to(
          (rotateY) => `scale(1) rotateY(${rotateY}deg)`
        ),
      }}
    >
      <CubeFaces />
    </animated.div>
  );
};

export default ButtonCube;
