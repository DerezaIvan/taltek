import { browser } from '$app/environment';

const YANDEX_METRIKA_ID = 111451644;

export const METRIKA_GOALS = {
  PULSE_TTT_CLICK: 'pulse_ttt_click'
} as const;

export function reachGoal(goal: (typeof METRIKA_GOALS)[keyof typeof METRIKA_GOALS]): void {
  if (!browser || typeof window.ym !== 'function') {
    return;
  }

  try {
    window.ym(YANDEX_METRIKA_ID, 'reachGoal', goal);
  } catch {
    // Метрика недоступна (блокировщики и т.п.) — не ломаем клик по кнопке.
  }
}
