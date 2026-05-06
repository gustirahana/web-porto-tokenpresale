import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  THEME_MODE,
  THEME_PRESET,
  THEME_LAYOUT,
  SIDEBAR_THEME,
  SIDEBAR_THEME_CAPTION,
  LAYOUT_THEME,
  LAYOUT_LANGUAGES
} from "../../Common/layoutConfig";
import type { ThemeState } from "./utils";

export const initialState: ThemeState = {
  themeMode: THEME_MODE.DARK,
  layoutTheme: LAYOUT_THEME.VERTICAL,
  sidebarTheme: SIDEBAR_THEME.DARK,
  sidebarThemeCaptions: SIDEBAR_THEME_CAPTION.CAPTION_HIDE,
  themePreset: THEME_PRESET.PRESET_5,
  themeLayout: THEME_LAYOUT.LTR,
  layoutLanguages: LAYOUT_LANGUAGES.ENGLISH
};

const ThemeSlice = createSlice({
  name: 'theme', // Changed to lowercase for consistency
  initialState,
  reducers: {
    changeLayoutTheme: (state, action: PayloadAction<LAYOUT_THEME>) => {
      state.layoutTheme = action.payload;
    },
    changeThemeMode: (state, action: PayloadAction<THEME_MODE>) => {
      state.themeMode = action.payload;
    },
    changeSidebarTheme: (state, action: PayloadAction<SIDEBAR_THEME>) => {
      state.sidebarTheme = action.payload;
    },
    changeSidebarCaptions: (state, action: PayloadAction<SIDEBAR_THEME_CAPTION>) => {
      state.sidebarThemeCaptions = action.payload;
    },
    changeThemePreset: (state, action: PayloadAction<THEME_PRESET>) => {
      state.themePreset = action.payload;
    },
    changeThemeDirection: (state, action: PayloadAction<THEME_LAYOUT>) => {
      state.themeLayout = action.payload;
    },
    changeLanguage: (state, action: PayloadAction<LAYOUT_LANGUAGES>) => {
      state.layoutLanguages = action.payload;
    }
  }
});

export const {
  changeLayoutTheme,
  changeThemeMode,
  changeSidebarTheme,
  changeSidebarCaptions,
  changeThemePreset,
  changeThemeDirection,
  changeLanguage
} = ThemeSlice.actions;

export default ThemeSlice.reducer;