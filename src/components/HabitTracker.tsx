import { X, Plus, Trash2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { AIMotivationBox } from "./AIMotivationBox";

interface Habit {
  id: string;
  name: string;
  color: string;
  goal: number;
  completedDays: number[];
}

interface HabitTrackerProps {
  isOpen: boolean;
  onClose: () => void;
}

const COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", 
  "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9",
  "#F8B500", "#00CED1", "#FF69B4", "#32CD32", "#FF8C00"
];

const DEFAULT_HABITS: Habit[] = [
  { id: "1", name: "Drink 2L of Water", color: "#45B7D1", goal: 31, completedDays: [1, 2, 3, 5, 7, 8, 10] },
  { id: "2", name: "Exercise or Move Your Body", color: "#F8B500", goal: 23, completedDays: [1, 2, 3, 4, 5, 8, 9, 10] },
  { id: "3", name: "Read for 20 Minutes", color: "#FF8C00", goal: 31, completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { id: "4", name: "Eat 3+ Servings of Fruit/Veggies", color: "#96CEB4", goal: 31, completedDays: [2, 4, 6, 8, 10] },
  { id: "5", name: "Sleep 7+ Hours", color: "#FFEAA7", goal: 31, completedDays: [1, 2, 3, 5, 6, 7, 8, 9] },
  { id: "6", name: "Morning Stretch or Yoga", color: "#FF6B6B", goal: 31, completedDays: [1, 3, 5, 7, 9] },
  { id: "7", name: "Floss & Brush Twice Daily", color: "#DDA0DD", goal: 31, completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { id: "8", name: "No Social Media for 1 Hour", color: "#BB8FCE", goal: 23, completedDays: [1, 2, 5, 8] },
  { id: "9", name: "Write in Journal", color: "#F8B500", goal: 9, completedDays: [1, 5, 9] },
  { id: "10", name: "Skincare Routine", color: "#4ECDC4", goal: 31, completedDays: [1, 2, 3, 4, 5, 6, 7] },
  { id: "11", name: "No Phone After 9PM", color: "#FF69B4", goal: 23, completedDays: [2, 4, 6] },
  { id: "12", name: "Make Your Bed", color: "#32CD32", goal: 31, completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { id: "13", name: "No Spend Day", color: "#00CED1", goal: 15, completedDays: [1, 5, 10] },
];

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export const HabitTracker = ({ isOpen, onClose }: HabitTrackerProps) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [newHabitName, setNewHabitName] = useState("");
  const [showAddHabit, setShowAddHabit] = useState(false);

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long' });
  const year = currentMonth.getFullYear();
  const daysInMonth = new Date(year, currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, currentMonth.getMonth(), 1).getDay();
  const today = new Date().getDate();
  const isCurrentMonth = new Date().getMonth() === currentMonth.getMonth() && new Date().getFullYear() === year;

  useEffect(() => {
    const saved = localStorage.getItem("habitTracker");
    if (saved) {
      setHabits(JSON.parse(saved));
    } else {
      setHabits(DEFAULT_HABITS);
    }
  }, []);

  const saveHabits = (updated: Habit[]) => {
    setHabits(updated);
    localStorage.setItem("habitTracker", JSON.stringify(updated));
  };

  const toggleDay = (habitId: string, day: number) => {
    const updated = habits.map(h => {
      if (h.id === habitId) {
        const days = h.completedDays.includes(day)
          ? h.completedDays.filter(d => d !== day)
          : [...h.completedDays, day];
        return { ...h, completedDays: days };
      }
      return h;
    });
    saveHabits(updated);
  };

  const addHabit = () => {
    if (!newHabitName.trim()) return;
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName.trim(),
      color: COLORS[habits.length % COLORS.length],
      goal: daysInMonth,
      completedDays: [],
    };
    saveHabits([...habits, newHabit]);
    setNewHabitName("");
    setShowAddHabit(false);
  };

  const removeHabit = (id: string) => {
    saveHabits(habits.filter(h => h.id !== id));
  };

  const todayProgress = useMemo(() => {
    const completed = habits.filter(h => h.completedDays.includes(today)).length;
    return { completed, total: habits.length, percentage: habits.length > 0 ? Math.round((completed / habits.length) * 100) : 0 };
  }, [habits, today]);

  const weeklyStats = useMemo(() => {
    const weekStart = Math.max(1, today - (today % 7 || 7) + 1);
    const weekEnd = Math.min(daysInMonth, weekStart + 6);
    let completed = 0;
    let total = 0;
    habits.forEach(h => {
      for (let d = weekStart; d <= weekEnd; d++) {
        total++;
        if (h.completedDays.includes(d)) completed++;
      }
    });
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [habits, today, daysInMonth]);

  const monthlyStats = useMemo(() => {
    let completed = 0;
    let total = 0;
    habits.forEach(h => {
      total += h.goal;
      completed += h.completedDays.length;
    });
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [habits]);

  const mostConsistent = useMemo(() => {
    return [...habits]
      .map(h => ({ ...h, percentage: h.goal > 0 ? Math.round((h.completedDays.length / h.goal) * 100) : 0 }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 10);
  }, [habits]);

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-card w-full max-w-7xl max-h-[90vh] rounded-2xl shadow-deep overflow-hidden flex flex-col">
        {/* Rainbow Header */}
        <div className="h-3 bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400" />
        
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-card-foreground">{monthName}'s Habits</h2>
            <p className="text-sm text-muted-foreground">- Tracker -</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Month:</label>
              <select 
                value={currentMonth.getMonth()}
                onChange={(e) => setCurrentMonth(new Date(year, parseInt(e.target.value), 1))}
                className="bg-muted rounded-lg px-3 py-1.5 text-sm border-none outline-none"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>{new Date(2000, i, 1).toLocaleDateString('en-US', { month: 'long' })}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Year:</label>
              <select 
                value={year}
                onChange={(e) => setCurrentMonth(new Date(parseInt(e.target.value), currentMonth.getMonth(), 1))}
                className="bg-muted rounded-lg px-3 py-1.5 text-sm border-none outline-none"
              >
                {[2024, 2025, 2026].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="xl:col-span-3 space-y-6">
              {/* Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Today's Progress */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Today's Progress</h3>
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20">
                      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                        <circle 
                          cx="18" cy="18" r="16" fill="none" 
                          stroke="url(#progressGradient)" 
                          strokeWidth="3"
                          strokeDasharray={`${todayProgress.percentage} 100`}
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#FF9AA2" />
                            <stop offset="50%" stopColor="#B5EAD7" />
                            <stop offset="100%" stopColor="#C7CEEA" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-foreground">{todayProgress.completed}/{todayProgress.total}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-foreground">{todayProgress.percentage}%</p>
                      <p className="text-xs text-muted-foreground">completed today</p>
                    </div>
                  </div>
                </div>

                {/* Weekly Progress */}
                <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-5">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Weekly Progress</h3>
                  <p className="text-3xl font-bold text-foreground mb-1">{weeklyStats.completed}/{weeklyStats.total}</p>
                  <div className="h-2 bg-white rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-teal-400 rounded-full" style={{ width: `${weeklyStats.percentage}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{weeklyStats.percentage}% this week</p>
                </div>

                {/* Monthly Progress */}
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-5">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Month's Progress</h3>
                  <p className="text-3xl font-bold text-foreground mb-1">{monthlyStats.completed}/{monthlyStats.total}</p>
                  <div className="h-2 bg-white rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full" style={{ width: `${monthlyStats.percentage}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{monthlyStats.percentage}% completed</p>
                </div>
              </div>

              {/* Habits Table */}
              <div className="bg-white rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-3 font-medium text-muted-foreground sticky left-0 bg-muted/50 min-w-[200px]">
                          Habits for {monthName} {year}
                          <div className="text-xs font-normal">Total of {habits.length} Habits</div>
                        </th>
                        <th className="p-2 font-medium text-muted-foreground text-center min-w-[50px]">Goal</th>
                        <th className="p-2 font-medium text-muted-foreground text-center min-w-[50px]">Done</th>
                        {days.map(day => (
                          <th 
                            key={day} 
                            className={`p-1 font-medium text-center min-w-[28px] ${
                              isCurrentMonth && day === today ? 'bg-gradient-coral text-foreground rounded' : 'text-muted-foreground'
                            }`}
                          >
                            <div className="text-[10px]">{WEEKDAYS[(firstDayOfMonth + day - 1) % 7]}</div>
                            <div className="text-xs">{day}</div>
                          </th>
                        ))}
                        <th className="p-2 font-medium text-muted-foreground text-center min-w-[60px]">%</th>
                        <th className="p-2 min-w-[40px]"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {habits.map((habit, idx) => {
                        const progress = habit.goal > 0 ? Math.round((habit.completedDays.length / habit.goal) * 100) : 0;
                        return (
                          <tr key={habit.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-muted/20'}>
                            <td className="p-3 sticky left-0 bg-inherit">
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: habit.color }} />
                                <span className="font-medium text-card-foreground truncate">{habit.name}</span>
                              </div>
                            </td>
                            <td className="p-2 text-center text-muted-foreground">{habit.goal}</td>
                            <td className="p-2 text-center font-medium text-card-foreground">{habit.completedDays.length}</td>
                            {days.map(day => (
                              <td key={day} className="p-1 text-center">
                                <button
                                  onClick={() => toggleDay(habit.id, day)}
                                  className={`w-5 h-5 rounded border-2 transition-all ${
                                    habit.completedDays.includes(day)
                                      ? 'border-transparent'
                                      : 'border-gray-300 hover:border-gray-400'
                                  }`}
                                  style={habit.completedDays.includes(day) ? { backgroundColor: habit.color } : {}}
                                >
                                  {habit.completedDays.includes(day) && (
                                    <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                  )}
                                </button>
                              </td>
                            ))}
                            <td className="p-2 text-center">
                              <span 
                                className="px-2 py-0.5 rounded text-xs font-medium"
                                style={{ 
                                  backgroundColor: `${habit.color}20`,
                                  color: habit.color 
                                }}
                              >
                                {progress}%
                              </span>
                            </td>
                            <td className="p-2 text-center">
                              <button 
                                onClick={() => removeHabit(habit.id)}
                                className="text-muted-foreground hover:text-destructive transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Add Habit Row */}
                <div className="p-3 border-t border-border bg-muted/30">
                  {showAddHabit ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newHabitName}
                        onChange={(e) => setNewHabitName(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addHabit()}
                        placeholder="Enter habit name..."
                        className="flex-1 px-3 py-2 rounded-lg bg-card border border-border outline-none focus:ring-2 focus:ring-ring text-sm"
                        autoFocus
                      />
                      <button onClick={addHabit} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">Add</button>
                      <button onClick={() => setShowAddHabit(false)} className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm">Cancel</button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setShowAddHabit(true)}
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-sm">Add new habit</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar - Most Consistent & AI Motivation */}
            <div className="space-y-4">
              {/* AI Motivation Box */}
              <AIMotivationBox habits={habits} currentDay={today} />
              
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-5">
                <h3 className="font-bold text-card-foreground mb-4">🏆 Most Consistent Habits</h3>
                <div className="space-y-3">
                  {mostConsistent.map((habit, idx) => (
                    <div key={habit.id} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: habit.color }} />
                      <span className="flex-1 text-sm text-card-foreground truncate">{habit.name}</span>
                      <span className="text-xs font-medium text-muted-foreground">[{habit.percentage}%]</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5">
                <h3 className="font-bold text-card-foreground mb-4">📊 Quick Stats</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Days in Month</span>
                    <span className="font-medium text-card-foreground">{daysInMonth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Habits</span>
                    <span className="font-medium text-card-foreground">{habits.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Perfect Days</span>
                    <span className="font-medium text-card-foreground">
                      {days.filter(d => habits.every(h => h.completedDays.includes(d))).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completion Rate</span>
                    <span className="font-medium text-card-foreground">{monthlyStats.percentage}%</span>
                  </div>
                </div>
              </div>

              {/* Color Legend */}
              <div className="bg-white rounded-xl p-5 border border-border">
                <h3 className="font-bold text-card-foreground mb-4">🎨 Habit Colors</h3>
                <div className="grid grid-cols-5 gap-2">
                  {COLORS.map((color, idx) => (
                    <div 
                      key={idx}
                      className="w-6 h-6 rounded-full cursor-pointer hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={`Color ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
