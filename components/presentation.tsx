"use client";

import { useState, useEffect, useCallback } from "react";
import { LuSkipForward, LuRotateCcw, LuPause, LuPlay } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { useQueryState, parseAsInteger } from "nuqs";
import { FaGlobe, FaGithub, FaFacebook, FaLinkedin } from "react-icons/fa";
import { renderToString } from "katex";
import { Input } from "@/components/ui/input";

function Tex({
  children,
  math,
  display = false,
}: {
  children?: string;
  math?: string;
  display?: boolean;
}) {
  const texString = String(math || children || "");
  if (!texString) {
    return <span className="font-mono text-orange-300">{texString}</span>;
  }
  const html = renderToString(texString, {
    displayMode: display,
    throwOnError: false,
  });
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function BlockTex({ children, math }: { children?: string; math?: string }) {
  const texString = String(math || children || "");
  return (
    <div className="my-4 text-center">
      <Tex math={texString} display />
    </div>
  );
}

function useAnimationSteps(totalSteps: number, interval = 1500) {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setStep((prev) => {
        if (prev >= totalSteps - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [isPlaying, totalSteps, interval]);

  return {
    step,
    isPlaying,
    play: () => {
      setStep((prev) => {
        if (prev >= totalSteps - 1) {
          return 0;
        }
        return prev;
      });
      setIsPlaying(true);
    },
    pause: () => setIsPlaying(false),
    reset: () => {
      setStep(0);
      setIsPlaying(false);
    },
    nextStep: () => setStep((prev) => Math.min(prev + 1, totalSteps - 1)),
    setStep: (s: number) => setStep(s),
  };
}

function AnimationControls({
  isPlaying,
  onPlay,
  onPause,
  onReset,
  onNext,
  step,
  totalSteps,
  label = "Step",
}: {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onNext: () => void;
  step: number;
  totalSteps: number;
  label?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 justify-center mt-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
      <Button
        variant="outline"
        size="sm"
        onClick={isPlaying ? onPause : onPlay}
        className="bg-teal-600 hover:bg-teal-700 select-none border-teal-500 text-white hover:text-white cursor-pointer"
      >
        {isPlaying ? (
          <LuPause className="w-4 h-4 mr-2" />
        ) : (
          <LuPlay className="w-4 h-4 mr-2" />
        )}
        {isPlaying ? "Pause" : "Play"}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={step >= totalSteps - 1}
        className="bg-orange-600 hover:bg-orange-700 select-none border-orange-500 text-white hover:text-white disabled:opacity-50 cursor-pointer"
      >
        <LuSkipForward className="w-4 h-4 mr-2" />
        Next
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        className="bg-slate-600 hover:bg-slate-700 select-none border-slate-500 text-white hover:text-white cursor-pointer"
      >
        <LuRotateCcw className="w-4 h-4 mr-2" />
        Reset
      </Button>
      <div className="flex items-center gap-2 ml-2">
        <span className="text-sm text-slate-400">{label}:</span>
        <span className="px-3 py-1 bg-orange-500/20 rounded-lg text-orange-300 font-mono font-bold">
          {step + 1} / {totalSteps}
        </span>
      </div>
    </div>
  );
}

// 3D Parallelepiped visualization
function Parallelepiped3D({ activeStep }: { activeStep: number }) {
  const width = 500;
  const height = 400;

  // Define vectors
  const a = { x: 150, y: 50, z: 0 };
  const b = { x: 50, y: 120, z: 20 };
  const c = { x: 20, y: 30, z: 100 };

  // Origin point in 2D projection
  const origin = { x: 200, y: 300 };

  // Project 3D to 2D (isometric projection)
  const project = (p: { x: number; y: number; z: number }) => ({
    x: origin.x + p.x - p.z * 0.5,
    y: origin.y - p.y - p.z * 0.5,
  });

  // Calculate all 8 vertices of parallelepiped
  const O = { x: 0, y: 0, z: 0 };
  const A = { x: a.x, y: a.y, z: a.z };
  const B = { x: b.x, y: b.y, z: b.z };
  const C = { x: c.x, y: c.y, z: c.z };
  const AB = { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
  const AC = { x: a.x + c.x, y: a.y + c.y, z: a.z + c.z };
  const BC = { x: b.x + c.x, y: b.y + c.y, z: b.z + c.z };
  const ABC = { x: a.x + b.x + c.x, y: a.y + b.y + c.y, z: a.z + b.z + c.z };

  const p = {
    O: project(O),
    A: project(A),
    B: project(B),
    C: project(C),
    AB: project(AB),
    AC: project(AC),
    BC: project(BC),
    ABC: project(ABC),
  };

  return (
    <svg
      width={width}
      height={height}
      className="mx-auto bg-slate-900/50 rounded-lg border border-slate-700"
    >
      {/* Back faces (lighter) */}
      {activeStep >= 3 && (
        <>
          <polygon
            points={`${p.B.x},${p.B.y} ${p.AB.x},${p.AB.y} ${p.ABC.x},${p.ABC.y} ${p.BC.x},${p.BC.y}`}
            fill="rgba(251, 146, 60, 0.1)"
            stroke="rgba(251, 146, 60, 0.3)"
            strokeWidth="1"
          />
          <polygon
            points={`${p.C.x},${p.C.y} ${p.AC.x},${p.AC.y} ${p.ABC.x},${p.ABC.y} ${p.BC.x},${p.BC.y}`}
            fill="rgba(20, 184, 166, 0.1)"
            stroke="rgba(20, 184, 166, 0.3)"
            strokeWidth="1"
          />
          <polygon
            points={`${p.A.x},${p.A.y} ${p.AB.x},${p.AB.y} ${p.ABC.x},${p.ABC.y} ${p.AC.x},${p.AC.y}`}
            fill="rgba(147, 51, 234, 0.1)"
            stroke="rgba(147, 51, 234, 0.3)"
            strokeWidth="1"
          />
        </>
      )}

      {/* Vector a */}
      {activeStep >= 0 && (
        <>
          <defs>
            <marker
              id="arrowhead-a"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="#f59e0b" />
            </marker>
          </defs>
          <line
            x1={p.O.x}
            y1={p.O.y}
            x2={p.A.x}
            y2={p.A.y}
            stroke="#f59e0b"
            strokeWidth="3"
            markerEnd="url(#arrowhead-a)"
          />
          <text
            x={p.A.x + 10}
            y={p.A.y}
            fill="#f59e0b"
            fontSize="18"
            fontWeight="bold"
          >
            a
          </text>
        </>
      )}

      {/* Vector b */}
      {activeStep >= 1 && (
        <>
          <defs>
            <marker
              id="arrowhead-b"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="#14b8a6" />
            </marker>
          </defs>
          <line
            x1={p.O.x}
            y1={p.O.y}
            x2={p.B.x}
            y2={p.B.y}
            stroke="#14b8a6"
            strokeWidth="3"
            markerEnd="url(#arrowhead-b)"
          />
          <text
            x={p.B.x + 10}
            y={p.B.y}
            fill="#14b8a6"
            fontSize="18"
            fontWeight="bold"
          >
            b
          </text>
        </>
      )}

      {/* Vector c */}
      {activeStep >= 2 && (
        <>
          <defs>
            <marker
              id="arrowhead-c"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="#a855f7" />
            </marker>
          </defs>
          <line
            x1={p.O.x}
            y1={p.O.y}
            x2={p.C.x}
            y2={p.C.y}
            stroke="#a855f7"
            strokeWidth="3"
            markerEnd="url(#arrowhead-c)"
          />
          <text
            x={p.C.x - 20}
            y={p.C.y}
            fill="#a855f7"
            fontSize="18"
            fontWeight="bold"
          >
            c
          </text>
        </>
      )}

      {/* Parallelepiped edges */}
      {activeStep >= 3 && (
        <>
          {/* From A */}
          <line
            x1={p.A.x}
            y1={p.A.y}
            x2={p.AB.x}
            y2={p.AB.y}
            stroke="#14b8a6"
            strokeWidth="2"
            opacity="0.5"
          />
          <line
            x1={p.A.x}
            y1={p.A.y}
            x2={p.AC.x}
            y2={p.AC.y}
            stroke="#a855f7"
            strokeWidth="2"
            opacity="0.5"
          />

          {/* From B */}
          <line
            x1={p.B.x}
            y1={p.B.y}
            x2={p.AB.x}
            y2={p.AB.y}
            stroke="#f59e0b"
            strokeWidth="2"
            opacity="0.5"
          />
          <line
            x1={p.B.x}
            y1={p.B.y}
            x2={p.BC.x}
            y2={p.BC.y}
            stroke="#a855f7"
            strokeWidth="2"
            opacity="0.5"
          />

          {/* From C */}
          <line
            x1={p.C.x}
            y1={p.C.y}
            x2={p.AC.x}
            y2={p.AC.y}
            stroke="#f59e0b"
            strokeWidth="2"
            opacity="0.5"
          />
          <line
            x1={p.C.x}
            y1={p.C.y}
            x2={p.BC.x}
            y2={p.BC.y}
            stroke="#14b8a6"
            strokeWidth="2"
            opacity="0.5"
          />

          {/* To ABC */}
          <line
            x1={p.AB.x}
            y1={p.AB.y}
            x2={p.ABC.x}
            y2={p.ABC.y}
            stroke="#a855f7"
            strokeWidth="2"
            opacity="0.5"
          />
          <line
            x1={p.AC.x}
            y1={p.AC.y}
            x2={p.ABC.x}
            y2={p.ABC.y}
            stroke="#14b8a6"
            strokeWidth="2"
            opacity="0.5"
          />
          <line
            x1={p.BC.x}
            y1={p.BC.y}
            x2={p.ABC.x}
            y2={p.ABC.y}
            stroke="#f59e0b"
            strokeWidth="2"
            opacity="0.5"
          />
        </>
      )}

      {/* Front faces (darker, more visible) */}
      {activeStep >= 3 && (
        <>
          <polygon
            points={`${p.O.x},${p.O.y} ${p.A.x},${p.A.y} ${p.AB.x},${p.AB.y} ${p.B.x},${p.B.y}`}
            fill="rgba(251, 146, 60, 0.2)"
            stroke="#fb923c"
            strokeWidth="2"
          />
          <polygon
            points={`${p.O.x},${p.O.y} ${p.B.x},${p.B.y} ${p.BC.x},${p.BC.y} ${p.C.x},${p.C.y}`}
            fill="rgba(20, 184, 166, 0.2)"
            stroke="#14b8a6"
            strokeWidth="2"
          />
          <polygon
            points={`${p.O.x},${p.O.y} ${p.A.x},${p.A.y} ${p.AC.x},${p.AC.y} ${p.C.x},${p.C.y}`}
            fill="rgba(147, 51, 234, 0.2)"
            stroke="#9333ea"
            strokeWidth="2"
          />
        </>
      )}

      {/* Origin point */}
      <circle cx={p.O.x} cy={p.O.y} r="5" fill="white" />
      <text
        x={p.O.x - 20}
        y={p.O.y + 20}
        fill="white"
        fontSize="16"
        fontWeight="bold"
      >
        O
      </text>
    </svg>
  );
}

// Determinant calculation animation
function DeterminantAnimation({ activeStep }: { activeStep: number }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        {/* Matrix structure */}
        <div className="grid grid-cols-3 gap-4 p-6 bg-slate-800/50 rounded-xl border-2 border-orange-500/30">
          {/* Row 1 */}
          <div
            className={`w-20 h-20 flex items-center justify-center rounded-lg text-xl font-bold transition-all duration-500 ${
              activeStep >= 0
                ? "bg-orange-500/20 border-2 border-orange-500"
                : "bg-slate-700/30 border border-slate-600"
            }`}
          >
            <Tex math="a_1" />
          </div>
          <div
            className={`w-20 h-20 flex items-center justify-center rounded-lg text-xl font-bold transition-all duration-500 ${
              activeStep >= 0
                ? "bg-orange-500/20 border-2 border-orange-500"
                : "bg-slate-700/30 border border-slate-600"
            }`}
          >
            <Tex math="a_2" />
          </div>
          <div
            className={`w-20 h-20 flex items-center justify-center rounded-lg text-xl font-bold transition-all duration-500 ${
              activeStep >= 0
                ? "bg-orange-500/20 border-2 border-orange-500"
                : "bg-slate-700/30 border border-slate-600"
            }`}
          >
            <Tex math="a_3" />
          </div>

          {/* Row 2 */}
          <div
            className={`w-20 h-20 flex items-center justify-center rounded-lg text-xl font-bold transition-all duration-500 ${
              activeStep >= 1
                ? "bg-teal-500/20 border-2 border-teal-500"
                : "bg-slate-700/30 border border-slate-600"
            }`}
          >
            <Tex math="b_1" />
          </div>
          <div
            className={`w-20 h-20 flex items-center justify-center rounded-lg text-xl font-bold transition-all duration-500 ${
              activeStep >= 1
                ? "bg-teal-500/20 border-2 border-teal-500"
                : "bg-slate-700/30 border border-slate-600"
            }`}
          >
            <Tex math="b_2" />
          </div>
          <div
            className={`w-20 h-20 flex items-center justify-center rounded-lg text-xl font-bold transition-all duration-500 ${
              activeStep >= 1
                ? "bg-teal-500/20 border-2 border-teal-500"
                : "bg-slate-700/30 border border-slate-600"
            }`}
          >
            <Tex math="b_3" />
          </div>

          {/* Row 3 */}
          <div
            className={`w-20 h-20 flex items-center justify-center rounded-lg text-xl font-bold transition-all duration-500 ${
              activeStep >= 2
                ? "bg-purple-500/20 border-2 border-purple-500"
                : "bg-slate-700/30 border border-slate-600"
            }`}
          >
            <Tex math="c_1" />
          </div>
          <div
            className={`w-20 h-20 flex items-center justify-center rounded-lg text-xl font-bold transition-all duration-500 ${
              activeStep >= 2
                ? "bg-purple-500/20 border-2 border-purple-500"
                : "bg-slate-700/30 border border-slate-600"
            }`}
          >
            <Tex math="c_2" />
          </div>
          <div
            className={`w-20 h-20 flex items-center justify-center rounded-lg text-xl font-bold transition-all duration-500 ${
              activeStep >= 2
                ? "bg-purple-500/20 border-2 border-purple-500"
                : "bg-slate-700/30 border border-slate-600"
            }`}
          >
            <Tex math="c_3" />
          </div>
        </div>

        {activeStep >= 3 && (
          <div className="mt-6 p-4 bg-emerald-500/10 border-2 border-emerald-500 rounded-xl">
            <BlockTex math="\vec{a} \cdot (\vec{b} \times \vec{c}) = \begin{vmatrix} a_1 & a_2 & a_3 \\ b_1 & b_2 & b_3 \\ c_1 & c_2 & c_3 \end{vmatrix}" />
          </div>
        )}
      </div>
    </div>
  );
}

function InteractiveDeterminantCalculator() {
  const [matrix, setMatrix] = useState([
    [2, 1, 3],
    [4, -1, 2],
    [1, 2, -2],
  ]);
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Calculate determinant step by step using cofactor expansion
  const minor1 = matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1];
  const minor2 = matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0];
  const minor3 = matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0];
  const result =
    matrix[0][0] * minor1 - matrix[0][1] * minor2 + matrix[0][2] * minor3;

  const steps = [
    {
      title: "Step 1: Write the matrix",
      description: (
        <>
          We have the <Tex math={"3×3"} /> matrix with vectors{" "}
          <Tex math={"\\vec{a}, \\vec{b}, \\vec{c}"} />
        </>
      ),
      formula: `\\begin{vmatrix} ${matrix[0][0]} & ${matrix[0][1]} & ${matrix[0][2]} \\\\ ${matrix[1][0]} & ${matrix[1][1]} & ${matrix[1][2]} \\\\ ${matrix[2][0]} & ${matrix[2][1]} & ${matrix[2][2]} \\end{vmatrix}`,
      cellHighlight: {},
    },
    {
      title: "Step 2: Expand by first row (Cofactor Expansion)",
      description: (
        <>
          Use the formula:{" "}
          <Tex math="a_1 \cdot M_1 - a_2 \cdot M_2 + a_3 \cdot M_3" />
        </>
      ),
      formula: `${matrix[0][0]} \\begin{vmatrix} ${matrix[1][1]} & ${matrix[1][2]} \\\\ ${matrix[2][1]} & ${matrix[2][2]} \\end{vmatrix} - ${matrix[0][1]} \\begin{vmatrix} ${matrix[1][0]} & ${matrix[1][2]} \\\\ ${matrix[2][0]} & ${matrix[2][2]} \\end{vmatrix} + ${matrix[0][2]} \\begin{vmatrix} ${matrix[1][0]} & ${matrix[1][1]} \\\\ ${matrix[2][0]} & ${matrix[2][1]} \\end{vmatrix}`,
      cellHighlight: {},
    },
    {
      title: "Step 3: Calculate first minor M₁",
      description: (
        <Tex
          math={`M_1 = (${matrix[1][1]} \\times ${matrix[2][2]}) - (${matrix[1][2]} \\times ${matrix[2][1]})`}
        />
      ),
      formula: `{\\color{#3b82f6}{${
        matrix[0][0]
      }}} \\times [({\\color{#10b981}{${
        matrix[1][1]
      }}} \\times {\\color{#10b981}{${matrix[2][2]}}}) - ({\\color{#a855f7}{${
        matrix[1][2]
      }}} \\times {\\color{#a855f7}{${matrix[2][1]}}})] = ${
        matrix[0][0]
      } \\times ${minor1} = ${matrix[0][0] * minor1}`,
      cellHighlight: {
        "0-0": "selected", // a1 - blue
        "0-1": "crossed",
        "0-2": "crossed", // a2, a3 - orange
        "1-0": "crossed",
        "2-0": "crossed", // b1, c1 - orange
        "1-1": "minor1",
        "2-2": "minor1", // b2, c3 - green
        "1-2": "minor2",
        "2-1": "minor2", // b3, c2 - purple
      },
    },
    {
      title: "Step 4: Calculate second minor M₂",
      description: (
        <Tex
          math={`M_2 = (${matrix[1][0]} \\times ${matrix[2][2]}) - (${matrix[1][2]} \\times ${matrix[2][0]})`}
        />
      ),
      formula: `{\\color{#3b82f6}{${
        matrix[0][1]
      }}} \\times [({\\color{#10b981}{${
        matrix[1][0]
      }}} \\times {\\color{#10b981}{${matrix[2][2]}}}) - ({\\color{#a855f7}{${
        matrix[1][2]
      }}} \\times {\\color{#a855f7}{${matrix[2][0]}}})] = ${
        matrix[0][1]
      } \\times ${minor2} = ${matrix[0][1] * minor2}`,
      cellHighlight: {
        "0-1": "selected", // a2 - blue
        "0-0": "crossed",
        "0-2": "crossed", // a1, a3 - orange
        "1-1": "crossed",
        "2-1": "crossed", // b2, c2 - orange
        "1-0": "minor1",
        "2-2": "minor1", // b1, c3 - green
        "1-2": "minor2",
        "2-0": "minor2", // b3, c1 - purple
      },
    },
    {
      title: "Step 5: Calculate third minor M₃",
      description: (
        <Tex
          math={`M_3 = (${matrix[1][0]} \\times ${matrix[2][1]}) - (${matrix[1][1]} \\times ${matrix[2][0]})`}
        />
      ),
      formula: `{\\color{#3b82f6}{${
        matrix[0][2]
      }}} \\times [({\\color{#10b981}{${
        matrix[1][0]
      }}} \\times {\\color{#10b981}{${matrix[2][1]}}}) - ({\\color{#a855f7}{${
        matrix[1][1]
      }}} \\times {\\color{#a855f7}{${matrix[2][0]}}})] = ${
        matrix[0][2]
      } \\times ${minor3} = ${matrix[0][2] * minor3}`,
      cellHighlight: {
        "0-2": "selected", // a3 - blue
        "0-0": "crossed",
        "0-1": "crossed", // a1, a2 - orange
        "1-2": "crossed",
        "2-2": "crossed", // b3, c3 - orange
        "1-0": "minor1",
        "2-1": "minor1", // b1, c2 - green
        "1-1": "minor2",
        "2-0": "minor2", // b2, c1 - purple
      },
    },
    {
      title: "Step 6: Final Result",
      description: "Combine all the cofactor terms to get the determinant",
      formula: `${matrix[0][0] * minor1} ${
        matrix[0][1] * minor2 >= 0 ? "-" : "+"
      } ${Math.abs(matrix[0][1] * minor2)} ${
        matrix[0][2] * minor3 >= 0 ? "+" : "-"
      } ${Math.abs(matrix[0][2] * minor3)} = \\boxed{${result}}`,
      cellHighlight: {},
      result,
    },
  ];

  const handleMatrixChange = (i: number, j: number, value: string) => {
    const newMatrix = matrix.map((row) => [...row]);
    // Allow empty string or just minus sign temporarily
    if (value === "" || value === "-") {
      newMatrix[i][j] = 0;
    } else {
      const parsed = Number.parseFloat(value);
      newMatrix[i][j] = Number.isNaN(parsed) ? 0 : parsed;
    }
    setMatrix(newMatrix);
    setStep(0);
    setIsPlaying(false);
  };

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const play = () => {
    if (step >= steps.length - 1) {
      setStep(0);
    }
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      nextStep();
    }, 1800);
    return () => clearInterval(timer);
  }, [isPlaying, step]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Method Description and Matrix Input Row */}
      <div className="flex gap-6 items-start justify-center ">
        {/* Matrix Input */}
        <div className="bg-slate-800/60 p-4 rounded-xl border-2 border-orange-500/40 shadow-lg shadow-orange-500/10">
          <h3 className="text-lg font-bold text-orange-300 mb-3 text-center">
            Matrix Values (Click to Edit)
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {matrix.map((row, i) =>
              row.map((val, j) => {
                const cellKey = `${i}-${j}`;
                const highlightType = (
                  steps[step]?.cellHighlight as Record<
                    string,
                    string | undefined
                  >
                )?.[cellKey];
                let borderClass = "border-slate-600 hover:border-slate-500";
                let shadowClass = "";

                if (highlightType === "selected") {
                  borderClass = "border-blue-500";
                  shadowClass =
                    "shadow-lg shadow-blue-500/50 ring-2 ring-blue-400";
                } else if (highlightType === "minor1") {
                  borderClass = "border-emerald-500";
                  shadowClass = "shadow-md shadow-emerald-500/40";
                } else if (highlightType === "minor2") {
                  borderClass = "border-purple-500";
                  shadowClass = "shadow-md shadow-purple-500/40";
                }

                return (
                  <Input
                    key={cellKey}
                    type="number"
                    value={val === 0 ? "" : val}
                    onChange={(e) => handleMatrixChange(i, j, e.target.value)}
                    className={`w-14 h-14 text-center text-lg font-bold bg-slate-900/80 border-2 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${borderClass} ${shadowClass}`}
                  />
                );
              })
            )}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between h-full max-h-full">
          {/* Method Description */}
          <div className="bg-slate-800/70 p-4 rounded-xl border border-orange-500/30  shrink-0">
            <p className="text-base text-slate-300 text-center mb-3">
              Using the{" "}
              <span className="text-orange-400 font-bold">
                Cofactor Expansion Method
              </span>{" "}
              (Minor Method)
            </p>
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <BlockTex math="a_1(b_2 c_3 - b_3 c_2) - a_2(b_1 c_3 - b_3 c_1) + a_3(b_1 c_2 - b_2 c_1)" />
            </div>
          </div>
          {/* Animation Controls */}
          <AnimationControls
            isPlaying={isPlaying}
            onPlay={play}
            onPause={() => setIsPlaying(false)}
            onReset={() => {
              setStep(0);
              setIsPlaying(false);
            }}
            onNext={nextStep}
            step={step}
            totalSteps={steps.length}
            label="Step"
          />
        </div>
      </div>

      {/* Current Step Display with better animation */}
      <div className="bg-linear-to-br from-teal-500/20 to-purple-500/20 p-5 rounded-xl border-2 border-teal-500/50 w-full max-w-4xl shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-teal-300">
            {steps[step].title}
          </h3>
          <span className="px-3 py-1.5 bg-slate-800/80 rounded-lg text-purple-300 font-mono text-sm">
            Step {step + 1}/{steps.length}
          </span>
        </div>

        <div className="text-slate-300 text-sm mb-3 text-center">
          {steps[step].description}
        </div>

        <div className="bg-slate-900/70 p-5 rounded-lg overflow-x-auto border border-slate-700">
          <BlockTex math={steps[step].formula} />
        </div>
      </div>
    </div>
  );
}

