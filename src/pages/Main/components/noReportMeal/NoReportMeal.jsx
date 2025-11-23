import React, { useEffect, useState } from 'react'
import styles from './NoReportMeal.module.css'
import { useNavigate } from 'react-router-dom'
import { motion } from "motion/react"
import { useMealStore } from '../../../../stores/useMealStore'
import { getToday } from '../../../../utils/getToday'
import { getTodayMealAiReport } from '../../../../utils/geminiAiApi'
import { useNutritionStore } from '../../../../stores/useNutritionStore'
import { useUserGoal } from '../../../../stores/useUsergoalStore'

const NoReportMeal = () => {
  const {getAllMealsByDate} = useMealStore();
  const [meals, setMeals] = useState(getAllMealsByDate(getToday()));
  const [noTodayMeal, setNoTodayMeal] = useState(true);
  const {savedGoal} = useUserGoal();

  const fadeUp = {
    hidden: {opacity: 0, y: 60},
    show: {opacity: 1, y: 0, transition: {duration: 0.6}}
  };

  const navigate = useNavigate();

  useEffect(() => {
    if(meals.length !== 0){
      meals.map((meal) => {
        if(meal.length !== 0){
          setNoTodayMeal(false);
          return;
        }
      });
    } else{
      setNoTodayMeal(true);
    }
  }, [meals]);

  const goRecord = () => {
    navigate('/record');
  };

  const goTodaySummary = async () => {
  console.log(savedGoal);
    if(Object.keys(savedGoal).length === 0){
      alert('목표 설정을 먼저 해주세요!');
      navigate('/settings');
    }
    // const aiResult = await getTodayMealAiReport(totalNutrition, goal);
  };

  return (
    <motion.div className={styles.summary_card} initial="hidden" animate="show" variants={fadeUp}>
      <h2>오늘 요약</h2>
      <p className={styles.summary_desc}>
        오늘 날짜 기준으로 영양 점수, 부족/과다한 영양소, 추천 메뉴를 한눈에 확인해요.
      </p>

      { noTodayMeal
      ?
      <div className={styles.summary_content}>
        <div className={styles.content}>
            오늘 식단을 입력하지않았어요!
        </div>
        <div className={styles.content}>
            오늘 드신 식단을 먼저 입력하러 가실까요? 😊
        </div>
        <div>
            <button className={styles.summary_button} onClick={goRecord}>오늘 식단 기록하기</button>
        </div>
      </div>
      :
      <div className={styles.summary_content}>
        <div className={styles.content}>오늘의 요약을 아직 안 보셨군요!</div>
        <div className={styles.content}>오늘의 요약을 확인하실까요? 😊</div>
        <div>
          <button className={styles.summary_button} onClick={goTodaySummary}>
            오늘의 요약 보러가기
          </button>
        </div>
      </div>
      }
    </motion.div>
  );
};

export default NoReportMeal;
