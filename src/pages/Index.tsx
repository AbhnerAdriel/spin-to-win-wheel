import { useState } from "react";
import { PrizeWheel } from "@/components/PrizeWheel";
import { PrizeManager } from "@/components/PrizeManager";
import { WinnerDisplay } from "@/components/WinnerDisplay";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Prize {
  id: string;
  name: string;
}

const DEFAULT_PRIZES: Prize[] = [
  { id: "1", name: "10% Off" },
  { id: "2", name: "Free Shipping" },
  { id: "3", name: "$50 Gift Card" },
  { id: "4", name: "Try Again" },
  { id: "5", name: "20% Off" },
  { id: "6", name: "Free Item" },
];

const Index = () => {
  const [prizes, setPrizes] = useState<Prize[]>(DEFAULT_PRIZES);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Prize | null>(null);
  const [showWinner, setShowWinner] = useState(false);

  const handleSpin = () => {
    if (prizes.length === 0) {
      toast.error("Add at least one prize before spinning!");
      return;
    }
    if (isSpinning) return;

    setIsSpinning(true);
    setWinner(null);
    setShowWinner(false);
    toast.info("Spinning the wheel...");
  };

  const handleSpinComplete = (winningPrize: Prize) => {
    setIsSpinning(false);
    setWinner(winningPrize);
    setShowWinner(true);
  };

  return (
    <div 
      className="min-h-screen py-8 px-4 sm:px-6 lg:px-8"
      style={{ background: "var(--gradient-background)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Prize Wheel
          </h1>
          <p className="text-lg text-muted-foreground">
            Add your prizes, spin the wheel, and see what you win!
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Wheel Section */}
          <div className="flex flex-col items-center gap-6">
            <div className="bg-white dark:bg-card rounded-2xl p-6 sm:p-8" style={{ boxShadow: "var(--shadow-card)" }}>
              <PrizeWheel
                prizes={prizes}
                isSpinning={isSpinning}
                onSpinComplete={handleSpinComplete}
              />
            </div>
            <Button
              onClick={handleSpin}
              disabled={isSpinning || prizes.length === 0}
              size="lg"
              className="w-full sm:w-auto min-w-[200px] text-lg py-6"
            >
              {isSpinning ? "Spinning..." : "Spin the Wheel!"}
            </Button>
          </div>

          {/* Prize Manager Section */}
          <div>
            <PrizeManager prizes={prizes} onPrizesChange={setPrizes} />
          </div>
        </div>
      </div>

      {/* Winner Display */}
      <WinnerDisplay
        winner={winner}
        isOpen={showWinner}
        onClose={() => setShowWinner(false)}
      />
    </div>
  );
};

export default Index;
