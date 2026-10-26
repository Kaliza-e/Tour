# Tour AI Manual Verification Checklist: Row 49 (Mobile & Keyboard Accessibility)

This document provides the human verification procedures for acceptance test Row 49 (`(Open widget on phone & keyboard accessibility: Tab, Enter, Esc)`), as specified in the Tour AI acceptance criteria.

---

## Acceptance Criteria
- **Mobile Viewport**: The Tour AI panel floats above page content and does not cover or block the mobile bottom/top navigation bar.
- **Focus Management**:
  - When the user opens the chat bubble, focus automatically moves into the text input field.
  - When the user presses `Escape`, the chat panel closes immediately and keyboard focus is restored to the "Ask Tour AI" trigger button.
- **Keyboard Navigation**:
  - `Tab` moves logically across interactive elements (input, send button, suggestion chips, action buttons, feedback thumbs, close button).
  - `Enter` submits the question when inside the text input.
- **Reduced Motion**: The widget respects `prefers-reduced-motion` settings.
- **Slow Connections**: UI displays a pulsing indicator while awaiting server-sent events without freezing.

---

## Step-by-Step Test Script

### 1. Keyboard Navigation on Desktop
1. Open any page on the Tour site (e.g. `/` or `/get-published`).
2. Press `Tab` until the focus ring lands on the "Ask Tour AI" floating bubble.
3. Press `Enter` or `Space` to open the panel.
4. **Verify**: Focus is automatically placed inside the text input box (`Ask a question about Tour...`).
5. Type `What is Tour?` and press `Enter`.
6. **Verify**: The question submits, a typing indicator appears, and the answer renders with action buttons.
7. Press `Tab` to navigate to the action button (e.g., `About Tour`). Press `Enter` to verify it navigates.
8. Press `Escape`.
9. **Verify**: The panel closes smoothly, and focus returns to the "Ask Tour AI" bubble button.

### 2. Mobile Viewport Check
1. Open Chrome DevTools (`F12`), toggle Device Toolbar (`Ctrl+Shift+M`), and select **iPhone 14** or **Pixel 7**.
2. Navigate across pages: `/`, `/about`, `/research`, `/volunteer`.
3. **Verify**: The floating bubble sits at `bottom-6 right-4`, comfortably above any bottom navigation.
4. Tap the bubble to open the chat panel.
5. **Verify**:
   - The panel occupies up to `88vh` on mobile, anchored with rounded top borders.
   - A semi-transparent backdrop prevents accidental background clicks.
   - The close (`X`) button in the top right is easily tappable (minimum 44x44px touch target).
   - Tapping outside the panel on the backdrop closes the panel cleanly.

### 3. Screen Reader & ARIA Verification
1. Inspect the trigger button: `aria-label="Open Tour AI assistant chat"`, `aria-haspopup="dialog"`, `aria-expanded="true/false"`.
2. Inspect the panel container: `role="dialog"`, `aria-modal="true"`, `aria-label="Tour AI Assistant Chat Window"`.
3. Inspect input field: `aria-label="Type your question for Tour AI"`.

---

## Result Status
- **Status**: Verified in component architecture (`components/tour-ai-widget.tsx`).
- **Owner**: Frontend QA / Accessibility Reviewer.
