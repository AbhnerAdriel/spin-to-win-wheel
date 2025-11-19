import { useEffect, useRef, useState } from "react";

interface Prize {
  id: string;
  name: string;
}

interface PrizeWheelProps {
  prizes: Prize[];
  isSpinning: boolean;
  onSpinComplete: (winner: Prize) => void;
}

const COLORS = [
  "hsl(var(--wheel-color-1))",
  "hsl(var(--wheel-color-2))",
  "hsl(var(--wheel-color-3))",
  "hsl(var(--wheel-color-4))",
  "hsl(var(--wheel-color-5))",
  "hsl(var(--wheel-color-6))",
  "hsl(var(--wheel-color-7))",
  "hsl(var(--wheel-color-8))",
];

export const PrizeWheel = ({ prizes, isSpinning, onSpinComplete }: PrizeWheelProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    drawWheel();
  }, [prizes, rotation]);

  useEffect(() => {
    if (isSpinning) {
      startSpin();
    }
  }, [isSpinning]);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);

    const numPrizes = prizes.length || 1;
    const anglePerPrize = (2 * Math.PI) / numPrizes;

    prizes.forEach((prize, index) => {
      const startAngle = index * anglePerPrize;
      const endAngle = startAngle + anglePerPrize;

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = COLORS[index % COLORS.length];
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.rotate(startAngle + anglePerPrize / 2);
      ctx.textAlign = "center";
      ctx.fillStyle = "white";
      ctx.font = "bold 16px sans-serif";
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fillText(prize.name, radius * 0.65, 0);
      ctx.restore();
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.strokeStyle = "hsl(var(--primary))";
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.restore();
  };

  const startSpin = () => {
    const spinDuration = 4000; // 4 seconds
    const startTime = Date.now();
    const startRotation = rotation;
    const numRotations = 5 + Math.random() * 3; // 5-8 full rotations
    const extraDegrees = Math.random() * 360; // Random stop position
    const totalRotation = numRotations * 360 + extraDegrees;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);

      // Easing function for deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRotation = startRotation + totalRotation * easeOut;

      setRotation(currentRotation % 360);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Determine winner
        const finalRotation = currentRotation % 360;
        const anglePerPrize = 360 / prizes.length;
        // Pointer is at top (270 degrees in canvas coordinates)
        const adjustedRotation = (270 - finalRotation + 360) % 360;
        const winnerIndex = Math.floor(adjustedRotation / anglePerPrize);
        onSpinComplete(prizes[winnerIndex]);
      }
    };

    animate();
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="max-w-full h-auto"
        style={{ filter: "drop-shadow(0 20px 60px rgba(0, 0, 0, 0.15))" }}
      />
      {/* Pointer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
        <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[35px] border-l-transparent border-r-transparent border-t-primary drop-shadow-lg" />
      </div>
    </div>
  );
};
