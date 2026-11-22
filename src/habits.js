export function moveDay(date, offset) {
  const result = new Date(date);
  result.setDate(result.getDate() + offset);
  return result;
}

export function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function startOfWeek(date) {
  return moveDay(date, -((date.getDay() + 6) % 7));
}

export const sampleHabits = [
  { id: 'water', name: 'Drink a glass of water', icon: 'water', target: 7 },
  { id: 'read', name: 'Read 10 pages', icon: 'book', target: 5 },
  { id: 'move', name: 'Move for 20 minutes', icon: 'move', target: 4 },
  { id: 'journal', name: 'Write in my journal', icon: 'journal', target: 3 },
  { id: 'wind-down', name: 'Wind down by 10 pm', icon: 'moon', target: 5 },
];

export function createSampleData(today) {
  const completions = {};
  const sampleOrder = [0, 2, 1, 4, 3];
  const pattern = [3, 4, 2, 4, 5, 2, 0, 3, 1, 4, 5, 3, 2, 4, 0, 5, 3];

  for (let ago = 83; ago > 0; ago--) {
    const count = ago === 8 ? 0 : ago < 8 ? Math.max(1, pattern[ago]) : pattern[ago % pattern.length];
    if (count) completions[dateKey(moveDay(today, -ago))] = sampleOrder.slice(0, count).map((index) => sampleHabits[index].id);
  }

  completions[dateKey(today)] = ['water', 'read'];

  return {
    habits: sampleHabits,
    completions,
    profile: { name: 'Alex Morgan', email: 'alex.morgan@example.com', notifications: false, darkMode: false },
  };
}

export function toggleCompletion(completions, day, habitId) {
  const completed = completions[day] ?? [];
  return {
    ...completions,
    [day]: completed.includes(habitId)
      ? completed.filter((id) => id !== habitId)
      : [...completed, habitId],
  };
}

export function currentStreak(completions, today) {
  let day = completions[dateKey(today)]?.length ? today : moveDay(today, -1);
  let streak = 0;

  while (completions[dateKey(day)]?.length) {
    streak++;
    day = moveDay(day, -1);
  }

  return streak;
}

function weekDays(completions, monday, todayKey) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = moveDay(monday, index);
    const key = dateKey(date);
    return { date, key, count: completions[key]?.length ?? 0, future: key > todayKey };
  });
}

export function weeklyProgress(completions, today) {
  return weekDays(completions, startOfWeek(today), dateKey(today));
}

export function activityWeeks(completions, today) {
  const firstMonday = moveDay(startOfWeek(today), -77);
  const todayKey = dateKey(today);
  return Array.from({ length: 12 }, (_, week) => weekDays(completions, moveDay(firstMonday, week * 7), todayKey));
}
