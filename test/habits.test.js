import assert from 'node:assert/strict';
import { test } from 'node:test';
import { activityWeeks, createSampleData, currentStreak, dateKey, moveDay, toggleCompletion, weeklyProgress } from '../src/habits.js';

const saturday = new Date(2026, 10, 21, 12);

test('a check-in is reversible and a pending day preserves yesterday’s streak', () => {
  const yesterday = dateKey(moveDay(saturday, -1));
  const day = dateKey(saturday);
  const original = { [yesterday]: ['read'] };
  const completed = toggleCompletion(original, day, 'read');

  assert.equal(currentStreak(original, saturday), 1);
  assert.equal(currentStreak(completed, saturday), 2);
  assert.equal(currentStreak(toggleCompletion(completed, day, 'read'), saturday), 1);
  assert.equal(currentStreak(original, moveDay(saturday, 1)), 0);
});

test('weekly and 12-week views agree on the current week and mark future days', () => {
  const { completions } = createSampleData(saturday);
  const week = weeklyProgress(completions, saturday);
  const history = activityWeeks(completions, saturday);

  assert.equal(history.length, 12);
  assert.equal(history.flat().length, 84);
  assert.deepEqual(history.at(-1), week);
  assert.equal(week[0].key, '2026-11-16');
  assert.equal(week[5].count, 2);
  assert.equal(week[6].future, true);
  assert.equal(currentStreak(completions, saturday), 8);
});
