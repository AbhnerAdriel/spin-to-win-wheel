import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import confetti from "canvas-confetti";

interface Prize {
  id: string;
  name: string;
}

interface WinnerDisplayProps {
  winner: Prize | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WinnerDisplay = ({ winner, isOpen, onClose }: WinnerDisplayProps) => {
  useEffect(() => {
    if (isOpen && winner) {
      // Trigger confetti explosion
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      
      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50;

        confetti({
          particleCount,
          startVelocity: 30,
          spread: 360,
          origin: {
            x: randomInRange(0.1, 0.3),
            y: Math.random() - 0.2,
          },
        });
        confetti({
          particleCount,
          startVelocity: 30,
          spread: 360,
          origin: {
            x: randomInRange(0.7, 0.9),
            y: Math.random() - 0.2,
          },
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen, winner]);

  if (!winner) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-6 animate-bounce-in">
              <Trophy className="h-16 w-16 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-3xl">
            Que Azar!
          </DialogTitle>
          <DialogDescription className="text-center text-xl pt-4">
            Você tirou:
          </DialogDescription>
        </DialogHeader>
        <div className="bg-primary/10 rounded-lg p-6 my-4">
          <p className="text-2xl font-bold text-center text-primary">
            {winner.name}
          </p>
        </div>
        <Button onClick={onClose} className="w-full" size="lg">
          Girar Novamente
        </Button>
      </DialogContent>
    </Dialog>
  );
};
