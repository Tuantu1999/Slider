# Slider
**Interactive Carousel Component**

# Objective
Build a reusable carousel (slider) component that supports drag and swipe interactions on both desktop and mobile devices.
The component should simulate real-world use cases such as **banner sliders, news carousels, or advertising placements.**

# Features
**Drag & Swipe Support:** Native implementation for Mouse and Touch events.

**Infinite Looping:** Seamless transition from the last slide back to the first without flickering.

**Smart Auto-slide:** Automatically moves every 3 seconds, with a "pause on hover" feature.

**Viewport Optimization:** Displays exactly 2.5 cards (750px width) as per requirements.

**Click Protection:** Intelligent logic to distinguish between a "drag" and a "click" to prevent accidental navigation.

**Fully Responsive:** Adapts to different screen sizes while maintaining the 300x300 card ratio.

# Tech Stack
**Framework:** ReactJS

**Styling:** CSS3 (Flexbox/Transitions)

# Installation & Getting Started
* git clone https://github.com/Tuantu1999/Slider.git
* cd Slider
* npm install
* npm run dev

# Project Structure
```text
SLIDER/
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── Components/
│   │   └── Slider.jsx        # Main Carousel logic & event handling
│   ├── data/
│   │   └── mockData.js       # JSON-formatted slide data
│   ├── App.css               # Main application styles
│   ├── App.jsx               # Root component
│   ├── index.css             # Global styles
│   └── main.jsx              # Entry point
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js
```

# Technical Implementation
**1. Drag (Mouse) and Swipe (Touch)**
To ensure a consistent feel across devices, I implemented a unified event handling logic:

* **Tracking:** Uses clientX and screenX to calculate the horizontal distance (delta) between the start and end of the interaction.

* **Threshold:** A minimum drag distance of 40px is required to trigger a slide change. If the user releases before 40px, the carousel "snaps" back to its current position.

* **Visual Feedback:** The cursor changes to grabbing during the interaction to provide immediate UX feedback.

**2. Infinite Loop Logic**
* **Cloning Technique:** The component clones the first few and last few items of the data array.

* **Seamless Jump:** When the slider reaches the end of the cloned set, it instantly resets to the original first/last item by disabling CSS transitions for a split second (transition: none), creating an illusion of an endless loop.

**3. Handling Edge Cases**
* **Preventing Accidental Clicks:** A common issue where a drag is registered as a click. I implemented a flag that monitors the moved distance. If the distance exceeds 5px, any onClick events on the cards are suppressed.

* **Pause on Hover:** The setInterval driving the auto-slide is cleared on mouseenter and re-initiated on mouseleave.

* **Smooth Animations:** Used transform: translateX() and transition: transform 0.5s ease-out to ensure the animation is GPU-accelerated and jitter-free.