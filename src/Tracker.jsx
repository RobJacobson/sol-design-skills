import { useState } from 'react';
import { ArrowUpRight, Bell, CalendarDays, Check, CircleCheck, Flame, LayoutGrid, Moon, Plus, Settings as SettingsIcon, Sun, UserRound } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { activityWeeks, currentStreak, dateKey, weeklyProgress } from './habits.js';
import { Brand, CheckMark, Dialog, HabitIcon, habitIcons } from './ui.jsx';

const format = (date, options) => date.toLocaleDateString('en-US', options);

export function TrackerLayout({ profile }) {
  const initials = profile.name.trim().split(/\s+/).slice(0, 2).map((word) => word[0]).join('').toUpperCase();
  return (
    <div className="tracker-shell">
      <aside className="tracker-sidebar">
        <Brand />
        <nav className="tracker-nav" aria-label="App navigation">
          <NavLink to="/dashboard" end><LayoutGrid size={18} /> Today</NavLink>
          <NavLink to="/settings"><SettingsIcon size={18} /> Settings</NavLink>
        </nav>
        <div className="sidebar-bottom">
          <Link className="back-to-site" to="/">Back to website <ArrowUpRight size={15} /></Link>
          <Link className="sidebar-profile" to="/settings"><span className="avatar">{initials}</span><span><strong>{profile.name}</strong><small>Free plan</small></span></Link>
        </div>
      </aside>
      <main className="tracker-main"><Outlet /></main>
    </div>
  );
}

function AddHabit({ onClose, onAdd }) {
  function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get('name').trim();
    if (!name) return;
    onAdd({ id: crypto.randomUUID(), name, icon: data.get('icon'), target: Number(data.get('target')) });
    onClose();
  }

  return (
    <Dialog title="Add a habit" description="Pick one small thing you’d like to do regularly." onClose={onClose}>
      <form className="dialog-form" onSubmit={submit}>
        <label className="field">Habit name<input name="name" placeholder="e.g. Take a 10-minute walk" required maxLength={80} pattern=".*\S.*" /></label>
        <fieldset className="field"><legend>Icon</legend><div className="icon-options">
          {Object.entries(habitIcons).map(([id, { label }]) => (
            <label key={id} className="icon-option" title={label}><input className="sr-only" type="radio" name="icon" value={id} defaultChecked={id === 'sprout'} /><HabitIcon name={id} /><span className="sr-only">{label}</span></label>
          ))}
        </div></fieldset>
        <fieldset className="field"><legend>Days per week</legend><div className="days-options">
          {Array.from({ length: 7 }, (_, index) => index + 1).map((day) => (
            <label key={day} className="day-option"><input className="sr-only" type="radio" name="target" value={day} defaultChecked={day === 7} /><span>{day}<span className="sr-only"> {day === 1 ? 'day' : 'days'} per week</span></span></label>
          ))}
        </div></fieldset>
        <div className="dialog-actions"><button type="button" className="button secondary" onClick={onClose}>Cancel</button><button type="submit" className="button primary"><Plus size={18} /> Add habit</button></div>
      </form>
    </Dialog>
  );
}

