import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Language } from '@/types';

interface LanguageState {
  current: Language;
  direction: 'ltr' | 'rtl';
}

const initialState: LanguageState = {
  current: 'ar',
  direction: 'rtl',
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.current = action.payload;
      state.direction = action.payload === 'ar' ? 'rtl' : 'ltr';

      // Store language preference
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', action.payload);
        document.documentElement.lang = action.payload;
        document.documentElement.dir = state.direction;
      }
    },
    toggleLanguage: (state) => {
      const newLang: Language = state.current === 'ar' ? 'en' : 'ar';
      state.current = newLang;
      state.direction = newLang === 'ar' ? 'rtl' : 'ltr';

      if (typeof window !== 'undefined') {
        localStorage.setItem('language', newLang);
        document.documentElement.lang = newLang;
        document.documentElement.dir = state.direction;
      }
    },
  },
});

export const { setLanguage, toggleLanguage } = languageSlice.actions;
export default languageSlice.reducer;
