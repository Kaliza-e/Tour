# Requirements Document

## Introduction

The Tour research platform currently feels static. This feature elevates the entire site from a passive information display to a lively, responsive experience by adding micro-animations, hover effects, entrance animations, interactive states, loading feedback, and polished transitions across every major UI surface.

The scope covers: component cards (PublicationCard, QuestionCard, research page cards), the Button component, the AI Assistant modal, the Navbar, the Footer, and all landing page sections (hero, feature cards, "how it works" steps, CTA). The implementation must use Framer Motion (already installed at v11.3.8) and Tailwind CSS utilities. All animations must respect the `prefers-reduced-motion` media query already handled in `globals.css`.

## Glossary

- **Animation_System**: The combination of Framer Motion variants and Tailwind transition utilities used to add motion to UI elements.
- **PublicationCard**: The card component in `components/publication-card.tsx` that displays a research paper summary.
- **QuestionCard**: The card component in `components/question-card.tsx` that displays a research question with like, researcher count, and view stats.
- **ResearchCard**: The inline card `div` in `app/research/page.tsx` that shows a paper in the Explore Research grid.
- **AIAssistantModal**: The floating assistant component in `components/ai-assistant-modal.tsx`.
- **Navbar**: The sticky navigation component in `components/navbar.tsx`.
- **Footer**: The footer component in `components/footer.tsx`.
- **LandingPage**: The root page component in `app/page.tsx`.
- **Button**: The shared button component in `components/ui/button.tsx`.
- **Entrance_Animation**: A Framer Motion animation that plays once when an element enters the viewport.
- **Micro_animation**: A subtle animation (scale, color, opacity shift) triggered by user interaction such as hover, focus, or click.

---

## Requirements

### Requirement 1: Card Hover Micro-animations

**User Story:** As a visitor, I want cards to respond visually when I hover over them, so that the interface feels alive and I can tell elements are interactive.

#### Acceptance Criteria

1. WHEN a user hovers over a PublicationCard, THE Animation_System SHALL elevate the card to the `shadow-soft` shadow level and transition the title color from `navy` to `sapphire` within 200ms using ease-out.
2. WHEN a user hovers over a QuestionCard, THE Animation_System SHALL elevate the card to the `shadow-soft` shadow level and transition the title color from `navy` to `sapphire` within 200ms using ease-out.
3. WHEN a user hovers over a research paper card on the Research page, THE Animation_System SHALL elevate the card to the `shadow-soft` shadow level and transition the title color from `navy` to `sapphire` within 200ms using ease-out.
4. WHEN a user's pointer leaves a card, THE Animation_System SHALL return the card to its resting shadow level (no elevation above baseline) and its original title color within 200ms using ease-in.
5. WHEN a user hovers over a PublicationCard or QuestionCard, THE Animation_System SHALL apply a scale transform of `1.01` to the card's direct child wrapper element within 200ms.
6. IF the operating system or browser reports a `prefers-reduced-motion: reduce` preference, THEN THE Animation_System SHALL suppress all translate and scale transforms on cards (no elevation lift, no scale on inner wrapper) while preserving title color transitions.

---

### Requirement 2: Interactive Heart / Like Button on QuestionCard

**User Story:** As a visitor, I want the heart icon on a QuestionCard to respond to clicks with a satisfying animation, so that liking a question feels rewarding and intentional.

#### Acceptance Criteria

1. WHEN a user clicks the heart icon on a QuestionCard that is not yet liked, THE Animation_System SHALL animate the heart icon by scaling it to `1.4` over 150ms with ease-out, then returning to `1.0` over 100ms, and fill it with the `sapphire` color.
2. IF the heart icon is in a liked state, THEN THE Animation_System SHALL render it filled and in `sapphire` color.
3. WHEN a user clicks a liked heart icon, THE Animation_System SHALL transition the heart icon back to its unfilled state with `navy/50` stroke color within 150ms.
4. THE QuestionCard SHALL maintain liked state per session in a React `useState` hook, initialized from the `likes` prop value, with no persistence across page reloads until a backend integration is added.
5. WHEN a user clicks the heart icon to like, THE Animation_System SHALL increment the displayed like count by one; WHEN a user clicks to unlike, THE Animation_System SHALL decrement the displayed like count by one.
6. IF the operating system or browser reports a `prefers-reduced-motion: reduce` preference, THEN THE Animation_System SHALL update the heart's fill and color without the scale bounce animation.

---

### Requirement 3: Button Interactive States

**User Story:** As a user, I want all buttons to provide clear visual feedback on hover, focus, and active states, so that I can confidently navigate and interact with the platform.

#### Acceptance Criteria

