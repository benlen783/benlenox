// ============================================================
// TYPING ANIMATION
// Cycles through a list of role titles in the hero section,
// typing each one out character by character, then deleting it
// before moving to the next role — creating a typewriter effect.
// ============================================================

const roles = ['IT Support Specialist', 'MIS Graduate', 'Team Lead', 'Developer'];

let roleIndex = 0;    // which role we're currently typing
let charIndex = 0;    // how many characters of the current role are visible
let isDeleting = false; // whether we're currently erasing characters

const typedEl = document.getElementById('typed-text');

function type() {
  const current = roles[roleIndex];

  // Add or remove one character depending on direction
  typedEl.textContent = isDeleting
    ? current.slice(0, --charIndex)  // erase: shrink by one char
    : current.slice(0, ++charIndex); // type:  grow by one char

  // Deleting is faster than typing so it feels snappier
  let delay = isDeleting ? 60 : 100;

  if (!isDeleting && charIndex === current.length) {
    // Finished typing the full word — pause, then start deleting
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    // Finished deleting — move to the next role and start typing
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length; // wrap back to 0 after the last role
    delay = 400; // brief pause before typing the next word
  }

  setTimeout(type, delay);
}

type();


// ============================================================
// NAVIGATION — scroll effects + active link highlighting
// ============================================================

const nav = document.getElementById('nav');
const sections = document.querySelectorAll('section[id]'); // every section with an id
const navLinks = document.querySelectorAll('.nav-links a'); // all nav anchor tags

function onScroll() {
  // Add a frosted-glass background to the nav once the user scrolls down a bit
  nav.classList.toggle('scrolled', window.scrollY > 60);

  // Figure out which section is currently in view by checking scroll position
  // against each section's top offset. The last one that's above the viewport
  // midpoint wins — this handles sections of varying heights.
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 180) current = section.getAttribute('id');
  });

  // Highlight the nav link that matches the current section
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}

// { passive: true } tells the browser this handler won't call preventDefault(),
// which lets it optimize scroll performance
window.addEventListener('scroll', onScroll, { passive: true });


// ============================================================
// MOBILE HAMBURGER MENU
// On small screens the nav links collapse into a hidden menu
// that toggles open/closed when the hamburger button is clicked.
// ============================================================

const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('nav-links');

// Toggle the menu open or closed when the hamburger is clicked
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');   // animates the icon into an X
  navLinksEl.classList.toggle('open'); // shows/hides the link list
});

// Close the menu automatically when the user taps any nav link
// (so the menu doesn't stay open after navigating to a section)
navLinksEl.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
  });
});


// ============================================================
// SCROLL REVEAL
// Elements with the class "reveal" start invisible and slide up.
// When they enter the viewport, the "revealed" class is added,
// which triggers their CSS transition to fade + slide into place.
// Siblings that enter the viewport at the same time are staggered
// so they appear one after another rather than all at once.
// ============================================================

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('revealed'), i * 90); // stagger by 90ms each
        revealObserver.unobserve(entry.target); // only animate once
      }
    });
  },
  { threshold: 0.1 } // trigger when 10% of the element is visible
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


// ============================================================
// ANIMATED STAT COUNTERS
// The four numbers in the About section (300+, 150+, etc.)
// count up from 0 when they scroll into view, using an easing
// curve so they decelerate as they approach the final value.
// ============================================================

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10); // final value from data-target attribute
  const duration = 1400; // total animation time in milliseconds
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    // Ease-out cubic: starts fast, slows down near the end
    el.textContent = Math.floor((1 - Math.pow(1 - progress, 3)) * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target; // snap to exact final value
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target); // only animate once
      }
    });
  },
  { threshold: 0.5 } // wait until the counter is well into view before starting
);

document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));
