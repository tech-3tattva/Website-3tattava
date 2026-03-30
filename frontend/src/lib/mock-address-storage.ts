import type { Address } from "@shared/types";

function storageKey(userId: string) {
  return `3tattva-addresses-${userId}`;
}

export function loadMockAddresses(userId: string): Address[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return [];
    return JSON.parse(raw) as Address[];
  } catch {
    return [];
  }
}

function persist(userId: string, addresses: Address[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(userId), JSON.stringify(addresses));
}

/** Append a new address; handles default flag like the API. */
export function addMockAddress(
  userId: string,
  input: Omit<Address, "id" | "isDefault"> & { isDefault?: boolean }
): Address[] {
  const existing = loadMockAddresses(userId);
  const shouldBeDefault = input.isDefault ?? existing.length === 0;
  const id = `mock-${Date.now()}`;
  let next: Address[] = existing.map((a) => ({ ...a, isDefault: shouldBeDefault ? false : a.isDefault }));
  const saved: Address = {
    ...input,
    id,
    isDefault: shouldBeDefault,
    line2: input.line2 || undefined,
  };
  if (shouldBeDefault) {
    next = next.map((a) => ({ ...a, isDefault: false }));
  }
  next = [saved, ...next];
  persist(userId, next);
  return next;
}
