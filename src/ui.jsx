import { useLayoutEffect, useRef } from 'react';
import { Apple, BookOpen, Check, Coffee, Droplet, Dumbbell, Flame, Moon, NotebookPen, Sprout, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const habitIcons = {
  water: { label: 'Water', Icon: Droplet, color: 'blue' },
  book: { label: 'Book', Icon: BookOpen, color: 'violet' },
  move: { label: 'Exercise', Icon: Dumbbell, color: 'green' },
  journal: { label: 'Journal', Icon: NotebookPen, color: 'orange' },
  moon: { label: 'Moon', Icon: Moon, color: 'violet' },
  sprout: { label: 'Plant', Icon: Sprout, color: 'green' },
  coffee: { label: 'Coffee', Icon: Coffee, color: 'orange' },
  apple: { label: 'Apple', Icon: Apple, color: 'rose' },
};

export function Brand({ linked = true }) {
  const content = <><span className="brand-mark"><Flame size={20} strokeWidth={2.4} /></span><span>Streakly<span className="brand-period">.</span></span></>;
  return linked ? <Link to="/" className="brand" aria-label="Streakly home">{content}</Link> : <span className="brand">{content}</span>;
}

export function HabitIcon({ name }) {
  const { Icon, color } = habitIcons[name] ?? habitIcons.sprout;
  return <span className={`habit-icon icon-${color}`} aria-hidden="true"><Icon size={20} strokeWidth={1.9} /></span>;
}

export function CheckMark({ checked }) {
  return <span className={`check-mark${checked ? ' is-checked' : ''}`} aria-hidden="true">{checked && <Check size={15} strokeWidth={2.8} />}</span>;
}

export function Dialog({ title, description, onClose, children }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    dialog.querySelector('input')?.focus();
    return () => dialog.close();
  }, []);

  return (
    <dialog ref={ref} className="dialog" aria-labelledby="dialog-title" aria-describedby="dialog-description"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="dialog-body">
        <button type="button" className="icon-button dialog-close" aria-label="Close dialog" onClick={onClose}><X size={21} /></button>
        <h2 id="dialog-title">{title}</h2>
        <p id="dialog-description" className="muted">{description}</p>
        {children}
      </div>
    </dialog>
  );
}