function HabitList({ habits, completions, week, onToggle }) {
  const count = completions.length;
  return (
    <section className="panel habits-panel" aria-labelledby="habits-title">
      <div className="panel-heading habits-heading">
        <div><h2 id="habits-title">Today’s habits</h2><p>Make a little time for each one.</p></div>
        <span className="count-pill"><CircleCheck size={15} /> {count} of {habits.length} done</span>
      </div>
      <progress className="habit-progress" max={habits.length || 1} value={count} aria-label="Habits completed today" />
      <ul className="habit-list">
        {habits.map((habit) => {
          const done = completions.includes(habit.id);
          return (
            <li key={habit.id}>
              <label className="habit-row">
                <HabitIcon name={habit.icon} />
                <span className="habit-copy"><span className="habit-name">{habit.name}</span><small>{week.filter((day) => day.includes(habit.id)).length} / {habit.target} {habit.target === 1 ? 'day' : 'days'} this week</small></span>
                <input type="checkbox" className="sr-only" aria-label={habit.name} checked={done} onChange={() => onToggle(habit.id)} />
                <CheckMark checked={done} />
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function StreakCard({ streak }) {
  return (
    <section className="streak-panel" aria-labelledby="streak-title">
      <div className="streak-copy">
        <h2 id="streak-title">Current streak</h2>
        <p className="streak-value">{streak} <span>{streak === 1 ? 'day' : 'days'}</span></p>
        <p className="streak-note">{streak ? 'One check-in a day keeps it going.' : 'Check off a habit to start your streak.'}</p>
      </div>
      <span className="streak-symbol" aria-hidden="true"><Flame size={44} strokeWidth={1.55} /></span>
    </section>
  );
}

function WeeklyChart({ week, todayKey }) {
  const total = week.reduce((sum, day) => sum + day.count, 0);
  const max = Math.max(5, ...week.map((day) => day.count));
  return (
    <section className="panel weekly-panel" aria-labelledby="week-title">
      <div className="panel-heading"><div><h2 id="week-title">This week</h2><p>{total} {total === 1 ? 'check-in' : 'check-ins'} since Monday</p></div><CalendarDays size={19} className="subtle-icon" /></div>
      <ul className="weekly-chart" aria-label="Daily habit check-ins" style={{ '--chart-unit': `${100 / max}%` }}>
        {week.map(({ date, key, count, future }) => (
          <li key={key} className={key === todayKey ? 'chart-today' : ''} aria-label={`${format(date, { weekday: 'long' })}: ${future ? 'Upcoming' : count}`}>
            <span className="chart-number" aria-hidden="true">{future ? '·' : count}</span>
            <div className="bar-track" aria-hidden="true">
              <span className="bar-fill" style={{ height: `${count / max * 100}%` }} />
            </div>
            <span className="chart-label" aria-hidden="true">{format(date, { weekday: 'short' })}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function heatLevel(count) {
  return Math.min(4, count);
}

function ActivityGrid({ completions, today }) {
  const weeks = activityWeeks(completions, today);
  const activeDays = weeks.flat().filter((day) => day.count > 0).length;
  const todayKey = dateKey(today);

  return (
    <section className="panel activity-panel" aria-labelledby="activity-title">
      <div className="panel-heading activity-heading"><div><h2 id="activity-title">Activity</h2><p>Your last 12 weeks of check-ins</p></div><span className="activity-total"><strong>{activeDays}</strong> active days</span></div>
      <table className="activity-table" aria-label="Habit completions by day over the last 12 weeks">
        <thead><tr><td />{weeks.map(([day], index) => {
          const month = format(day.date, { month: 'short' });
          const showMonth = index === 0 || day.date.getMonth() !== weeks[index - 1][0].date.getMonth();
          return <th key={day.key} scope="col"><span className="sr-only">Week of {format(day.date, { month: 'long', day: 'numeric' })}</span>{showMonth && <span aria-hidden="true">{month}</span>}</th>;
        })}</tr></thead>
        <tbody>{weeks[0].map(({ date, key }, index) => (
          <tr key={key}>
            <th scope="row">{format(date, { weekday: 'short' })}</th>
            {weeks.map((week) => {
              const day = week[index];
              const label = `${format(day.date, { month: 'short', day: 'numeric' })}: ${day.future ? 'Upcoming' : `${day.count} ${day.count === 1 ? 'check-in' : 'check-ins'}`}`;
              return <td key={day.key} title={label} aria-current={day.key === todayKey ? 'date' : undefined}><span className={`heat-cell ${day.future ? 'future-cell' : `heat-${heatLevel(day.count)}`}`}><span className="sr-only">{label}</span></span></td>;
            })}
          </tr>
        ))}</tbody>
      </table>
      <div className="activity-legend" aria-label="Activity scale from fewer to more check-ins"><span>Less</span>{[0, 1, 2, 3, 4].map((level) => <i key={level} className={`heat-${level}`} />)}<span>More</span></div>
    </section>
  );
}

export function Dashboard({ data, today, onToggle, onAdd }) {
  const [adding, setAdding] = useState(false);
  const day = dateKey(today);
  const completed = data.completions[day] ?? [];
  const week = weeklyProgress(data.completions, today);
  const firstName = data.profile.name.split(/\s+/)[0];

  return (
    <div className="workspace">
      <header className="workspace-heading">
        <div>
          <p className="workspace-date"><CalendarDays size={16} /> {format(today, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          <h1>Hi, {firstName}</h1>
          <p className="workspace-description">What small win will you make time for today?</p>
        </div>
        <button className="button primary" onClick={() => setAdding(true)}><Plus size={19} /> Add habit</button>
      </header>

      {data.profile.notifications && today.getHours() >= 18 && completed.length < data.habits.length && (
        <p className="reminder"><Bell size={18} /> A little reminder: you still have {data.habits.length - completed.length} {data.habits.length - completed.length === 1 ? 'habit' : 'habits'} left today.</p>
      )}

      <div className="dashboard-grid">
        <HabitList habits={data.habits} completions={completed} week={week.map((entry) => data.completions[entry.key] ?? [])} onToggle={(id) => onToggle(day, id)} />
        <div className="dashboard-summary"><StreakCard streak={currentStreak(data.completions, today)} /><WeeklyChart week={week} todayKey={day} /></div>
        <ActivityGrid completions={data.completions} today={today} />
      </div>
      {adding && <AddHabit onClose={() => setAdding(false)} onAdd={onAdd} />}
    </div>
  );
}

function ToggleRow({ Icon, field, label, description, profile, updateProfile }) {
  return (
    <label className="toggle-row">
      <span className="preference-icon"><Icon size={20} /></span>
      <span className="preference-copy"><strong>{label}</strong><small>{description}</small></span>
      <input className="sr-only" type="checkbox" role="switch" checked={profile[field]} aria-label={label} onChange={(event) => updateProfile({ [field]: event.target.checked })} />
      <span className="toggle-track" aria-hidden="true"><i /></span>
    </label>
  );
}

export function Settings({ profile, updateProfile }) {
  const [saved, setSaved] = useState(false);

  function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get('name').trim();
    if (!name) return;
    updateProfile({ name, email: data.get('email').trim() });
    setSaved(true);
  }

  return (
    <div className="workspace settings-page">
      <header className="workspace-heading"><div><h1>Settings</h1><p className="workspace-description">Manage your profile and make Streakly yours.</p></div></header>
      <div className="settings-grid">
        <section className="panel settings-panel" aria-labelledby="profile-title">
          <div className="settings-panel-heading"><span className="settings-icon icon-orange"><UserRound size={21} /></span><div><h2 id="profile-title">Profile</h2><p>Update the details you use in Streakly.</p></div></div>
          <form className="profile-form" onSubmit={submit} onInput={() => setSaved(false)}>
            <label className="field">Name<input name="name" defaultValue={profile.name} autoComplete="name" required maxLength={80} pattern=".*\S.*" /></label>
            <label className="field">Email<input name="email" type="email" defaultValue={profile.email} autoComplete="email" required maxLength={254} /></label>
            <div className="profile-actions"><button type="submit" className="button primary">Save changes</button><span className="save-status" role="status">{saved && <><Check size={16} /> Saved</>}</span></div>
          </form>
        </section>
        <section className="panel settings-panel" aria-labelledby="preferences-title">
          <div className="settings-panel-heading"><span className="settings-icon icon-violet"><SettingsIcon size={21} /></span><div><h2 id="preferences-title">Preferences</h2><p>Changes are saved automatically on this device.</p></div></div>
          <ToggleRow Icon={Bell} field="notifications" label="Notifications" description="Show a reminder in the app after 6 pm if you have habits left." profile={profile} updateProfile={updateProfile} />
          <ToggleRow Icon={profile.darkMode ? Moon : Sun} field="darkMode" label="Dark mode" description="Use a darker theme for your workspace." profile={profile} updateProfile={updateProfile} />
        </section>
      </div>
    </div>
  );
}
