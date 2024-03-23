import React, { useState, useEffect } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { Edges, Text } from "@react-three/drei";
import { animated, useSpring } from "@react-spring/three";
import { Bloom } from "@react-three/postprocessing";
import Tooltip from "../components/Tooltip";
import { Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
//import { FontLoader } from "three/addons/loaders/FontLoader.js";

function weiToEth(val) {
  if (val == 0) return val;
  return `${val / 10e17}`;
}

function calculateTransactionFee(gasPrice, gasUsed) {
  return weiToEth(gasPrice * gasUsed);
}

function timeSince(dateParam) {
  const date = typeof dateParam === "string" ? new Date(dateParam) : dateParam;
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}

function FloatingCube({
  position,
  text,
  onHover,
  onClick,
  scaleFactor,
  theme,
}) {
  // State to handle hover
  const [hovered, setHovered] = useState(false);

  // Define the animation for scaling
  const { scale } = useSpring({
    scale: hovered ? scaleFactor : 1,
    config: { duration: 250 }, // Animation duration of 250ms
  });
  /*
  const loader = new FontLoader();
  const font = loader.load(
    // resource URL
    "/Space_Mono_Regular.json",
    function (font) {
      console.log(font);
    }
  );*/

  return (
    <animated.mesh
      position={position}
      onClick={onClick}
      onPointerOver={() => {
        setHovered(true);
        onHover(true);
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover(false);
      }}
      scale={scale}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        attach="material"
        color="#aabbff"
        transparent
        opacity={0.15}
      />
      <Edges scale={1} color={theme === "light" ? "black" : "white"} />
      <Text
        position={[0, 0, 0]}
        fontSize={0.4}
        color={theme === "light" ? "black" : "white"}
        anchorX="center"
        anchorY="middle"
        //font={font}
      >
        {text}
      </Text>
    </animated.mesh>
  );
}

export default function FloatingCubes({ theme }) {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailCube, setDetailCube] = useState(null);

  const cubeWidth = 1; // Assuming each cube is 1 unit wide
  const spaceBetweenCubes = 1.2; // Assuming you want 1 unit of space between each cube
  const numberOfCubes = 7; // You have 7 cubes
  const totalWidth =
    numberOfCubes * cubeWidth + (numberOfCubes - 1) * spaceBetweenCubes;
  const startX = -(totalWidth / 2) + cubeWidth / 2;
  // State to handle which cube is showing details

  useEffect(() => {
    async function fetchBlocks() {
      setLoading(true);
      try {
        const response = await fetch(
          "https://eth.blockscout.com/api/v2/blocks"
        );
        const data = await response.json();
        setBlocks(data.items || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blocks:", error);
        setLoading(false);
      }
    }

    fetchBlocks();
  }, []);
  // Function to handle cube click
  const handleCubeClick = (index) => {
    // If a detail card is already shown, hide it. Otherwise, show the clicked cube's details
    setDetailCube(detailCube === index ? null : index + 7);
  };
  // Function to handle hover
  const handleHover = (hoverState) => {
    // Handle hover state if needed
  };
  if (loading) {
    return <div>Loading...</div>; // Or any other loading state representation
  }
  return (
    <>
      {detailCube === null ? (
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          {blocks.slice(7, 14).map((block, index) => (
            <FloatingCube
              key={block.height}
              position={[
                startX + index * (cubeWidth + spaceBetweenCubes),
                0,
                0,
              ]}
              text={`${index + 1}`}
              onHover={handleHover}
              onClick={() => handleCubeClick(index)}
              scaleFactor={1.5}
              theme={theme}
            />
          ))}
          <Bloom
            intensity={1.5}
            kernelSize={3}
            luminanceThreshold={0.3}
            luminanceSmoothing={0.75}
          />
        </Canvas>
      ) : (
        <Card className="bg-card text-card-foreground h-screen">
          <CardHeader>
            <CardTitle>
              <div className="flex">
                <Box size={32} />{" "}
                <a
                  href={`https://etherscan.io/block/${blocks[detailCube].height}`}
                  className="text-blue-500 hover:text-blue-600 "
                >
                  {blocks[detailCube].height}
                </a>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div>
              <Canvas>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />

                <FloatingCube
                  key={blocks[detailCube].height}
                  position={[0, 0, 0]}
                  text={`${blocks[detailCube].height}`}
                  onHover={handleHover}
                  onClick={null}
                  scaleFactor={3}
                  theme={theme}
                />

                <Bloom
                  intensity={1.5}
                  kernelSize={3}
                  luminanceThreshold={0.3}
                  luminanceSmoothing={0.75}
                />
              </Canvas>
            </div>
            <div>
              {/*INSERT TABLE HERE. USE VARIABLE blocks[detailCube.hash] to get the block number to query*/}
            </div>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Hash</Label>
                <CardDescription>{blocks[detailCube].hash}</CardDescription>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Validator</Label>
                <CardDescription>
                  {blocks[detailCube].miner.hash}
                </CardDescription>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Reward</Label>
                <CardDescription>
                  {weiToEth(blocks[detailCube].rewards[0].reward).slice(0, 7)}{" "}
                  ETH
                </CardDescription>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Validated</Label>
                <CardDescription>
                  {timeSince(blocks[detailCube].timestamp)} ago
                </CardDescription>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => setDetailCube(null)}>Close</Button>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
