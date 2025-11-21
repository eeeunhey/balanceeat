import { create } from "zustand";
import { getToday } from "../utils/getToday";

export const useMealStore = create((set, get) => ({
  meals: {},
  analysis: {},
  selectedDate: getToday(),
  editType: null,

  setSelectedDate: (date) => set({ selectedDate: date, editType: null }),
  setEditType: (type) => set({ editType: type }),

  saveMeal: (date, type, items) => {
    const { meals } = get();
    set({
      meals: {
        ...meals,
        [date]: {
          ...meals[date],
          [type]: [...items],
        },
      },
      analysis: {
        ...get().analysis,
        [date]: null, // 식단 변경 시 기존 분석 무효화
      },
    });
  },

  saveAnalysis: (date, type, data) =>
    set({
      analysis: {
        ...get().analysis,
        [date]: {
          ...(get().analysis[date] || {}),
          [type]: data,
        },
      },
    }),

  getAnalysisByDate: (date, type) => {
    const { analysis } = get();
    return analysis[date]?.[type] || null;
  },

  getMealsByDate: (date) => {
    const { meals } = get();
    return meals[date] || { breakfast: [], lunch: [], dinner: [], snack: [] };
  },
}));
