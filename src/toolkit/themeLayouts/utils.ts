import {
    THEME_MODE,
    THEME_PRESET,
    THEME_LAYOUT,
    SIDEBAR_THEME,
    SIDEBAR_THEME_CAPTION,
    LAYOUT_THEME,
    LAYOUT_LANGUAGES
} from "../../Common/layoutConfig";

export interface ThemeState {
    themeMode: THEME_MODE;
    layoutTheme: LAYOUT_THEME;
    sidebarTheme: SIDEBAR_THEME;
    sidebarThemeCaptions: SIDEBAR_THEME_CAPTION;
    themePreset: THEME_PRESET;
    themeLayout: THEME_LAYOUT;
    layoutLanguages: LAYOUT_LANGUAGES;
}

export const changeHTMLAttribute = (attribute: string, value: string): boolean => {
    if (document.body) {
        document.body.setAttribute(attribute, value);
        return true;
    }
    return false;
};