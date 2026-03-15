import type { StoredPick, PickStatus } from "@/types/pick";

const storageKey = "pickboard:picks";

export function getStoredPicks(): StoredPick[] {
  if (typeof window === "undefined") {
    return [];
  }

  const rawValue = window.localStorage.getItem(storageKey);

  if (!rawValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawValue) as StoredPick[];

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue;
  } catch {
    return [];
  }
}

export function savePickToStorage(pick: StoredPick) {
  if (typeof window === "undefined") {
    return;
  }

  const currentPicks = getStoredPicks();
  const nextPicks = [pick, ...currentPicks];

  window.localStorage.setItem(storageKey, JSON.stringify(nextPicks));
}

export function updateStoredPickStatus(pickId: string, status: PickStatus) {
  if (typeof window === "undefined") {
    return;
  }

  const currentPicks = getStoredPicks();

  const nextPicks = currentPicks.map((pick) => {
    if (pick.id !== pickId) {
      return pick;
    }

    return {
      ...pick,
      status,
    };
  });

  window.localStorage.setItem(storageKey, JSON.stringify(nextPicks));
}

export function clearStoredPicks() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(storageKey);
}
