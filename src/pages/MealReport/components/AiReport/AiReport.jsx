import React, { useState } from "react";
import styles from "./AiReport.module.css";

import { useNutritionStore } from "../../../../stores/useNutritionStore";
import { useAiStore } from "../../../../stores/useAiStore";
import { getMealAiReport } from "../../../../utils/geminiAiApi";

const AiReport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { totalNutrition } = useNutritionStore();
  const { report, setReport } = useAiStore();
  const [count, setCount] = useState(3);

  const handleGetReport = async () => {
    if (count <= 0) return;

    if (!totalNutrition) {
      alert("영양 분석이 먼저 필요합니다.");
      return;
    }

    setIsLoading(true);

    const aiResult = await getMealAiReport(totalNutrition);

    setReport(aiResult);
    setCount((prev) => prev - 1); // 횟수 차감
    setIsLoading(false);
  };

  return (
    <div className={styles.card}>
      {/* 처음 분석 전 */}
      {!report && !isLoading && (
        <div className={styles.placeholder}>
          <p>AI를 통해 이 식사를 분석해보세요</p>
          <p className={styles.limitInfo}>
            (남은 횟수: <strong>{count}회</strong> / 3회)
          </p>
          <button className={styles.analyzeButton} onClick={handleGetReport} disabled={count <= 0}>
            AI 리포트 받아보기
          </button>
        </div>
      )}

      {/* 로딩 */}
      {isLoading && (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>AI가 식단을 분석하고 있어요...</p>
        </div>
      )}

      {/* 분석 결과 */}
      {report && !isLoading && (
        <div className={styles.reportContent}>
          <h3>이번 식사 피드백</h3>

          <strong>영양 점수: {report.score} / 100</strong>

          <ul>
            {report.tags.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>

          <p className={styles.aiComment}>{report.comment}</p>

          {/* 다시 요청 버튼 */}
          <button
            className={`${styles.analyzeButton} ${styles.retry}`}
            onClick={handleGetReport}
            disabled={count <= 0}
          >
            리포트 다시 받기
          </button>

          {/* 횟수 정보 */}
          <p className={styles.limitInfo}>
            (남은 횟수: <strong>{count}회</strong> / 3회)
          </p>

          {/* 소진 문구 */}
          {count <= 0 && (
            <p className={styles.exhaustedNotice}>
              오늘 사용 가능한 분석 횟수가 모두 소진되었습니다.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AiReport;
