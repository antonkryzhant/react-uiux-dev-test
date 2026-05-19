# Changelog — Dashboard audit and fixes

## Overview

This document covers every intentional bug found in the codebase, why each one hurts users, and what was changed to fix it.

---

## CSS / Layout (`broken-layout.css`)

### 1. Horizontal overflow on laptop widths
**Bug:** `.oversized-panel { min-width: 720px; }` forced the Project health panel to be at least 720 px wide regardless of viewport, causing a horizontal scrollbar on common laptop screens (1280–1440 px).  
**Fix:** Removed the rule. The panel now fills its grid column naturally.

### 2. Mobile sidebar hidden under the topbar
**Bug:** `.sidebar { z-index: 4; }` overrode the media-query value of `z-index: 20` that `global.scss` correctly set for mobile. The result was that the open sidebar slid behind the sticky topbar (z-index: 5), making nav links unreachable.  
**Fix:** Removed the conflicting rule so the mobile sidebar stays in front.

### 3. Invisible keyboard focus rings
**Bug:** `button:focus, a:focus, input:focus, select:focus, textarea:focus { outline: none; }` stripped the browser's default focus indicator from every interactive element. Keyboard-only users had no way to see where focus was.  
**Fix:** Removed the rule. The default (or future custom) focus ring is now visible.

---

## Modal (`BuggyModal.jsx` → renamed `Modal`)

### 4. Event listener memory leak
**Bug:** `window.addEventListener('keydown', closeOnEscape)` was added when `open` became true but the `useEffect` returned no cleanup. Rapidly toggling the modal left multiple listeners active.  
**Fix:** Added `return () => window.removeEventListener('keydown', closeOnEscape)` so each effect run cleans up its own listener. `onClose` was also added to the dependency array.

### 5. Click inside modal closes it
**Bug:** The backdrop `onClick={onClose}` bubbled up through the inner `<section>` as well — clicking any child element (input, button) dismissed the modal instantly.  
**Fix:** Added `onClick={(e) => e.stopPropagation()}` to the modal card.

### 6. No focus management / inaccessible close button
**Bug:** Focus did not move into the modal on open (keyboard users were left in the background). The close button had the text "x" with no accessible label.  
**Fix:** Added `tabIndex={-1}` + `ref` to the card and called `cardRef.current?.focus()` on open. Added `aria-label="Close"` to the button and `aria-labelledby` linking the title to the `role="dialog"` element.

---

## Projects page (`Projects.jsx`)

### 7. Checkboxes could never be unchecked
**Bug:** `toggle(id)` always did `setSelected([...selected, id])` — it pushed the id again on every click, so `selected.includes(id)` was always true and the checkbox appeared stuck.  
**Fix:** Replaced with a functional toggle: `setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])`. Using the functional form also eliminates the stale-closure risk on rapid clicks.

### 8. Search ignored by filtered table
**Bug:** `useMemo` dependencies were `[status, sortAsc]` — `search` was missing. Typing in the global search bar did not update the project list.  
**Fix:** Added `search` to the dependency array.

### 9. Array index used as React key
**Bug:** `key={index}` on table rows causes React to mis-identify rows when the list is sorted or filtered, producing wrong DOM updates.  
**Fix:** Changed to `key={project.id}`.

---

## Settings page (`Settings.jsx`)

### 10. Timezone select was uncontrolled
**Bug:** `<select defaultValue={settings.timezone}>` ignores `value` and React state after mount. Saving never reflected the selected timezone.  
**Fix:** Changed to `value={settings.timezone}` with a corresponding `onChange` handler.

### 11. Email checkbox was read-only
**Bug:** `<input type="checkbox" checked={settings.emails} />` with no `onChange` — React issued a controlled-component warning and the checkbox could not be toggled.  
**Fix:** Added `onChange={(e) => setSettings(prev => ({ ...prev, emails: e.target.checked }))}`.

---

## Billing page (`Billing.jsx`)

### 12. Discount subtraction produced `NaN`
**Bug:** `discount` was stored as a string (direct input value). `total - discount` with an empty string yields `NaN`; with a non-empty string JavaScript coerces it to a number but the behaviour is fragile and surprising.  
**Fix:** Added `const discountValue = Number(discount) || 0` and subtracted that. The input was also given `type="number"` and a proper label.

