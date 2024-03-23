import React, { Suspense } from "react";
const FloatingCubes = React.lazy(() => import("./FloatingCubes")); // Adjust the path as necessary

function CubesPage({ theme }) {
  return (
    <div>
      <div style={{ height: "500px", width: "100vw" }}>
        <FloatingCubes theme={theme} />
      </div>
    </div>
  );
}

export default CubesPage;
