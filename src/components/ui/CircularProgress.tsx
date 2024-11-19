import React from "react";

interface CircularProgressBarProps {
  size: number; // Diameter of the circle
  progress: number; // Progress percentage (0 to 100)
  strokeWidth: number; // Width of the circular stroke
  circleColor?: string; // Background circle color
  progressColor?: string; // Progress stroke color
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  size,
  progress,
  strokeWidth,
  circleColor = "#e6e6e6",
  progressColor = "#4caf50"
}) => {
  const radius = (size - strokeWidth) / 2; // Radius of the circle
  const circumference = 2 * Math.PI * radius; // Circumference of the circle
  const offset = circumference - (progress / 100) * circumference; // Offset for progress

  return (
    <svg width={size} height={size}>
      {/* Background Circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={circleColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Progress Circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={progressColor}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.35s ease" }}
      />
      {/* Center Text */}
      <text
        x="50%"
        y="50%"
        dy=".3em"
        textAnchor="middle"
        fontSize={`${size * 0.2}px`}
        fill={progressColor}
      >
        {`${Math.round(progress)}%`}
      </text>
    </svg>
  );
};

export default CircularProgressBar;
