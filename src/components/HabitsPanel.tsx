import { X, Plus } from "lucide-react";
import { useState, useEffect } from "react";

interface Habit {
  name: string;
  done: boolean;
}

interface HabitsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HabitsPanel = ({ isOpen, onClose }: HabitsPanelProps) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("habits");
    if (saved) {
      setHabits(JSON.parse(saved));
    }
  }, []);

  const saveHabits = (updated: Habit[]) => {
    setHabits(updated);
    localStorage.setItem("habits", JSON.stringify(updated));
  };

  const addHabit = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newHabit.trim()) {
      saveHabits([...habits, { name: newHabit.trim(), done: false }]);
      setNewHabit("");
    }
  };

  const toggleHabit = (index: number) => {
    const updated = habits.map((h, i) =>
      i === index ? { ...h, done: !h.done } : h
    );
    saveHabits(updated);
  };

  const removeHabit = (index: number) => {
    const updated = habits.filter((_, i) => i !== index);
    saveHabits(updated);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-24 right-8 w-72 bg-card rounded-2xl p-5 shadow-deep z-40">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-card-foreground">Daily Habits</h3>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
        >
          <X className="w-4 h-4 text-foreground" />
        </button>
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          onKeyPress={addHabit}
          placeholder="Add new habit..."
          className="w-full px-4 py-3 pr-10 rounded-xl bg-muted border-none outline-none text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
        />
        <Plus className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      </div>

      <ul className="space-y-2 max-h-60 overflow-y-auto">
        {habits.map((habit, i) => (
          <li
            key={i}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
          >
            <input
              type="checkbox"
              checked={habit.done}
              onChange={() => toggleHabit(i)}
              className="w-5 h-5 rounded-md accent-primary cursor-pointer"
            />
            <span
              className={`flex-1 text-sm ${
                habit.done
                  ? "text-muted-foreground line-through"
                  : "text-card-foreground"
              }`}
            >
              {habit.name}
            </span>
            <button
              onClick={() => removeHabit(i)}
              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </li>
        ))}
        {habits.length === 0 && (
          <li className="text-center text-muted-foreground text-sm py-4">
            No habits yet. Add one above!
          </li>
        )}
      </ul>
    </div>
  );
};
