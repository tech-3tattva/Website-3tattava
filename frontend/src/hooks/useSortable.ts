"use client";

import { useCallback, useMemo, useState } from "react";

export type SortDir = "asc" | "desc";

/**
 * Client-side table sorting shared by the admin tables.
 *
 * The panels load a page of rows and render them in whatever order the API
 * returned, so "biggest customers first" or "highest-value orders first" was
 * impossible. Sorting happens on the loaded rows: the admin pages fetch up to
 * 200-500 records at a time, so this covers the real data set without adding a
 * round trip per column click.
 *
 * Nulls always sort last regardless of direction — a customer who has never
 * ordered should not top the "last order" column just because the field is
 * empty.
 */
export function useSortable<T>(
  rows: T[],
  accessors: Record<string, (row: T) => string | number | null | undefined>,
  initial?: { key: string; dir: SortDir },
) {
  const [sort, setSort] = useState<{ key: string; dir: SortDir } | null>(initial ?? null);

  const toggle = useCallback((key: string) => {
    setSort((current) => {
      if (current?.key !== key) {
        // Numbers are most useful largest-first; text reads best A-Z.
        return { key, dir: "desc" };
      }
      if (current.dir === "desc") return { key, dir: "asc" };
      return null; // third click clears back to the API's own order
    });
  }, []);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const get = accessors[sort.key];
    if (!get) return rows;

    const factor = sort.dir === "asc" ? 1 : -1;
    // Copy: callers pass state arrays that must not be mutated in place.
    return [...rows].sort((a, b) => {
      const av = get(a);
      const bv = get(b);
      const aEmpty = av === null || av === undefined || av === "";
      const bEmpty = bv === null || bv === undefined || bv === "";
      if (aEmpty && bEmpty) return 0;
      if (aEmpty) return 1;
      if (bEmpty) return -1;
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * factor;
      return String(av).localeCompare(String(bv), "en", { numeric: true }) * factor;
    });
  }, [rows, sort, accessors]);

  /** Spread onto a <th> button so the arrow and a11y state stay in sync. */
  const headerProps = useCallback(
    (key: string) => ({
      "aria-sort": (sort?.key === key
        ? sort.dir === "asc"
          ? "ascending"
          : "descending"
        : "none") as "ascending" | "descending" | "none",
      onClick: () => toggle(key),
      arrow: sort?.key === key ? (sort.dir === "asc" ? "▲" : "▼") : "▼",
    }),
    [sort, toggle],
  );

  return { sorted, sort, toggle, headerProps };
}
