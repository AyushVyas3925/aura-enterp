

### What I needed help with

**Problem 1: Debounced search hook design**

I wasn't sure whether to use the `use-debounce` npm package or write my own.
The package is fine but it flushes on every dependency change in a way that
felt off for our use case.

**AI response summary:**
Write a custom `useDebounce` hook using `useRef` for the timer — lets you
cancel the timeout on unmount explicitly, and you control the exact contract.
The npm package is a black box for debugging.

**Decision made:** Wrote custom hook in `src/hooks/useDebounce.ts`. Same logic,
but we understand every line of it. The ref cleanup is the key thing — avoids
the "setState on unmounted component" warning that the npm version sometimes
produces with Next.js App Router.

---

**Problem 2: Shared data between API routes (avoiding duplicating the 50k-item generation)**

Both `/api/inventory` and `/api/analytics` need the same dataset. The naive
approach is to duplicate the generation logic. That's wrong.

**AI response summary:**
Extract to a shared `lib/inventoryData.ts` module with a module-level cache
variable (`let _cache`). Node.js module caching ensures it runs once per
server process. Both route handlers import `getInventoryData()` from the same
place.

**Decision made:** Exactly this. Cache is in `src/lib/inventoryData.ts`.
First request to either endpoint pays the ~50ms generation cost; all subsequent
ones are instant.

---

**Problem 3: TanStack Query `placeholderData` vs `keepPreviousData`**

In older versions of React Query you'd use `keepPreviousData: true`. In v5 the
API changed.

**AI response summary:**
Use `placeholderData: (prev) => prev` — this is the v5 equivalent. It keeps
the previous page's rows visible while the new page loads instead of showing
an empty flash.

**Decision made:** Used in `src/hooks/useInventoryGrid.ts`. The table never
blanks out between pagination clicks.

---

**Problem 4: CSV export — current page only vs full filtered set**

The spec says "currently filtered table data." Does that mean the 50 visible rows
or everything that matches the filter?

**AI response summary:**
Almost always means the full filtered set for logistics use cases — managers
want a complete offline snapshot, not a single page. Create a separate
`/api/inventory/export` endpoint that skips pagination and returns everything,
then do the CSV conversion client-side with PapaParse.

**Decision made:** Separate export endpoint at `src/app/api/inventory/export/route.ts`.
Client receives JSON, PapaParse converts it to CSV blob, browser download triggered
via `URL.createObjectURL`. Avoids streaming complexity and keeps the logic simple.

---