1. WHEN a user hovers over a Button with variant `primary`, THE Button SHALL apply a `scale(1.03)` transform and deepen background color from `navy` to `sapphire` within 200ms.
2. WHEN a user presses and holds a Button, THE Button SHALL apply an `active:scale-95` transform to simulate a physical press within 100ms.
3. WHEN a Button receives keyboard focus, THE Button SHALL display a visible `2px` outline in `sapphire` color with `3px` offset that follows the button's border-radius, consistent with the existing `:focus-visible` rule.
4. WHEN a user hovers over a Button with variant `ghost`, THE Button SHALL apply a background fill of `navy` at 5% opacity and a `scale(1.02)` transform within 200ms.
5. WHEN a user hovers over a Button with variant `secondary`, THE Button SHALL apply a border color transition from `navy/20` to `navy` and a `scale(1.02)` transform within 200ms.
6. IF the operating system or browser reports a preference for reduced motion, THEN all Button transitions and transforms SHALL be suppressed per the existing global `prefers-reduced-motion` CSS rule.

---

### Requirement 4: AI Assistant Modal Polish

**User Story:** As a user, I want the AI Assistant modal to open and close with smooth animations and provide visual feedback during message exchanges, so that the assistant feels polished and premium.

#### Acceptance Criteria

1. WHEN a user opens the AIAssistantModal, THE Animation_System SHALL animate the modal panel from `scale(0.95)` and `opacity: 0` to `scale(1)` and `opacity: 1` over 250ms with an ease-out curve.
2. WHEN a user closes the AIAssistantModal, THE Animation_System SHALL animate the modal panel from `scale(1)` and `opacity: 1` to `scale(0.95)` and `opacity: 0` over 200ms.
3. WHEN the backdrop of the AIAssistantModal is rendered, THE Animation_System SHALL fade it from `opacity: 0` to `opacity: 1` over 200ms.
4. WHEN a new assistant message is added to the conversation, THE Animation_System SHALL animate the message bubble from `translateY(8px)` and `opacity: 0` to `translateY(0)` and `opacity: 1` over 200ms.
5. WHEN a user clicks a preset button (Abstract Guide, APA Citations, Methodology Help), THE Animation_System SHALL apply a press animation that scales the button to `0.95` over 100ms and transitions the background to a highlighted color over 150ms.
6. WHEN the AIAssistantModal is waiting for an AI response, THE Animation_System SHALL display a typing indicator of three animated dots in the message stream; WHEN the response is received, THE Animation_System SHALL remove the typing indicator.
7. WHEN a user hovers over the floating trigger button for the AIAssistantModal, THE Animation_System SHALL apply a `scale(1.08)` transform and an elevated box-shadow using the `sapphire` design token color within 200ms.
8. IF the operating system or browser reports a `prefers-reduced-motion: reduce` preference, THEN THE Animation_System SHALL complete all transitions in no more than 16ms, with no scale or translate motion.

---

### Requirement 5: Navbar Smooth Transitions and Link States

**User Story:** As a visitor, I want the Navbar links to give clear interactive feedback and the mobile drawer to open and close smoothly, so that navigation feels fluid.

#### Acceptance Criteria

1. WHEN a user hovers over an inactive Navbar link, THE Navbar SHALL transition the link pill's background to `navy` at 6% opacity and text to full `navy` within 150ms and apply a `scale(1.02)` transform on the link pill.
2. WHEN a Navbar link is in the active state, THE Navbar SHALL display it with a filled `navy` background and `ivory` text with no hover transform applied.
3. WHEN the mobile menu button is clicked to open the drawer, THE Navbar SHALL animate the drawer in from `translateY(-8px)` and `opacity: 0` to `translateY(0)` and `opacity: 1` over 250ms.
4. WHEN the mobile menu button is clicked to close the drawer, THE Navbar SHALL animate the drawer out from `translateY(0)` and `opacity: 1` to `translateY(-8px)` and `opacity: 0` over 200ms.
5. WHEN the mobile drawer close animation begins, THE Navbar SHALL keep the drawer mounted in the DOM for the full 200ms duration before removing it from the layout.
6. WHEN the Navbar transitions between its unscrolled and scrolled states, THE Navbar SHALL apply padding and shadow changes smoothly over 300ms (already present, must remain unchanged).
7. WHEN a user hovers over the mobile hamburger button, THE Navbar SHALL transition its background from `white` to `ivory` within 150ms.
8. IF the operating system or browser reports a `prefers-reduced-motion: reduce` preference, THEN THE Navbar SHALL suppress all `translate` and `scale` animations while preserving `color` and `opacity` transitions.

---

### Requirement 6: Footer Link Hover Effects

**User Story:** As a visitor, I want footer links to respond visually when hovered, so that the footer feels intentional rather than static.

