import { changeHTMLAttribute } from './utils';
import {
    changeThemeMode,
    changeThemePreset,
    changeThemeLayout,
    changeSidebarTheme,
    changeSidebarThemeCaptions,
    changeLayoutTheme,
    changeLanguage,
} from './reducer';

/**
 * Changes the layout type
 * @param {*} param0
 */
export const changeThemeMode = (themeMode: any) => async (dispatch: any) => {
    try {
        changeHTMLAttribute("data-pc-theme", themeMode);
        dispatch(changeThemeMode(themeMode));
    } catch (error) {

    }
};

/**
 * Changes the left sidebar theme
 * @param {*} param0
 */
export const changeSidebarTheme = (sidebarTheme: any) => async (dispatch: any) => {
    try {
        changeHTMLAttribute("data-pc-sidebar-theme", sidebarTheme);
        dispatch(changeSidebarTheme(sidebarTheme));
    } catch (error) {

    }
};


/**
 * Changes the left sidebar theme
 * @param {*} param0
 */
export const changeSidebarThemeCaptions = (sidebarThemeCaptions: any) => async (dispatch: any) => {
    try {
        changeHTMLAttribute("data-pc-sidebar-caption", sidebarThemeCaptions);
        dispatch(changeSidebarThemeCaptions(sidebarThemeCaptions));
    } catch (error) {

    }
};


/**
 * Changes the left sidebar theme
 * @param {*} param0
 */
export const changeThemePreset = (preset: any) => async (dispatch: any) => {
    try {
        changeHTMLAttribute("data-pc-preset", preset);
        dispatch(changeThemePreset(preset));
    } catch (error) {

    }
};


/**
 * Changes the left sidebar theme
 * @param {*} param0
 */
export const changeThemeLayout = (layoutMode: any) => async (dispatch: any) => {
    try {
        changeHTMLAttribute("data-pc-direction", layoutMode);
        dispatch(changeThemeLayoutAction(layoutMode));
    } catch (error) {

    }
};

/**
 * Changes the left sidebar theme
 * @param {*} param0
 */
export const changeLayoutTheme = (layoutTheme: any) => async (dispatch: any) => {
    try {
        changeHTMLAttribute("data-pc-layout", layoutTheme);
        dispatch(changeLayoutThemeAction(layoutTheme));
    } catch (error) {

    }
};

export const chanageLanguage = (language: any) => async (dispatch: any) => {
    dispatch(changeLanguageAction(language));
};
