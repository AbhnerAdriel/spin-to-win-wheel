import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

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
            Congratulations!
          </DialogTitle>
          <DialogDescription className="text-center text-xl pt-4">
            You won:
          </DialogDescription>
        </DialogHeader>
        <div className="bg-primary/10 rounded-lg p-6 my-4">
          <p className="text-2xl font-bold text-center text-primary">
            {winner.name}
          </p>
        </div>
        <Button onClick={onClose} className="w-full" size="lg">
          Spin Again
        </Button>
      </DialogContent>
    </Dialog>
  );
};
