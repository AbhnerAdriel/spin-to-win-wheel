import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";

interface Prize {
  id: string;
  name: string;
}

interface PrizeManagerProps {
  prizes: Prize[];
  onPrizesChange: (prizes: Prize[]) => void;
}

export const PrizeManager = ({ prizes, onPrizesChange }: PrizeManagerProps) => {
  const [newPrizeName, setNewPrizeName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const addPrize = () => {
    if (newPrizeName.trim()) {
      const newPrize: Prize = {
        id: Date.now().toString(),
        name: newPrizeName.trim(),
      };
      onPrizesChange([...prizes, newPrize]);
      setNewPrizeName("");
    }
  };

  const startEdit = (prize: Prize) => {
    setEditingId(prize.id);
    setEditingName(prize.name);
  };

  const saveEdit = () => {
    if (editingName.trim()) {
      onPrizesChange(
        prizes.map((p) =>
          p.id === editingId ? { ...p, name: editingName.trim() } : p
        )
      );
      setEditingId(null);
      setEditingName("");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const deletePrize = (id: string) => {
    onPrizesChange(prizes.filter((p) => p.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      action();
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Prizes</h2>

      {/* Add Prize */}
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Enter prize name..."
          value={newPrizeName}
          onChange={(e) => setNewPrizeName(e.target.value)}
          onKeyPress={(e) => handleKeyPress(e, addPrize)}
          className="flex-1"
        />
        <Button onClick={addPrize} size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Prize List */}
      <div className="space-y-2">
        {prizes.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No prizes yet. Add your first prize above!
          </p>
        ) : (
          prizes.map((prize) => (
            <div
              key={prize.id}
              className="flex items-center gap-2 p-3 rounded-lg bg-secondary"
            >
              {editingId === prize.id ? (
                <>
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, saveEdit)}
                    className="flex-1"
                    autoFocus
                  />
                  <Button
                    onClick={saveEdit}
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={cancelEdit}
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <span className="flex-1 font-medium">{prize.name}</span>
                  <Button
                    onClick={() => startEdit(prize)}
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => deletePrize(prize.id)}
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
