// Универсальное локальное хранилище ставок.
//
// Что делает этот файл:
// 1) поддерживает старый UI через StoredPick
// 2) параллельно пишет новую доменную модель Pick
// 3) позволяет мигрировать экран за экраном без поломки проекта
//
// Идея:
// - старый интерфейс пока читает legacy-ставки
// - новая архитектура уже получает нормальные Pick-объекты

import type { LegacyPickStatus, Pick, StoredPick } from "@/types/pick";
import { mapLegacyStoredPickToDomainPick } from "@/lib/domain/pick-mappers";

const PICKS_STORAGE_KEY = "pickboard:picks";
const DOMAIN_PICKS_STORAGE_KEY = "pickboard:domain-picks";

function isBrowser() {
  return typeof window !== "undefined";
}

function readJsonArray<T>(key: string): T[] {
  if (!isBrowser()) {
    return [];
  }

  const raw = window.localStorage.getItem(key);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function writeJsonArray<T>(key: string, value: T[]) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

// ========================
// LEGACY STORAGE
// ========================

// Получить старые ставки для текущего UI
export function getStoredPicks(): StoredPick[] {
  return readJsonArray<StoredPick>(PICKS_STORAGE_KEY);
}

// Сохранить старые ставки списком
export function saveStoredPicks(picks: StoredPick[]) {
  writeJsonArray(PICKS_STORAGE_KEY, picks);
}

// Добавить старую ставку
export function addStoredPick(pick: StoredPick) {
  const current = getStoredPicks();
  const next = [pick, ...current];
  saveStoredPicks(next);

  // Одновременно сохраняем ставку и в новой доменной модели
  syncLegacyPickToDomain(pick);
}

// Совместимость со старым кодом формы
export function savePickToStorage(pick: StoredPick) {
  addStoredPick(pick);
}

// Обновить статус в старом формате
export function updateStoredPickStatus(
  pickId: string,
  status: LegacyPickStatus,
) {
  const current = getStoredPicks();

  const next = current.map((pick) =>
    pick.id === pickId
      ? {
          ...pick,
          status,
        }
      : pick,
  );

  saveStoredPicks(next);

  const updatedLegacy = next.find((pick) => pick.id === pickId);
  if (updatedLegacy) {
    syncLegacyPickToDomain(updatedLegacy);
  }
}

// Удалить legacy-ставку
export function removeStoredPick(pickId: string) {
  const current = getStoredPicks();
  const next = current.filter((pick) => pick.id !== pickId);
  saveStoredPicks(next);

  const domainCurrent = getDomainStoredPicks();
  const domainNext = domainCurrent.filter((pick) => pick.id !== pickId);
  saveDomainStoredPicks(domainNext);
}

// Полная очистка
export function clearStoredPicks() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(PICKS_STORAGE_KEY);
  window.localStorage.removeItem(DOMAIN_PICKS_STORAGE_KEY);
}

// ========================
// DOMAIN STORAGE
// ========================

// Получить новые доменные ставки
export function getDomainStoredPicks(): Pick[] {
  return readJsonArray<Pick>(DOMAIN_PICKS_STORAGE_KEY);
}

// Сохранить доменные ставки списком
export function saveDomainStoredPicks(picks: Pick[]) {
  writeJsonArray(DOMAIN_PICKS_STORAGE_KEY, picks);
}

// Добавить новую доменную ставку напрямую
export function addDomainStoredPick(pick: Pick) {
  const current = getDomainStoredPicks();

  const withoutSameId = current.filter((item) => item.id !== pick.id);
  const next = [pick, ...withoutSameId];

  saveDomainStoredPicks(next);
}

// Массовая миграция старых ставок в новую модель
export function migrateLegacyPicksToDomain() {
  const legacy = getStoredPicks();
  const mapped = legacy.map(mapLegacyStoredPickToDomainPick);
  saveDomainStoredPicks(mapped);
}

// Синхронизация одной legacy-ставки в новую модель
export function syncLegacyPickToDomain(legacyPick: StoredPick) {
  const domainPick = mapLegacyStoredPickToDomainPick(legacyPick);
  addDomainStoredPick(domainPick);
}