# 1. Source Data
## Assumption

The supplied `data-generator.ts` is treated as a black box and is not
modified.

The generated dataset contains 50,000 records.

## Decision

The generated records are stored as the application's source of truth.

Filtering, grouping, sorting, and aggregation are derived from this source
data.

---

# 2. Stable Row Identity

## Observation

The table can be sorted, filtered, grouped, and virtualized.

Therefore the visual position of an HCP cannot be used as its identity.

## Decision

The original array index is used as:

```ts
type RowKey = number;