#### Acceptance Criteria

1. WHEN a user hovers over a Footer navigation link, THE Footer SHALL transition the text color from `ivory/60` to `ivory` within 150ms and apply a `translateX(3px)` nudge within 150ms.
2. WHEN a user's pointer leaves a Footer navigation link, THE Footer SHALL transition the text color back to `ivory/60` and return position to `translateX(0)` within 150ms.
3. THE Footer SHALL render a right-arrow indicator (`→`) inline after each link text that transitions from `opacity: 0` to `opacity: 1` within 150ms on hover, and returns to `opacity: 0` within 150ms on pointer-leave.
4. IF the operating system or browser reports a `prefers-reduced-motion: reduce` preference, THEN THE Footer SHALL suppress all `translate` transforms and the arrow opacity transition per the existing global CSS rule, applying only the text color transition.

---

### Requirement 7: Landing Page Entrance Animations

**User Story:** As a first-time visitor, I want page sections to animate into view as I scroll down, so that the landing page feels dynamic and draws me through the content.

#### Acceptance Criteria

1. WHEN the LandingPage hero heading enters the viewport (crossing a 10% visibility threshold), THE Animation_System SHALL animate it from `translateY(20px)` and `opacity: 0` to `translateY(0)` and `opacity: 1` over 600ms with ease-out.
2. WHEN the LandingPage hero subtext and CTA buttons enter the viewport, THE Animation_System SHALL animate them in sequentially with a 100ms stagger delay per element after the heading animation begins, using the same translateY and opacity transition.
3. WHEN a "Why Tour" feature card enters the viewport, THE Animation_System SHALL animate each card from `translateY(24px)` and `opacity: 0` to `translateY(0)` and `opacity: 1` over 500ms with a 120ms stagger between cards.
4. WHEN a "Why Tour" feature card is hovered, THE Animation_System SHALL apply a `scale(1.02)` transform and elevate to the `shadow-soft` level within 200ms.
5. WHEN the "Choose Your Path" cards enter the viewport (crossing a 10% visibility threshold), THE Animation_System SHALL animate each card from `opacity: 0` and `translateY(24px)` to `opacity: 1` and `translateY(0)` with a 150ms stagger delay between cards.
6. WHEN the "How It Works" step icons enter the viewport (crossing a 10% visibility threshold), THE Animation_System SHALL animate each hexagonal step icon from `scale(0.8)` and `opacity: 0` to `scale(1)` and `opacity: 1` over 400ms with a 150ms stagger.
7. WHEN a "How It Works" step icon is hovered, THE Animation_System SHALL apply a `scale(1.08)` transform and a `rotate(5deg)` tilt to the icon shape within 200ms.
8. WHEN the CTA section enters the viewport, THE Animation_System SHALL animate the heading and button from `translateY(16px)` and `opacity: 0` to `translateY(0)` and `opacity: 1` over 500ms.
9. WHEN the Featured Questions and Latest Publications section headers enter the viewport, THE Animation_System SHALL animate them from `opacity: 0` and `translateX(-12px)` to `opacity: 1` and `translateX(0)` over 400ms.
10. IF the operating system or browser reports a `prefers-reduced-motion: reduce` preference, THEN THE Animation_System SHALL disable all entrance translate and scale animations and reveal elements at `opacity: 1` immediately on mount with no transition.

---

### Requirement 8: General Site Cursor and Transition Feedback

**User Story:** As a user, I want all interactive elements to visibly acknowledge my interactions through consistent transition feedback, so that the platform feels cohesive and responsive.

#### Acceptance Criteria

1. THE Animation_System SHALL apply `cursor: pointer` to all interactive card elements (PublicationCard, QuestionCard, research paper cards on the Research page) to communicate clickability.
2. WHEN any interactive element on the site transitions any CSS property on hover, THE Animation_System SHALL use a transition duration of no less than 150ms and no more than 300ms for all properties on all site components.
3. THE Animation_System SHALL use consistent easing — `ease-out` for entering states (hover-in, open) and `ease-in` for exiting states (hover-out, close) — across all animated elements.
4. WHEN a category filter pill on the Questions page or Research page is selected, THE Animation_System SHALL animate the background fill from `ivory/50` to `navy` and the text color from `navy` to `ivory` over 200ms.
5. WHEN a category filter pill on the Questions page or Research page is deselected, THE Animation_System SHALL animate the background fill from `navy` to `ivory/50` and the text color from `ivory` to `navy` over 200ms.
6. IF the operating system or browser reports a `prefers-reduced-motion: reduce` preference, THEN THE Animation_System SHALL suppress only geometric transform transitions (translate, scale, rotate) while preserving color and opacity transitions at their standard durations.
