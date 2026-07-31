# Animation Guidelines

## Philosophy

Animation should guide users.

Not distract them.

Every animation must have a purpose.

Performance always comes first.

---

# Libraries

- GSAP
- ScrollTrigger
- React Three Fiber
- Drei

Avoid multiple animation libraries.

---

# Motion Style

- Smooth
- Premium
- Minimal
- Natural
- Responsive

Avoid flashy animations.

---

# Duration

Hover

150–200ms

Cards

200–300ms

Modal

250–350ms

Page Transition

300–500ms

Loading

<1500ms

---

# Easing

Preferred

- ease-out
- power2.out
- power3.out

Avoid

- bounce
- elastic
- exaggerated effects

---

# Hero

- Fade In
- Slide Up
- Slight Parallax
- CTA reveal

No heavy 3D.

---

# Scroll

Reveal once.

Small translate.

Small fade.

Avoid overusing pinning.

Maximum pinned sections

2

---

# Navbar

Scroll Down

Hide smoothly.

Scroll Up

Show smoothly.

Blur after scrolling.

---

# Cards

Hover

- Lift
- Soft shadow
- Image zoom (1.05)

Click

- Small press animation

---

# Studio Cards

Appear sequentially.

Reveal from bottom.

Maintain consistent delay.

---

# Studio Detail

Poker Card Reveal

↓

Fade

↓

Load Three.js

↓

Camera Intro

↓

Hotspots Fade In

---

# Three.js

Camera

Slow movement.

Orbit limited.

Lighting

Warm.

Natural.

No unnecessary particles.

Target

60 FPS

---

# Hotspots

Hover

Soft pulse.

Click

Open information panel.

Never block the scene.

---

# Schedule

Timeline

Smooth horizontal scroll.

Selected slot

Small scale.

Booked

Static.

Available

Subtle hover.

---

# Booking

Stepper

Smooth transition.

Confirmation

Check animation.

Optional confetti (minimal).

---

# Modals

Fade

+

Scale

No abrupt appearance.

---

# Toast

Fade Up

Auto hide

4 seconds

---

# Skeleton

Pulse animation.

Do not shimmer excessively.

---

# Loading Screen

Logo

↓

Waveform

↓

Fade Out

Maximum

1.5 seconds

---

# Page Transition

Fade

+

Small translate

Avoid full-screen wipes.

---

# Cursor Effects

Desktop only.

Very subtle.

Never replace the native cursor.

---

# Accessibility

Respect prefers-reduced-motion.

Disable non-essential animations.

Maintain usability.

---

# Performance Rules

Animate

opacity

transform

Avoid animating

width

height

top

left

box-shadow (heavy)

filter (heavy)

---

# Golden Rules

Animation supports UX.

Animation never delays users.

Keep it smooth.

Keep it meaningful.

Keep it lightweight.