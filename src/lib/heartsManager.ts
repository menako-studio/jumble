import type { HeartsState } from '../types';

export const MAX_HEARTS = 5;
export const HEART_REFILL_INTERVAL_MS = 4 * 60 * 60 * 1000; // 4 Hours per heart

const STORAGE_KEY_HEARTS = 'jumble_hearts_count';
const STORAGE_KEY_LAST_RESTORED = 'jumble_last_heart_restored';
const STORAGE_KEY_PRO_USER = 'jumble_is_pro_user';

export function getHeartsState(): HeartsState {
  if (typeof window === 'undefined') {
    return { heartsCount: MAX_HEARTS, lastHeartRestoredAt: Date.now(), isProUser: false };
  }

  const storedPro = localStorage.getItem(STORAGE_KEY_PRO_USER);
  const isProUser = storedPro === 'true';

  if (isProUser) {
    return { heartsCount: MAX_HEARTS, lastHeartRestoredAt: Date.now(), isProUser: true };
  }

  const rawHearts = localStorage.getItem(STORAGE_KEY_HEARTS);
  const rawLastRestored = localStorage.getItem(STORAGE_KEY_LAST_RESTORED);

  let heartsCount = rawHearts !== null ? parseInt(rawHearts, 10) : MAX_HEARTS;
  let lastHeartRestoredAt = rawLastRestored !== null ? parseInt(rawLastRestored, 10) : Date.now();

  if (isNaN(heartsCount) || heartsCount > MAX_HEARTS) heartsCount = MAX_HEARTS;
  if (isNaN(lastHeartRestoredAt)) lastHeartRestoredAt = Date.now();

  // Time decay / passive recovery calculation
  const now = Date.now();
  if (heartsCount < MAX_HEARTS) {
    const elapsed = now - lastHeartRestoredAt;
    const heartsToRestore = Math.floor(elapsed / HEART_REFILL_INTERVAL_MS);

    if (heartsToRestore > 0) {
      heartsCount = Math.min(MAX_HEARTS, heartsCount + heartsToRestore);
      lastHeartRestoredAt = now - (elapsed % HEART_REFILL_INTERVAL_MS);
      saveHeartsState(heartsCount, lastHeartRestoredAt, isProUser);
    }
  }

  return { heartsCount, lastHeartRestoredAt, isProUser };
}

export function saveHeartsState(heartsCount: number, lastHeartRestoredAt: number, isProUser: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_HEARTS, heartsCount.toString());
  localStorage.setItem(STORAGE_KEY_LAST_RESTORED, lastHeartRestoredAt.toString());
  localStorage.setItem(STORAGE_KEY_PRO_USER, isProUser ? 'true' : 'false');
}

export function deductHeart(): HeartsState {
  const current = getHeartsState();
  if (current.isProUser) return current;

  const newHearts = Math.max(0, current.heartsCount - 1);
  const now = Date.now();
  // If hearts were at max, start timer now
  const lastRestored = current.heartsCount === MAX_HEARTS ? now : current.lastHeartRestoredAt;

  saveHeartsState(newHearts, lastRestored, current.isProUser);
  return { heartsCount: newHearts, lastHeartRestoredAt: lastRestored, isProUser: current.isProUser };
}

export function addHeart(): HeartsState {
  const current = getHeartsState();
  if (current.isProUser) return current;

  const newHearts = Math.min(MAX_HEARTS, current.heartsCount + 1);
  const now = Date.now();
  const lastRestored = newHearts === MAX_HEARTS ? now : current.lastHeartRestoredAt;

  saveHeartsState(newHearts, lastRestored, current.isProUser);
  return { heartsCount: newHearts, lastHeartRestoredAt: lastRestored, isProUser: current.isProUser };
}

export function refillAllHearts(): HeartsState {
  const current = getHeartsState();
  const now = Date.now();
  saveHeartsState(MAX_HEARTS, now, current.isProUser);
  return { heartsCount: MAX_HEARTS, lastHeartRestoredAt: now, isProUser: current.isProUser };
}

export function setProUserStatus(isPro: boolean): HeartsState {
  saveHeartsState(MAX_HEARTS, Date.now(), isPro);
  return { heartsCount: MAX_HEARTS, lastHeartRestoredAt: Date.now(), isProUser: isPro };
}

export function getRemainingMsToNextHeart(state: HeartsState): number {
  if (state.isProUser || state.heartsCount >= MAX_HEARTS) return 0;
  const elapsed = Date.now() - state.lastHeartRestoredAt;
  const remaining = HEART_REFILL_INTERVAL_MS - (elapsed % HEART_REFILL_INTERVAL_MS);
  return Math.max(0, remaining);
}