// ============== SLIDE COMPONENTS ==============

function TitleSlide() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-8 bg-linear-to-br from-slate-900 via-orange-900/20 to-slate-900">
      <h1 className="text-5xl md:text-7xl font-bold bg-linear-to-br from-orange-400 via-teal-400 to-purple-400 bg-clip-text text-transparent mb-4">
        Mixed Product of Vectors
      </h1>
      <h2 className="text-2xl md:text-3xl text-slate-300 mb-8">
        and Its Properties
      </h2>
      <div className="px-6 py-3 rounded-full bg-linear-to-br from-orange-500 to-teal-500 text-white font-bold text-lg inline-block mb-12">
        Analytical Geometry
      </div>
      <div className="flex flex-col items-center gap-3 mt-8">
        <p className="text-xl font-semibold text-orange-300">
          Student: Yusif Aliyev
        </p>
        <p className="text-xl font-semibold text-teal-300">
          Teacher: Ruhiyyə Zamanova
        </p>
        <p className="text-lg text-purple-300">Analytical Geometry Course</p>
        <div className="px-4 py-2 bg-white/10 rounded-lg font-mono text-white text-lg">
          Group: 6324E
        </div>
      </div>
    </div>
  );
}

function IntroductionSlide() {
  return (
    <div className="min-h-screen flex flex-col p-8 md:p-12 bg-linear-to-br from-slate-900 to-slate-800">
      <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-br from-orange-400 to-teal-400 bg-clip-text text-transparent mb-8">
        What is the Mixed Product?
      </h1>
      <div className="grid md:grid-cols-2 gap-8 flex-1">
        <div className="space-y-6">
          <p className="text-lg text-slate-300 leading-relaxed">
            The <span className="text-orange-400 font-bold">mixed product</span>{" "}
            (also called{" "}
            <span className="text-teal-400 font-bold">
              scalar triple product
            </span>
            ) combines the{" "}
            <span className="text-purple-400 font-bold">dot product</span> and{" "}
            <span className="text-orange-400 font-bold">cross product</span> of
            three vectors.
          </p>
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
            <h3 className="text-xl font-bold text-teal-400 mb-4">
              Other Names:
            </h3>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-center gap-3">
                <span className="w-3 h-3 bg-orange-400 rounded-full" /> Scalar
                Triple Product
              </li>
              <li className="flex items-center gap-3">
                <span className="w-3 h-3 bg-teal-400 rounded-full" /> Box
                Product
              </li>
              <li className="flex items-center gap-3">
                <span className="w-3 h-3 bg-purple-400 rounded-full" /> Triple
                Scalar Product
              </li>
            </ul>
          </div>
        </div>
        <div className="bg-linear-to-br from-orange-500/10 to-teal-500/10 rounded-xl p-6 border border-orange-500/20">
          <h3 className="text-xl font-bold text-orange-400 mb-4">Definition</h3>
          <div className="bg-slate-900/50 p-4 rounded-lg mb-4">
            <BlockTex math="\vec{a} \cdot (\vec{b} \times \vec{c})" />
          </div>
          <p className="text-slate-300 mb-4">Read as: "a dot b cross c"</p>
          <div className="bg-teal-500/10 p-4 rounded-lg border border-teal-500/30">
            <p className="text-sm text-slate-300">
              This operation produces a{" "}
              <span className="text-teal-400 font-bold">scalar</span> (a single
              number), not a vector!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotationSlide() {
  return (
    <div className="min-h-screen flex flex-col p-8 md:p-12 bg-linear-to-br from-slate-900 via-teal-900/20 to-slate-900">
      <h1 className="text-4xl md:text-5xl font-bold text-teal-400 mb-6">
        Notation and Formula
      </h1>
      <div className="grid md:grid-cols-2 gap-8 flex-1">
        <div className="space-y-6">
          <div className="bg-slate-800/70 p-6 rounded-xl border border-teal-500/30">
            <h3 className="text-lg font-bold text-teal-300 mb-4">
              Common Notations:
            </h3>
            <div className="space-y-4">
              <div className="bg-slate-900/50 p-3 rounded-lg">
                <BlockTex math="\vec{a} \cdot (\vec{b} \times \vec{c})" />
              </div>
              <div className="bg-slate-900/50 p-3 rounded-lg">
                <BlockTex math="(\vec{a}, \vec{b}, \vec{c})" />
              </div>
              <div className="bg-slate-900/50 p-3 rounded-lg">
                <BlockTex math="[\vec{a}, \vec{b}, \vec{c}]" />
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-orange-500/10 p-6 rounded-xl border border-orange-500/30">
            <h3 className="text-lg font-bold text-orange-300 mb-4">
              Important Note:
            </h3>
            <p className="text-slate-300 mb-4">
              The parentheses in <Tex math="\vec{b} \times \vec{c}" /> indicate
              this operation is performed{" "}
              <span className="text-orange-400 font-bold">first</span>.
            </p>
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <BlockTex math="\vec{a} \cdot (\vec{b} \times \vec{c}) = (\vec{a} \times \vec{b}) \cdot \vec{c}" />
            </div>
          </div>
          <div className="bg-purple-500/10 p-6 rounded-xl border border-purple-500/30">
            <h3 className="text-lg font-bold text-purple-300 mb-4">
              Result Type:
            </h3>
            <p className="text-slate-300">
              <span className="text-purple-400 font-bold">Scalar</span> - a real
              number (positive, negative, or zero)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeterminantSlide() {
  return (
    <div className="min-h-screen flex flex-col p-8 md:p-12 bg-linear-to-br from-slate-900 to-slate-800">
      <h1 className="text-4xl md:text-5xl font-bold text-orange-400 mb-6">
        Example: Determinant Calculation
      </h1>
      <div className="flex-1 flex flex-col justify-center">
        <InteractiveDeterminantCalculator />
      </div>
    </div>
  );
}

function GeometricMeaningSlide() {
  const animation = useAnimationSteps(4, 1800);

  return (
    <div className="min-h-screen flex flex-col p-8 md:p-12 bg-linear-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <h1 className="text-4xl md:text-5xl font-bold text-purple-400 mb-6">
        Geometric Interpretation
      </h1>
      <div className="grid md:grid-cols-2 gap-8 flex-1">
        <div className="space-y-6">
          <div className="bg-purple-500/10 p-6 rounded-xl border border-purple-500/30">
            <h3 className="text-xl font-bold text-purple-300 mb-4">
              Volume of Parallelepiped
            </h3>
            <p className="text-slate-300 mb-4">
              The{" "}
              <span className="text-purple-400 font-bold">absolute value</span>{" "}
              of the mixed product equals the{" "}
              <span className="text-orange-400 font-bold">volume</span> of the
              parallelepiped formed by the three vectors.
            </p>
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <BlockTex math="V = |\vec{a} \cdot (\vec{b} \times \vec{c})|" />
            </div>
          </div>
          <div className="bg-teal-500/10 p-6 rounded-xl border border-teal-500/30">
            <h3 className="text-xl font-bold text-teal-300 mb-4">
              What is a Parallelepiped?
            </h3>
            <p className="text-slate-300">
              A 3D figure with 6 faces, where opposite faces are parallel
              parallelograms.
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <Parallelepiped3D activeStep={animation.step} />
          <AnimationControls
            isPlaying={animation.isPlaying}
            onPlay={animation.play}
            onPause={animation.pause}
            onReset={animation.reset}
            onNext={animation.nextStep}
            step={animation.step}
            totalSteps={4}
            label="Step"
          />
        </div>
      </div>
    </div>
  );
}

function Property1Slide() {
  return (
    <div className="min-h-screen flex flex-col p-8 md:p-12 bg-linear-to-br from-slate-900 to-slate-800">
      <h1 className="text-4xl md:text-5xl font-bold text-orange-400 mb-6">
        Property 1: Circular Shift
      </h1>
      <div className="flex-1 flex flex-col justify-center space-y-8">
        <div className="bg-orange-500/10 p-8 rounded-xl border-2 border-orange-500/30">
          <p className="text-xl text-slate-300 text-center mb-6">
            The mixed product remains{" "}
            <span className="text-orange-400 font-bold">unchanged</span> under
            circular permutation of vectors:
          </p>
          <div className="bg-slate-900/50 p-6 rounded-lg">
            <BlockTex math="\vec{a} \cdot (\vec{b} \times \vec{c}) = \vec{b} \cdot (\vec{c} \times \vec{a}) = \vec{c} \cdot (\vec{a} \times \vec{b})" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 p-6 rounded-xl border border-teal-500/30">
            <div className="text-center">
              <div className="text-4xl mb-3">🔄</div>
              <BlockTex math="(\vec{a}, \vec{b}, \vec{c})" />
            </div>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-xl border border-teal-500/30">
            <div className="text-center">
              <div className="text-4xl mb-3">🔄</div>
              <BlockTex math="(\vec{b}, \vec{c}, \vec{a})" />
            </div>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-xl border border-teal-500/30">
            <div className="text-center">
              <div className="text-4xl mb-3">🔄</div>
              <BlockTex math="(\vec{c}, \vec{a}, \vec{b})" />
            </div>
          </div>
        </div>

        <div className="bg-teal-500/10 p-6 rounded-xl border border-teal-500/30">
          <p className="text-center text-slate-300">
            All three expressions give the{" "}
            <span className="text-teal-400 font-bold">same result</span>!
          </p>
        </div>
      </div>
    </div>
  );
}

function Property2Slide() {
  return (
    <div className="min-h-screen flex flex-col p-8 md:p-12 bg-linear-to-br from-slate-900 via-orange-900/20 to-slate-800">
      <h1 className="text-4xl md:text-5xl font-bold text-teal-400 mb-6">
        Property 2: Transposition
      </h1>
      <div className="flex-1 flex flex-col justify-center space-y-8">
        <div className="bg-teal-500/10 p-8 rounded-xl border-2 border-teal-500/30">
          <p className="text-xl text-slate-300 text-center mb-6">
            Swapping any{" "}
            <span className="text-teal-400 font-bold">two adjacent</span>{" "}
            vectors changes the sign:
          </p>
          <div className="bg-slate-900/50 p-6 rounded-lg">
            <BlockTex math="\vec{a} \cdot (\vec{b} \times \vec{c}) = -\vec{a} \cdot (\vec{c} \times \vec{b})" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 p-6 rounded-xl border border-orange-500/30">
            <h3 className="text-lg font-bold text-orange-300 mb-4 text-center">
              More Examples:
            </h3>
            <div className="space-y-3">
              <div className="bg-slate-900/50 p-3 rounded-lg">
                <BlockTex math="(\vec{a}, \vec{b}, \vec{c}) = -(\vec{b}, \vec{a}, \vec{c})" />
              </div>
              <div className="bg-slate-900/50 p-3 rounded-lg">
                <BlockTex math="(\vec{a}, \vec{b}, \vec{c}) = -(\vec{a}, \vec{c}, \vec{b})" />
              </div>
            </div>
          </div>

          <div className="bg-purple-500/10 p-6 rounded-xl border border-purple-500/30">
            <h3 className="text-lg font-bold text-purple-300 mb-4 text-center">
              Why?
            </h3>
            <p className="text-slate-300 text-sm">
              This follows from the property of the cross product: swapping
              vectors in a cross product reverses the direction of the result.
            </p>
            <div className="bg-slate-900/50 p-3 rounded-lg mt-3">
              <BlockTex math="\vec{b} \times \vec{c} = -(\vec{c} \times \vec{b})" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Property3Slide() {
  return (
    <div className="min-h-screen flex flex-col p-8 md:p-12 bg-linear-to-br from-slate-900 to-slate-800">
      <h1 className="text-4xl md:text-5xl font-bold text-purple-400 mb-6">
        Property 3: Parallel Vectors
      </h1>
      <div className="flex-1 flex flex-col justify-center space-y-8">
        <div className="bg-purple-500/10 p-8 rounded-xl border-2 border-purple-500/30">
          <p className="text-xl text-slate-300 text-center mb-6">
            If any two vectors are{" "}
            <span className="text-purple-400 font-bold">parallel</span> or{" "}
            <span className="text-purple-400 font-bold">equal</span>, the mixed
            product is <span className="text-orange-400 font-bold">zero</span>:
          </p>
          <div className="space-y-4">
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <BlockTex math="\vec{a} \cdot (\vec{a} \times \vec{b}) = 0" />
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <BlockTex math="\vec{a} \cdot (\vec{b} \times \vec{a}) = 0" />
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <BlockTex math="(\vec{a}, \vec{a}, \vec{c}) = 0" />
            </div>
          </div>
        </div>

        <div className="bg-orange-500/10 p-6 rounded-xl border border-orange-500/30">
          <h3 className="text-lg font-bold text-orange-300 mb-4 text-center">
            Geometric Reason:
          </h3>
          <p className="text-slate-300 text-center">
            When two vectors are parallel, the parallelepiped{" "}
            <span className="text-orange-400 font-bold">collapses</span> into a
            flat shape with{" "}
            <span className="text-teal-400 font-bold">zero volume</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

function Property4Slide() {
  return (
    <div className="min-h-screen flex flex-col p-8 md:p-12 bg-linear-to-br from-slate-900 via-teal-900/20 to-slate-800">
      <h1 className="text-4xl md:text-5xl font-bold text-orange-400 mb-6">
        Property 4: Coplanarity Test
      </h1>
      <div className="flex-1 flex flex-col justify-center space-y-8">
        <div className="bg-orange-500/10 p-8 rounded-xl border-2 border-orange-500/30">
          <p className="text-xl text-slate-300 text-center mb-6">
            Three vectors are{" "}
            <span className="text-orange-400 font-bold">coplanar</span> (lie in
            the same plane) if and only if their mixed product equals{" "}
            <span className="text-teal-400 font-bold">zero</span>:
          </p>
          <div className="bg-slate-900/50 p-6 rounded-lg">
            <BlockTex math="\vec{a}, \vec{b}, \vec{c} \text{ are coplanar} \iff (\vec{a}, \vec{b}, \vec{c}) = 0" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-teal-500/10 p-6 rounded-xl border border-teal-500/30">
            <h3 className="text-lg font-bold text-teal-300 mb-4 text-center">
              If ≠ 0:
            </h3>
            <p className="text-slate-300 text-center mb-3">
              Vectors are{" "}
              <span className="text-teal-400 font-bold">not coplanar</span>
            </p>
            <p className="text-sm text-slate-400 text-center">
              They form a 3D parallelepiped with non-zero volume
            </p>
          </div>

          <div className="bg-purple-500/10 p-6 rounded-xl border border-purple-500/30">
            <h3 className="text-lg font-bold text-purple-300 mb-4 text-center">
              If = 0:
            </h3>
            <p className="text-slate-300 text-center mb-3">
              Vectors are{" "}
              <span className="text-purple-400 font-bold">coplanar</span>
            </p>
            <p className="text-sm text-slate-400 text-center">
              The parallelepiped has zero volume (flat)
            </p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-xl border border-orange-500/30">
          <p className="text-center text-slate-300">
            This property is very useful for testing if vectors lie in the same
            plane!
          </p>
        </div>
      </div>
    </div>
  );
}

function Property5Slide() {
  return (
    <div className="min-h-screen flex flex-col p-8 md:p-12 bg-linear-to-br from-slate-900 to-slate-800">
      <h1 className="text-4xl md:text-5xl font-bold text-teal-400 mb-6">
        Property 5: Linearity
      </h1>
      <div className="flex-1 flex flex-col justify-center space-y-8">
        <div className="bg-teal-500/10 p-8 rounded-xl border-2 border-teal-500/30">
          <p className="text-xl text-slate-300 text-center mb-6">
            The mixed product is{" "}
            <span className="text-teal-400 font-bold">linear</span> with respect
            to each vector:
          </p>
          <div className="space-y-4">
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <BlockTex math="(\lambda\vec{a}, \vec{b}, \vec{c}) = \lambda(\vec{a}, \vec{b}, \vec{c})" />
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <BlockTex math="(\vec{a}_1 + \vec{a}_2, \vec{b}, \vec{c}) = (\vec{a}_1, \vec{b}, \vec{c}) + (\vec{a}_2, \vec{b}, \vec{c})" />
            </div>
          </div>
        </div>

        <div className="bg-orange-500/10 p-6 rounded-xl border border-orange-500/30">
          <h3 className="text-lg font-bold text-orange-300 mb-4 text-center">
            What This Means:
          </h3>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-orange-400 font-bold mt-1">•</span>
              <span>You can factor out scalar multipliers from any vector</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-400 font-bold mt-1">•</span>
              <span>
                You can distribute the mixed product over vector addition
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-400 font-bold mt-1">•</span>
              <span>
                This works for each of the three vectors independently
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Example1Slide() {
  return (
    <div className="min-h-screen flex flex-col p-8 md:p-12 bg-linear-to-br from-slate-900 via-purple-900/20 to-slate-800">
      <h1 className="text-4xl md:text-5xl font-bold text-purple-400 mb-6">
        Example 1: Calculate Mixed Product
      </h1>
      <div className="flex-1 flex flex-col justify-center space-y-6">
        <div className="bg-purple-500/10 p-6 rounded-xl border border-purple-500/30">
          <h3 className="text-xl font-bold text-purple-300 mb-4">Given:</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-900/50 p-3 rounded-lg">
              <BlockTex math="\vec{a} = (1, 2, 3)" />
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg">
              <BlockTex math="\vec{b} = (4, 5, 6)" />
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg">
              <BlockTex math="\vec{c} = (7, 8, 9)" />
            </div>
          </div>
        </div>

        <div className="bg-orange-500/10 p-6 rounded-xl border border-orange-500/30">
          <h3 className="text-xl font-bold text-orange-300 mb-4">Solution:</h3>
          <div className="bg-slate-900/50 p-4 rounded-lg mb-4">
            <BlockTex math="(\vec{a}, \vec{b}, \vec{c}) = \begin{vmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \\ 7 & 8 & 9 \end{vmatrix}" />
          </div>
          <div className="bg-slate-900/50 p-4 rounded-lg mb-4">
            <BlockTex math="= 1 \begin{vmatrix} 5 & 6 \\ 8 & 9 \end{vmatrix} - 2 \begin{vmatrix} 4 & 6 \\ 7 & 9 \end{vmatrix} + 3 \begin{vmatrix} 4 & 5 \\ 7 & 8 \end{vmatrix}" />
          </div>
          <div className="bg-slate-900/50 p-4 rounded-lg mb-4">
            <BlockTex math="= 1(45 - 48) - 2(36 - 42) + 3(32 - 35)" />
          </div>
          <div className="bg-slate-900/50 p-4 rounded-lg">
            <BlockTex math="= 1(-3) - 2(-6) + 3(-3) = -3 + 12 - 9 = 0" />
          </div>
        </div>

        <div className="bg-teal-500/10 p-6 rounded-xl border border-teal-500/30">
          <p className="text-slate-300 text-center">
            <span className="text-teal-400 font-bold">Result = 0</span> means
            these vectors are{" "}
            <span className="text-orange-400 font-bold">coplanar</span>!
          </p>
        </div>
      </div>
    </div>
  );
}

function Example2Slide() {
  return (
    <div className="min-h-screen flex flex-col p-8 md:p-12 bg-linear-to-br from-slate-900 to-slate-800">
      <h1 className="text-4xl md:text-5xl font-bold text-orange-400 mb-6">
        Example 2: Volume of Parallelepiped
      </h1>
      <div className="flex-1 flex flex-col justify-center space-y-6">
        <div className="bg-orange-500/10 p-6 rounded-xl border border-orange-500/30">
          <h3 className="text-xl font-bold text-orange-300 mb-4">Given:</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-900/50 p-3 rounded-lg">
              <BlockTex math="\vec{a} = (2, 0, 0)" />
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg">
              <BlockTex math="\vec{b} = (0, 3, 0)" />
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg">
              <BlockTex math="\vec{c} = (0, 0, 4)" />
            </div>
          </div>
        </div>

        <div className="bg-teal-500/10 p-6 rounded-xl border border-teal-500/30">
          <h3 className="text-xl font-bold text-teal-300 mb-4">Solution:</h3>
          <div className="bg-slate-900/50 p-4 rounded-lg mb-4">
            <BlockTex math="(\vec{a}, \vec{b}, \vec{c}) = \begin{vmatrix} 2 & 0 & 0 \\ 0 & 3 & 0 \\ 0 & 0 & 4 \end{vmatrix}" />
          </div>
          <div className="bg-slate-900/50 p-4 rounded-lg mb-4">
            <BlockTex math="= 2 \cdot 3 \cdot 4 = 24" />
          </div>
        </div>

        <div className="bg-purple-500/10 p-6 rounded-xl border border-purple-500/30">
          <p className="text-slate-300 text-center text-lg">
            Volume:{" "}
            <span className="text-purple-400 font-bold text-2xl">
              <Tex math="V = |24| = 24" />
            </span>{" "}
            cubic units
          </p>
          <p className="text-sm text-slate-400 text-center mt-3">
            (This forms a rectangular box with dimensions 2 × 3 × 4)
          </p>
        </div>
      </div>
    </div>
  );
}

function Example3Slide() {
  return (
    <div className="min-h-screen flex flex-col p-8 md:p-12 bg-linear-to-br from-slate-900 via-orange-900/20 to-slate-800">
      <h1 className="text-4xl md:text-5xl font-bold text-teal-400 mb-6">
        Example 3: Coplanarity Test
      </h1>
      <div className="flex-1 flex flex-col justify-center space-y-6">
        <div className="bg-teal-500/10 p-6 rounded-xl border border-teal-500/30">
          <h3 className="text-xl font-bold text-teal-300 mb-4">Question:</h3>
          <p className="text-slate-300 mb-4">Are these vectors coplanar?</p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-900/50 p-3 rounded-lg">
              <BlockTex math="\vec{a} = (1, 1, 0)" />
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg">
              <BlockTex math="\vec{b} = (0, 1, 1)" />
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg">
              <BlockTex math="\vec{c} = (1, 0, 1)" />
            </div>
          </div>
        </div>

        <div className="bg-purple-500/10 p-6 rounded-xl border border-purple-500/30">
          <h3 className="text-xl font-bold text-purple-300 mb-4">Solution:</h3>
          <div className="bg-slate-900/50 p-4 rounded-lg mb-4">
            <BlockTex math="(\vec{a}, \vec{b}, \vec{c}) = \begin{vmatrix} 1 & 1 & 0 \\ 0 & 1 & 1 \\ 1 & 0 & 1 \end{vmatrix}" />
          </div>
          <div className="bg-slate-900/50 p-4 rounded-lg mb-4">
            <BlockTex math="= 1 \begin{vmatrix} 1 & 1 \\ 0 & 1 \end{vmatrix} - 1 \begin{vmatrix} 0 & 1 \\ 1 & 1 \end{vmatrix} + 0" />
          </div>
          <div className="bg-slate-900/50 p-4 rounded-lg">
            <BlockTex math="= 1(1 - 0) - 1(0 - 1) = 1 + 1 = 2" />
          </div>
        </div>

        <div className="bg-orange-500/10 p-6 rounded-xl border border-orange-500/30">
          <p className="text-slate-300 text-center text-lg">
            Since <span className="text-orange-400 font-bold">2 ≠ 0</span>, the
            vectors are{" "}
            <span className="text-teal-400 font-bold">NOT coplanar</span>
          </p>
          <p className="text-sm text-slate-400 text-center mt-3">
            They form a 3D parallelepiped with volume = 2 cubic units
          </p>
        </div>
      </div>
    </div>
  );
}

function ApplicationsSlide() {
  return (
    <div className="min-h-screen flex flex-col p-8 md:p-12 bg-linear-to-br from-slate-900 via-teal-900/20 to-slate-800">
      <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-br from-orange-400 to-teal-400 bg-clip-text text-transparent mb-8">
        Applications
      </h1>
      <div className="flex flex-row gap-6 flex-wrap">
        <div className="space-y-4">
          <div className="bg-orange-500/10 p-6 rounded-xl border border-orange-500/30 ">
            <h3 className="text-xl font-bold text-orange-300 mb-4">
              1. Volume Calculations
            </h3>
            <p className="text-slate-300 mb-3">
              Finding volumes of parallelepipeds and tetrahedra in 3D space.
            </p>
            <div className="bg-slate-900/50 p-3 rounded-lg text-sm">
              <BlockTex math="V_{tetrahedron} = \frac{1}{6}|(\vec{a}, \vec{b}, \vec{c})|" />
            </div>
          </div>

          <div className="bg-teal-500/10 p-6 rounded-xl border border-teal-500/30 ">
            <h3 className="text-xl font-bold text-teal-300 mb-4">
              2. Coplanarity Testing
            </h3>
            <p className="text-slate-300">
              Determining if three vectors (or four points) lie in the same
              plane.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-purple-500/10 p-6 rounded-xl border border-purple-500/30 ">
            <h3 className="text-xl font-bold text-purple-300 mb-4">
              3. Linear Independence
            </h3>
            <p className="text-slate-300">
              Three vectors are linearly independent if and only if their mixed
              product is non-zero.
            </p>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 ">
            <h3 className="text-xl font-bold text-orange-300 mb-4">
              4. Physics & Engineering
            </h3>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-400 rounded-full" />
                Moments and torques
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full" />
                Fluid mechanics (vorticity)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-400 rounded-full" />
                Crystallography
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummarySlide() {
  return (
    <div className="min-h-screen flex flex-col p-8 md:p-12 bg-linear-to-br from-slate-900 to-slate-800">
      <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-br from-orange-400 via-teal-400 to-purple-400 bg-clip-text text-transparent mb-8">
        Summary
      </h1>
      <div className="flex-1 space-y-6">
        <div className="bg-orange-500/10 p-6 rounded-xl border border-orange-500/30">
          <h3 className="text-xl font-bold text-orange-300 mb-3">
            Definition:
          </h3>
          <div className="bg-slate-900/50 p-3 rounded-lg">
            <BlockTex math="\vec{a} \cdot (\vec{b} \times \vec{c}) = \begin{vmatrix} a_1 & a_2 & a_3 \\ b_1 & b_2 & b_3 \\ c_1 & c_2 & c_3 \end{vmatrix}" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-teal-500/10 p-4 rounded-xl border border-teal-500/30">
            <h4 className="text-lg font-bold text-teal-300 mb-2">
              Key Properties:
            </h4>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-teal-400">✓</span> Circular shift
                invariant
              </li>
              <li className="flex items-center gap-2">
                <span className="text-teal-400">✓</span> Sign changes with swap
              </li>
              <li className="flex items-center gap-2">
                <span className="text-teal-400">✓</span> Zero for parallel
                vectors
              </li>
              <li className="flex items-center gap-2">
                <span className="text-teal-400">✓</span> Coplanarity test
              </li>
              <li className="flex items-center gap-2">
                <span className="text-teal-400">✓</span> Linear in each vector
              </li>
            </ul>
          </div>

          <div className="bg-purple-500/10 p-4 rounded-xl border border-purple-500/30">
            <h4 className="text-lg font-bold text-purple-300 mb-2">
              Geometric Meaning:
            </h4>
            <div className="bg-slate-900/50 p-3 rounded-lg">
              <BlockTex math="V = |(\vec{a}, \vec{b}, \vec{c})|" />
            </div>
            <p className="text-slate-300 text-sm mt-2">
              Volume of parallelepiped formed by the three vectors
            </p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-xl border border-orange-500/30">
          <p className="text-center text-slate-300">
            The mixed product is a powerful tool for{" "}
            <span className="text-orange-400 font-bold">3D geometry</span>,
            combining the dot and cross products to extract geometric
            information about three vectors!
          </p>
        </div>
      </div>
    </div>
  );
}

function ReferencesSlide() {
  return (
    <div className="min-h-screen flex flex-col p-8 md:p-12 bg-linear-to-br from-slate-900 via-purple-900/20 to-slate-800">
      <h1 className="text-4xl md:text-5xl font-bold text-orange-400 mb-8">
        References
      </h1>
      <div className="flex-1 flex flex-col justify-center space-y-6">
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
          <h3 className="text-xl font-bold text-teal-300 mb-4">
            Main Textbook:
          </h3>
          <p className="text-slate-300">
            V.V. Konev.{" "}
            <span className="italic">
              Linear Algebra, Vector Algebra and Analytical Geometry
            </span>
            . Tomsk: TPU Press, 2009.
          </p>
          <p className="text-sm text-slate-400 mt-2">
            Section 5.6: The Scalar Triple Product (pp. 75-77)
          </p>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
          <h3 className="text-xl font-bold text-purple-300 mb-4">
            Additional Resources:
          </h3>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-orange-400 font-bold mt-1">•</span>
              <span>
                Cuemath: Scalar Triple Product - Formula, Geometrical
                Interpretation
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-teal-400 font-bold mt-1">•</span>
              <span>Wikipedia: Triple Product</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-400 font-bold mt-1">•</span>
              <span>
                ProofWiki: Magnitude of Scalar Triple Product equals Volume
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function ThankYouSlide() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-8 bg-linear-to-br from-slate-900 via-orange-900/30 to-slate-900">
      <h1 className="text-6xl md:text-8xl font-bold bg-linear-to-br from-orange-400 via-teal-400 to-purple-400 bg-clip-text text-transparent mb-8">
        Thank You!
      </h1>
      <p className="text-2xl text-slate-300 mb-12">Questions?</p>

      <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700 mb-12">
        <p className="text-xl text-orange-300 mb-2">Student: Yusif Aliyev</p>
        <p className="text-xl text-teal-300">Teacher: Ruhiyyə Zamanova</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <a
          href="https://yusifaliyevpro.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-slate-800/50 p-4 rounded-xl border border-cyan-500/30 hover:bg-slate-700/50 hover:border-cyan-400/50 transition-all cursor-pointer"
        >
          <FaGlobe className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
          <p className="text-xs text-slate-400">Website</p>
        </a>
        <a
          href="https://github.com/yusifaliyevpro"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-slate-800/50 p-4 rounded-xl border border-slate-500/30 hover:bg-slate-700/50 hover:border-slate-400/50 transition-all cursor-pointer"
        >
          <FaGithub className="w-6 h-6 text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-400">GitHub</p>
        </a>
        <a
          href="https://www.facebook.com/yusifaliyevpro"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-slate-800/50 p-4 rounded-xl border border-blue-500/30 hover:bg-slate-700/50 hover:border-blue-400/50 transition-all cursor-pointer"
        >
          <FaFacebook className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <p className="text-xs text-slate-400">Facebook</p>
        </a>
        <a
          href="https://www.linkedin.com/in/yusifaliyevpro/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-slate-800/50 p-4 rounded-xl border border-sky-500/30 hover:bg-slate-700/50 hover:border-sky-400/50 transition-all cursor-pointer"
        >
          <FaLinkedin className="w-6 h-6 text-sky-400 mx-auto mb-2" />
          <p className="text-xs text-slate-400">LinkedIn</p>
        </a>
      </div>
    </div>
  );
}

// Main presentation component
export default function VectorPresentation() {
  const [slideIndex, setSlideIndex] = useQueryState(
    "p",
    parseAsInteger.withDefault(1)
  );

  const slides = [
    <TitleSlide key="title" />,
    <IntroductionSlide key="intro" />,
    <NotationSlide key="notation" />,
    <DeterminantSlide key="determinant" />,
    <GeometricMeaningSlide key="geometric" />,
    <Property1Slide key="prop1" />,
    <Property2Slide key="prop2" />,
    <Property3Slide key="prop3" />,
    <Property4Slide key="prop4" />,
    <Property5Slide key="prop5" />,
    <Example1Slide key="ex1" />,
    <Example2Slide key="ex2" />,
    <Example3Slide key="ex3" />,
    <ApplicationsSlide key="apps" />,
    <SummarySlide key="summary" />,
    <ReferencesSlide key="refs" />,
    <ThankYouSlide key="thanks" />,
  ];

  const handleNext = useCallback(() => {
    if (slideIndex < slides.length) {
      setSlideIndex(slideIndex + 1);
    }
  }, [slideIndex, slides.length, setSlideIndex]);

  const handlePrevious = useCallback(() => {
    if (slideIndex > 1) {
      setSlideIndex(slideIndex - 1);
    }
  }, [slideIndex, setSlideIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrevious();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrevious]);

  return (
    <div className="min-h-screen bg-slate-950 text-white relative">
      <div className="fixed top-4 right-8 z-50 px-4 py-2 bg-slate-800/80 backdrop-blur-sm rounded-lg border border-slate-700">
        <span className="text-slate-300 font-mono">
          {slideIndex}/{slides.length}
        </span>
      </div>

      <div className="min-h-screen">{slides[slideIndex - 1]}</div>
    </div>
  );
}
