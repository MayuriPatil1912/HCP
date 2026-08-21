
Netlify Link - [https://6a8824aad3cc3af04f155470--hcpdataexplorer.netlify.app/](https://hcpdataexplorer.netlify.app/)

# HCP Data Explorer

A high-performance React + TypeScript data explorer for viewing, grouping,
filtering, sorting, and editing a large HCP dataset.

The application works with 50,000 HCP records and uses row virtualization
to keep DOM rendering efficient.

---

## Tech Stack

- React
- TypeScript
- Redux Toolkit
- React Redux
- TanStack Virtual
- Webpack
- CSS

---

# Architecture Overview

The application follows a feature-based architecture.

```text
src/
│
├── app/
│   └── store.ts
│
├── components/
│   └── shared components
│
├── data/
│   └── data-generator.ts
│
└── features/
    └── hcp/
        ├── components/
        │   ├── HcpTable/
        │   ├── HcpTableHeader/
        │   ├── HcpTableFooter/
        │   ├── HcpToolBar/
        │   ├── RegionRow/
        │   ├── TerritoryRow/
        │   ├── HcpDataRow/
        │   └── EditableCell/
        │
        ├── hcpTypes.ts
        ├── hcpSlice.ts
        ├── hcpSelectors.ts
        └── hcpInitialState.ts
