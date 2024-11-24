import { createSlice } from "@reduxjs/toolkit";

export interface DarkModeState {
  isDarkMode: boolean;
}

const initialState: DarkModeState = {
  isDarkMode: JSON.parse(localStorage.getItem("darkMode") || "false"),
};

const darkModeSlice = createSlice({
  name: "darkMode",
  initialState,
  reducers: {
    toggleDarkMode(state) {
      state.isDarkMode = !state.isDarkMode;
      localStorage.setItem("darkMode", JSON.stringify(state.isDarkMode));
    },
    setDarkMode(state, action: { payload: boolean }) {
      state.isDarkMode = action.payload;
      localStorage.setItem("darkMode", JSON.stringify(state.isDarkMode));
    },
  },
});

export const { toggleDarkMode, setDarkMode } = darkModeSlice.actions;

export default darkModeSlice.reducer;
