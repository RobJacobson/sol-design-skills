import { useState } from 'react';
import { ArrowRight, CalendarDays, ChartNoAxesColumnIncreasing, Check, Flame, Plus, Sparkles, Sunrise } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { sampleHabits } from './habits.js';
import { Brand, CheckMark, Dialog, HabitIcon } from './ui.jsx';

const features = [
  { Icon: CalendarDays, color: 'orange', title: 'Make it yours', description: 'Start with a habit you can do today. Pick an icon and set a weekly goal that fits your life.' },
  { Icon: Flame, color: 'rose', title: 'Keep the streak alive', description: 'Check off your habits and watch your streak grow. A small win is still a win.' },
  { Icon: ChartNoAxesColumnIncreasing, color: 'green', title: 'See how far you’ve come', description: 'Spot patterns in your week and see 12 weeks of effort build up, one check-in at a time.' },
];

function DashboardPreview() {
  return (
    <div className="hero-stage" aria-hidden="true">
      <div className="landscape"><i className="sun" /><i className="hill far" /><i className="hill middle" /><i className="hill near" /></div>
      <div className="preview-window">
        <div className="preview-greeting">
          <div><strong>Good morning, Alex!</strong><p>Make time for a small win today.</p></div>
          <span className="preview-add"><Plus size={13} /> Add habit</span>
        </div>
        <div className="preview-card">
          <div className="preview-card-title"><strong>Today’s habits</strong><span>2 of 3 done</span></div>
          {sampleHabits.slice(0, 3).map((habit, index) => (
            <div key={habit.id} className="preview-habit">
              <HabitIcon name={habit.icon} />
              <div><strong>{habit.name}</strong><p>{habit.target} days per week</p></div>
              <CheckMark checked={index < 2} />
            </div>
          ))}
        </div>
        <div className="preview-week">
          <strong>This week</strong>
          <div className="preview-bars">{[58, 83, 50, 68, 93, 42, 16].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div>
        </div>
      </div>
      <div className="floating-streak">
        <span className="floating-streak-icon"><Flame size={23} fill="currentColor" /></span>
        <div><strong>8 day streak!</strong><span>Look at you go.</span></div>
      </div>
    </div>
  );
}

function SignUp({ onClose, onSignUp }) {
  function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get('name').trim();
    if (name) onSignUp({ name, email: data.get('email').trim() });
  }

  return (
    <Dialog title="Get started with Streakly" description="Create a profile to start tracking habits on this device." onClose={onClose}>
      <form onSubmit={submit} className="dialog-form">
        <label className="field">Name<input name="name" placeholder="Alex Morgan" autoComplete="name" required pattern=".*\S.*" maxLength={80} /></label>
        <label className="field">Email<input name="email" type="email" placeholder="you@example.com" autoComplete="email" required maxLength={254} /></label>
        <button className="button primary w-full" type="submit">Start tracking</button>
      </form>
    </Dialog>
  );
}

export default function Landing({ updateProfile }) {
  const [dialog, setDialog] = useState(null);
  const navigate = useNavigate();
  const start = () => setDialog('signup');
  const close = () => setDialog(null);

  return (
    <div className="marketing">
      <header className="marketing-header">
        <div className="site-container header-inner">
          <Brand />
          <nav className="marketing-nav" aria-label="Main navigation"><a href="#features">Features</a><a href="#pricing">Pricing</a></nav>
          <div className="header-actions"><Link className="text-link open-app" to="/dashboard">Dashboard</Link><button className="button primary button-small" onClick={start}>Get started</button></div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="site-container hero-inner">
            <div className="hero-copy">
              <div className="hero-kicker"><Sunrise size={18} /> Your daily habit tracker</div>
              <h1>Small habits.<br /><em>Big changes.</em></h1>
              <p>Build routines that stick, one small win at a time. Track your habits, keep your streak alive, and see how far you’ve come.</p>
              <div className="hero-actions"><button className="button primary hero-cta" onClick={start}>Start for free <ArrowRight size={16} /></button>
                <Link to="/dashboard" className="hero-demo">Try the dashboard</Link></div>
              <div className="hero-note"><Check size={15} /> No credit card needed</div>
            </div>
            <DashboardPreview />
          </div>
        </section>

        <section className="feature-section" id="features">
          <div className="site-container">
            <div className="section-heading"><h2>Make good habits stick.</h2><p>Small steps are easier when you have a place to track them.</p></div>
            <div className="feature-strip grid md:grid-cols-3">
              {features.map(({ Icon, color, title, description }) => (
                <article className="feature-card" key={title}>
                  <span className={`feature-icon icon-${color}`}><Icon size={23} strokeWidth={1.9} /></span>
                  <h3>{title}</h3><p>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="pricing-section" id="pricing">
          <div className="site-container pricing-layout">
            <div className="section-heading"><h2>Start small, for free.</h2><p>The essentials are free. More ways to track your progress are in the works.</p></div>
            <div className="pricing-grid grid sm:grid-cols-2">
              <article className="pricing-card">
                <h3>Free</h3><p>For building your everyday routine.</p>
                <div className="price"><strong>$0</strong><span> / forever</span></div>
                <ul>{['Daily habit checklist', 'Weekly goals and streaks', '12-week activity history'].map((item) => <li key={item}><Check size={17} />{item}</li>)}</ul>
                <button className="button secondary w-full" onClick={start}>Get started for free</button>
              </article>
              <article className="pricing-card pro-card">
                <div className="flex items-center justify-between gap-2"><h3>Pro</h3><span className="pro-label"><Sparkles size={13} /> In development</span></div>
                <p>For a deeper look at your habits.</p>
                <div className="price"><strong>$6</strong><span> / month</span></div>
                <ul>{['Everything in Free', 'Extended activity history', 'More detailed habit insights'].map((item) => <li key={item}><Check size={17} />{item}</li>)}</ul>
                <button className="button primary w-full" onClick={() => setDialog('pro')}>Explore Pro</button>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer className="marketing-footer">
        <div className="site-container footer-inner">
          <Brand />
          <nav aria-label="Footer navigation"><a href="#features">Features</a><a href="#pricing">Pricing</a><Link to="/dashboard">Dashboard</Link></nav>
          <p>© {new Date().getFullYear()} Streakly</p>
        </div>
      </footer>

      {dialog === 'signup' && <SignUp onClose={close} onSignUp={(profile) => { updateProfile(profile); navigate('/dashboard'); }} />}
      {dialog === 'pro' && <Dialog title="Streakly Pro" description="Pro is in development. You can use the Free plan today to track your habits, streaks, and 12 weeks of progress." onClose={close}><button className="button primary w-full mt-5" onClick={start}>Start for free</button></Dialog>}
    </div>
  );
}
