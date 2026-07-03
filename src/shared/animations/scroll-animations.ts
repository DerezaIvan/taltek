export type ParallaxDef = readonly [
  sel: string,
  containerSel: string,
  startY: number,
  endY: number,
];

export const PARALLAX_ITEMS: ParallaxDef[] = [];

let observer: IntersectionObserver | null = null;
let parallaxRaf: number | null = null;
let scrollHandler: (() => void) | null = null;
let active = false;

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function observeScrollElements(): void {
  const elements = document.querySelectorAll<HTMLElement>('[data-anim]');
  if (!elements.length) return;

  if (prefersReducedMotion()) {
    for (const el of elements) {
      el.classList.add('is-visible');
    }
    return;
  }

  observer = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          entry.target.classList.remove('is-visible');
        }
      }
    },
    { threshold: 0, rootMargin: '0px 0px -10% 0px' }
  );

  for (const el of elements) {
    observer.observe(el);
  }
}

function applyStaggerDelays(): void {
  const staggerGroups = document.querySelectorAll<HTMLElement>('[data-anim-stagger]');
  for (const group of staggerGroups) {
    const animType = group.getAttribute('data-anim-type') ?? 'fade-up';
    const { children } = group;
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement;
      if (!child.hasAttribute('data-anim')) {
        child.setAttribute('data-anim', animType);
      }
      child.setAttribute('data-anim-delay', String(i + 1));
    }
  }
}

function collectParallax(): {
  el: HTMLElement;
  container: HTMLElement;
  startY: number;
  range: number;
}[] {
  return PARALLAX_ITEMS.reduce<
    { el: HTMLElement; container: HTMLElement; startY: number; range: number }[]
  >((items, [sel, containerSel, startY, endY]) => {
    const el = document.querySelector<HTMLElement>(sel);
    const container =
      el?.closest<HTMLElement>(containerSel) ?? document.querySelector<HTMLElement>(containerSel);
    if (el && container) items.push({ el, container, startY, range: endY - startY });
    return items;
  }, []);
}

function parallax(): void {
  if (prefersReducedMotion()) return;

  const items = collectParallax();
  if (!items.length) return;

  function update(): void {
    parallaxRaf = null;
    const vh = window.innerHeight;
    for (const { el, container, startY, range } of items) {
      const rect = container.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
      el.style.transform = `translateY(${startY + range * progress}px)`;
    }
  }

  scrollHandler = () => {
    if (parallaxRaf === null) {
      parallaxRaf = requestAnimationFrame(update);
    }
  };

  window.addEventListener('scroll', scrollHandler, { passive: true });
  update();
}

function start(): void {
  if (active) return;
  active = true;
  applyStaggerDelays();
  observeScrollElements();
  parallax();
}

function stop(): void {
  if (!active) return;
  active = false;

  observer?.disconnect();
  observer = null;

  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler);
    scrollHandler = null;
  }
  if (parallaxRaf !== null) {
    cancelAnimationFrame(parallaxRaf);
    parallaxRaf = null;
  }

  document.querySelectorAll<HTMLElement>('[data-anim]').forEach(el => {
    el.classList.remove('is-visible');
  });

  if (PARALLAX_ITEMS.length) {
    const parallaxSel = PARALLAX_ITEMS.map(([sel]) => sel).join(', ');
    document.querySelectorAll<HTMLElement>(parallaxSel).forEach(el => {
      el.style.transform = '';
    });
  }
}

export function initScrollAnimations(): void {
  start();
}

export function destroyScrollAnimations(): void {
  stop();
}

export function restartScrollAnimations(): void {
  stop();
  setTimeout(() => start(), 50);
}