### 13. Opaque "Toggle" button label
**Bug:** Every invoice had a button labelled "Toggle" — no context for screen-reader users or sighted users skimming the page.  
**Fix:** Changed button text to "Mark paid" / "Mark unpaid" based on current state, plus an `aria-label` that includes the invoice ID.

---

## Team page (`Team.jsx`)

### 14. `removeMember` silently failed
**Bug:** `members.splice(...)` mutated the array in place, then `setMembers(members)` passed the same array reference. React's shallow equality check saw no change and skipped the re-render — removed members stayed visible.  
**Fix:** Replaced with `setMembers(prev => prev.filter(m => m.id !== id))` which always produces a new array.

### 15. Over-100% capacity bar overflow
**Bug:** Jon Bell had 107% allocation. `style={{ width: '107%' }}` caused the meter bar to overflow its container.  
**Fix:** Clamped to `Math.min(member.capacity, 100)%` in the inline style.

---

## Support page (`Support.jsx`)

### 16. Empty tickets could be submitted
**Bug:** `addTicket()` had no guard — pressing "Add ticket" with a blank input created a ticket with `title: ''`, which the template then hid behind a fallback text.  
**Fix:** Added a trim check; if the field is empty a visible error message appears and the ticket is not added. The Enter key also submits the form.

### 17. Array index used as React key for tickets
**Bug:** `key={index}` causes React to confuse tickets when new ones are prepended (each existing ticket gets a new index, forcing unnecessary DOM work).  
**Fix:** Changed to `key={ticket.id}` — `Date.now()` IDs for new tickets are stable within the session.

---

## Dashboard (`Dashboard.jsx`)

### 18. Uncontrolled `<textarea>` reset on re-render
**Bug:** `<textarea defaultValue="...">` is only read on mount. Any re-render caused by parent state changes (e.g., the global search) would not reset the value but switching pages and back would.  
**Fix:** Converted to a controlled textarea with `useState('Notes for today...')`.

### 19. Empty-state missing for filtered project list
**Bug:** When the global search matched no projects, the health panel rendered a blank section with no feedback.  
**Fix:** Added a "No projects match your search." empty state.

---

## App shell (`main.jsx`)

### 20. `hashchange` listener never removed
**Bug:** The `useEffect` cleanup was `() => window.removeEventListener('hashchange', () => onHashChange())` — an anonymous arrow function that is a different reference from the one that was added, so `removeEventListener` did nothing. During Vite HMR each reload stacked another listener.  
**Fix:** Changed cleanup to `() => window.removeEventListener('hashchange', onHashChange)` — same reference.

### 21. Hash query strings broke routing
**Bug:** `window.location.hash.replace('#', '')` returned `"/team?tab=active"` as-is. No route matched, so the app silently fell back to the Dashboard.  
**Fix:** Added `.split('?')[0]` to strip the query string before route lookup.

### 22. Billing nav icon duplicated Projects icon
**Bug:** Both Projects and Billing used `ShoppingBag` from lucide-react — visually confusing in the sidebar.  
**Fix:** Changed Billing to `CreditCard`.

### 23. Nav key used label + index
**Bug:** `key={route.label + index}` is fragile and meaningless. If labels change or routes are reordered, React needlessly destroys and recreates nav items.  
**Fix:** Changed to `key={route.path}` which is stable and unique.

### 24. Search input missing accessible label
**Bug:** The global search `<input>` had no `<label>` or `aria-label`, making it unlabelled for screen readers.  
**Fix:** Added a visually-hidden `<label htmlFor="global-search">` and matching `id`.

---

## What I'd do next with more time

- **Filter & sort persistence** — save filter/sort state in the URL hash so users can share links to a specific view.
- **Global search coverage** — Reports, Team, and Support pages currently ignore `search`; they should filter their data consistently.
- **Proper focus trap in the modal** — cycle Tab/Shift+Tab within the modal and return focus to the trigger button on close.
- **Toast / notification system** — settings save, ticket add, and member remove all need consistent non-disruptive feedback.
- **Responsive table** — on narrow screens the data tables still require horizontal scroll; card-based or collapsible rows would be friendlier.
- **Input validation on the Billing discount** — reject negative values and values exceeding total.
- **Linting + basic tests** — add ESLint (react-hooks plugin to catch stale deps) and a few Vitest smoke tests for the toggle and remove-member logic.
