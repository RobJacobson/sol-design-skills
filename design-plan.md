# Streakly redesign plan

Streakly should feel like a personal habit ledger. The memorable detail is the inked check mark on a daily record. The design repeats that mark at three scales, from one habit in the checklist to a week of check-ins to the full 12-week grid.

## Palette

| Color | Hex | Role |
| --- | --- | --- |
| Ballpoint | `#202445` | Text, fine rules, and the dark workspace base |
| Stamp Indigo | `#3439A0` | The landing cover, primary actions, completed marks, and the darkest activity cells |
| Carbon Blue | `#DCE2FA` | Inset tracks, selected surfaces, and lighter activity cells |
| Ledger Paper | `#EEF1F7` | Workspace and landing background |
| Card Stock | `#FCFDFF` | Habit sheets, forms, and light text on indigo |
| Tab Yellow | `#F3CF62` | The streak tab, the hero action, and the current day marker |

Derive dark-mode surfaces and intermediate chart shades from these colors. Use text, outlines, and check marks to convey selection alongside color.

## Type and spacing

**Instrument Serif** sets the wordmark, page and section headings, prices, and the streak count. Its narrow proportions let both lines of the landing headline carry equal weight. **Atkinson Hyperlegible Next** sets body text, navigation, forms, buttons, and chart labels. Use tabular figures for chart values and habit counts. Keep prose left-aligned with a short measure, and use longer spacing between sections than between controls within one sheet.

## Layout

```text
Landing                        Dashboard                     Settings
[brand  links  actions]        [nav] Date / Hi, Alex          [nav] Settings
[indigo cover        ]         [nav] Checklist | Streak      [nav] Profile | Preferences
[headline  punch card]         [nav]           | Week         [nav] One divided sheet
[three feature columns]        [nav] Activity  | 12-week grid
[Free | Pro] [footer]
```

- **Landing** opens on a flat indigo cover with left-aligned type and a slightly rotated habit card showing the existing sample check-ins. The feature columns share a ruled band. Free and Pro sit together on a divided pricing sheet.
- **Dashboard** puts the checklist on paper nearest the main action. The inked streak tab and ruled weekly chart share a progress column. The 12-week grid is a calendar strip with a distinct outline around today.
- **Settings and dialogs** use the same sheet, rules, type, and controls. Settings divides profile from preferences on desktop and stacks them on phones. The habit form presents icons and day targets as selectable marks. Keep action labels visible, keyboard focus explicit, and all 12 calendar columns in view on narrow screens.

## Review against the brief

The first sketch used a browser mockup and separate rounded tiles for every section. The revised design makes the sample checklist itself the hero illustration and reserves the yellow tab for the streak, the first action, and today. This ties the visual hierarchy to checking in regularly. The existing routes, copy, controls, pricing, and sample data define what appears on every sheet.
