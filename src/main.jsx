import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import '@fontsource/instrument-serif/400.css';
import '@fontsource-variable/atkinson-hyperlegible-next/wght.css';
import './styles.css';
import Landing from './Landing.jsx';
import { Dashboard, Settings, TrackerLayout } from './Tracker.jsx';
import { createSampleData, toggleCompletion } from './habits.js';

const storageKey = 'streakly-data-v1';

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (Array.isArray(saved?.habits) && saved?.completions && saved?.profile) return saved;
  } catch {
    // The tracker can run in memory when browser storage is unavailable.
  }
  return createSampleData(new Date());
}

function App() {
  const [data, setData] = useState(loadData);
  const [today, setToday] = useState(() => new Date());
  const [storageError, setStorageError] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [data]);

  useEffect(() => {
    const timer = window.setInterval(() => setToday(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = pathname !== '/' && data.profile.darkMode ? 'dark' : 'light';
  }, [pathname, data.profile.darkMode]);

  useEffect(() => {
    document.title = pathname === '/settings' ? 'Settings — Streakly' : pathname === '/dashboard' ? 'Today — Streakly' : 'Streakly — Make good habits stick';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  const updateProfile = (changes) => setData((previous) => ({ ...previous, profile: { ...previous.profile, ...changes } }));
  const addHabit = (habit) => setData((previous) => ({ ...previous, habits: [...previous.habits, habit] }));
  const toggleHabit = (day, id) => setData((previous) => ({ ...previous, completions: toggleCompletion(previous.completions, day, id) }));

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing updateProfile={updateProfile} />} />
        <Route element={<TrackerLayout profile={data.profile} />}>
          <Route path="/dashboard" element={<Dashboard data={data} today={today} onToggle={toggleHabit} onAdd={addHabit} />} />
          <Route path="/settings" element={<Settings profile={data.profile} updateProfile={updateProfile} />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {storageError && <p className="storage-error" role="status">Browser storage is unavailable. Changes will be lost when you leave this page.</p>}
    </>
  );
}

createRoot(document.getElementById('root')).render(<BrowserRouter><App /></BrowserRouter>);
