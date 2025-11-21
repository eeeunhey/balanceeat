import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchFoodNutrition } from "../hooks/useFoodNutritionQuery";
import { useMealStore } from "./useMealStore";

export const useNutritionStore = create(
  persist(
    (set, get) => ({
      analysisItems: [],
      totalNutrition: null,

      // 분석 리스트 저장
      setAnalysisItems: (items) => set({ analysisItems: items }),

      // 초기화
      clearAnalysis: () =>
        set({
          analysisItems: [],
          totalNutrition: null,
        }),

      // 영양소 총합 계산
      calculateTotal: async () => {
        const { analysisItems } = get();

        let total = {
          kcal: 0,
          carbs: 0,
          protein: 0,
          fat: 0,
          sugar: 0,
          sodium: 0,
        };

        if (!analysisItems.length) {
          set({ totalNutrition: total });
          return;
        }

        for (const item of analysisItems) {
          const data = await fetchFoodNutrition(item.code);
          if (!data) continue;

          const { standardNutrition, standardWeight } = data;
          const weight = standardWeight > 0 ? standardWeight : 1;

          const userGram = Number(item.gram) || 0;
          const ratio = userGram / weight;

          total.kcal += standardNutrition.kcal * ratio;
          total.carbs += standardNutrition.carbs * ratio;
          total.protein += standardNutrition.protein * ratio;
          total.fat += standardNutrition.fat * ratio;
          total.sugar += standardNutrition.sugar * ratio;
          total.sodium += standardNutrition.sodium * ratio;
        }

        set({
          totalNutrition: {
            kcal: Math.round(total.kcal),
            carbs: Math.round(total.carbs),
            protein: Math.round(total.protein),
            fat: Math.round(total.fat),
            sugar: Math.round(total.sugar),
            sodium: Math.round(total.sodium),
          },
        });
      },

      // 하루 전체 계산
      calculateDailyTotal: async (date) => {
        const { getAllMealsByDate } = useMealStore.getState();
        const items = getAllMealsByDate(date);

        set({
          analysisItems: items,
          totalNutrition: null,
        });

        await get().calculateTotal();
      },
    }),

    {
      name: "nutrition-storage", // 로컬스토리지 key
      partialize: (state) => ({
        totalNutrition: state.totalNutrition,
        // analysisItems는 저장 안 함 => 음식당 정보는 저장 X, 끼니당이랑 총 식사에 대한 정보만 저장
      }),
    }
  )
);

/*
챗 지피티한테 넘기실 때 
  const { calculateDailyTotal, totalNutrition } = useNutritionStore();
  const { selectedDate } = useMealStore();

  useEffect(() => {
    // 페이지 접속하면 자동으로 하루 분석 실행
    calculateDailyTotal(selectedDate);
  }, [selectedDate]);


총 칼로리: {totalNutrition.kcal}
총 탄수화문: {totalNutrition.carbs}
총 단백질 : {totalNutrition.protein}
총 지방: {totalNutrition.fat} 이렇게 쓰시면 됩니당!!
  */
