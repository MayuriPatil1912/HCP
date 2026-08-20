import { configureStore } from "@reduxjs/toolkit";
import hcpReducer from "../features/hcp/hcpSlice";

export const store = configureStore({
  reducer: {
    hcp: hcpReducer,
  },
});

export type RootState = ReturnType<
  typeof store.getState
>;

export type AppDispatch =
  typeof store.dispatch;