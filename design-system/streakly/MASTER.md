# Streakly design system

A busy adult opening Today should be able to find a habit, check it off, and put the phone away. The checklist leads the dashboard. A warm amber panel acknowledges a streak, while the quieter weekly chart and calendar offer more detail for people who want it.

## Visual style

Use warm paper surfaces, forest-green ink, rounded corners and fine rules. The landing preview sits inside a cut-paper sunrise made of a flat sun and three overlapping hills. The rings around the dashboard flame repeat the sunrise detail at a smaller scale. Keep illustration outside reading and input areas. Shadows belong to surfaces that appear to float, such as the preview and dialogs.

The UI UX Pro Max Habit Tracker profile informed the green check-ins, amber streaks and product-led landing page. Streakly uses a quieter palette and the locally bundled typefaces for the adult audience. Shared implementation values live in [tokens.css](../../src/tokens.css), with layout and component states in [styles.css](../../src/styles.css).

## Color

| Role | Light | Dark workspace | Use |
| --- | --- | --- | --- |
| Paper | `#FAF8F1` | `#1B241F` | Page background |
| Surface | `#FFFDF7` | `#242F28` | Cards, inputs and dialogs |
| Ink | `#233B32` | `#F1F3E8` | Headings, values and body |
| Secondary ink | `#57675C` | `#BDC9B9` | Dates, captions and help |
| Rule | `#D9DED1` | `#445246` | Card edges and dividers |
| Control edge | `#798574` | `#8B9B89` | Empty checks, inputs and off switches |
| Forest | `#275A46` | `#AED3B2` | Primary buttons, completed checks and focus rings |
| Forest hover | `#194533` | `#C6E4C8` | Hover and press on primary buttons |
| On forest | `#FFFDF7` | `#1E3528` | Primary button text and check marks |
| Sage wash | `#E3EDDF` | `#334B3A` | Completion count and progress track |
| Honey | `#F6D5A0` | `#513E2A` | Streak card and current weekday label |
| On honey | `#583819` | `#F7D9AC` | Text and flame on honey |
| Evergreen | `#223E34` | `#19251E` | Navigation surface |

Navigation uses cream `#FFFDF7` text, pale sage `#C9D9C9` secondary text and `#E3EDDF` for the selected row. For the light landing illustration, use sky `#F3E6CB`, sun `#EAB470` and hills `#CBD7AC`, `#A9C19D`, `#7E9F81` from back to front.

Habit icons pair a symbol with a consistent ink and wash. Exercise and plant use Forest on Sage. The table lists the remaining pairs.

| Category | Light ink / wash | Dark ink / wash |
| --- | --- | --- |
| Water | `#345F74` / `#E0EDF0` | `#B7DCE8` / `#30454C` |
| Book and moon | `#655581` / `#EEE8F3` | `#DDCFEA` / `#443D4E` |
| Journal and coffee | `#88502D` / `#F7E6CF` | `#EECEA6` / `#4C4031` |
| Apple | `#894E54` / `#F5E5DF` | `#ECC2C4` / `#4E393B` |

## Typography

**Instrument Serif Regular** sets the wordmark and large editorial headings. The landing headline uses its italic on the second line. Keep display lines short and use sentence case.

**Atkinson Hyperlegible Next** sets all body copy, small headings, controls, form entries, helper text and numbers. Prices, dates, streaks, weekly targets, axis labels and active-day totals use lining, tabular figures. Personalized headings use the same sans-serif digits. Pair the large streak number with a smaller unit on the same baseline.

| Role | Size at default zoom | Treatment |
| --- | --- | --- |
| Landing headline | 68–116 px | Serif regular and italic |
| Workspace heading | 52–76 px | Serif regular |
| Card heading | 33 px | Serif regular |
| Price / streak | 44 / 52 px | Sans 600 |
| Body and form text | 16–18 px | Sans, 1.5 line height for prose |
| Labels and controls | 14–16 px | Sans medium or semibold |
| Compact annotations | 12–14 px | Sans with the full value visible |

## Spacing and shape

| Token | rem | px at default zoom | Use |
| --- | --- | --- | --- |
| `--space-1` | .25 | 4 | Closely related values and units |
| `--space-2` | .5 | 8 | Inline icon and label |
| `--space-3` | .75 | 12 | Caption and action groups |
| `--space-4` | 1 | 16 | Phone card padding |
| `--space-5` | 1.5 | 24 | Desktop card padding and grid gaps |
| `--space-6` | 2 | 32 | Heading to content |
| `--space-7` | 3 | 48 | Workspace top inset and phone sections |
| `--space-8` | 4 | 64 | Desktop marketing sections |

## Components and page layout

- **Buttons.** Use a forest pill with a semibold label, a minimum height of 46 px and 24 px horizontal padding. Compact buttons are 44 px tall. Secondary actions use the surface color and a 1 px control edge. Keep the 2 px keyboard focus ring outside the control. Color transitions take 160 ms and respect reduced motion.
- **Cards.** Use an 18 px radius, a 1 px rule and 24 px internal space, reduced to 16 px on phones. Make only actionable rows and controls respond to hover. Keep the streak panel amber and the other dashboard panels paper-colored.
- **Habits and forms.** Make the whole habit row a target. Show completion with a filled circle and check. Keep inputs at least 44 px tall, with a visible label above. A selected day has a filled background and a selected icon has an inset outline. Switch position also communicates its state.
- **Landing.** Lead with the existing sample checklist alongside the sign-up action. Follow with three feature columns, then Free and Pro cards. Stack the preview below the headline on phones.
- **Dashboard.** Place the checklist beside the streak and weekly chart, followed by the full-width activity calendar. Stack the panels on phones and keep all twelve calendar columns visible.
- **Settings and dialogs.** Give profile and preferences separate cards. Use one column on phones. Sign-up, Pro and Add habit share the same dialog surface, heading, close control, backdrop and focus treatment.

## Charts

| Check-ins for a day | Light activity cell | Dark activity cell |
| --- | --- | --- |
| 0 | `#E8EBE1` | `#344138` |
| 1 | `#CBDCC0` | `#4A634F` |
| 2 | `#9ABB95` | `#64876A` |
| 3 | `#5E8769` | `#8BB193` |
| 4 or more | `#275A46` | `#C2DFC0` |

Use the level-three color for weekly bars and Forest for today. Print the counts above the bars and highlight today's weekday. Keep upcoming dates distinct from zero with a dashed calendar cell. Ring today's cell, label the intensity scale from Less to More, and retain the exact per-day counts in the calendar's text alternatives and titles.

## Anti-patterns to avoid

- Red missed-day cells, countdowns, streak-loss warnings or guilt-based reminders.
- Leaderboards and comparisons that turn a personal routine into a competition.
- Confetti, pulsing flames and animated counters that interrupt a quick check-in.
- Display-serif prices, tiny chart legends or low-contrast helper text.
- Using a color change as the sole indication of a completed habit or selected day.
- Treating future days as missed goals, or allowing an empty day to dominate the chart.
- Hiding essential instructions behind hover, removing keyboard focus rings or clipping calendar columns on phones.
