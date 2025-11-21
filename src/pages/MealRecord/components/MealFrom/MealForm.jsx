import React, { useEffect, useState } from "react";
import { useMealStore } from "../../../../stores/useMealStore";
import styles from "./MealForm.module.css";
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFoodListQuery } from "../../../../hooks/useFoodListQuery";
import { useMealNutrition } from "../../../../hooks/useMealNutrition";
import { Navigate } from "react-router-dom";

const MealForm = () => {
  const { selectedDate, editType, getMealsByDate, saveMeal, setEditType } = useMealStore();

  const todayMeals = getMealsByDate(selectedDate);

  const [type, setType] = useState(editType || "breakfast");
  const [items, setItems] = useState(todayMeals[type] || []);
  const [time, setTime] = useState("00:00");

  const [input, setInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [selectedFood, setSelectedFood] = useState(null);
  const [gram, setGram] = useState("");

  const { data: foodList, isLoading } = useFoodListQuery(keyword);

  // 영양 계산 훅
  const { data: summary, refetch, isFetching } = useMealNutrition(selectedDate, type, items);

  useEffect(() => {
    setType(editType || "breakfast");
  }, [editType]);

  useEffect(() => {
    const updated = getMealsByDate(selectedDate);
    setItems(updated[type] || []);
  }, [type, selectedDate]);

  const generateTimes = () => {
    const times = [];
    for (let h = 0; h < 24; h++) {
      for (let m of ["00", "30"]) {
        const hour = String(h).padStart(2, "0");
        times.push(`${hour}:${m}`);
      }
    }
    return times;
  };

  const handleSearch = () => {
    if (!input.trim()) return;
    setKeyword(input);
  };

  const selectFood = (food) => {
    setSelectedFood(food);
    setInput(food.name);
    setKeyword("");
  };

  const addItem = () => {
    if (!selectedFood || !gram) return;

    const newItem = {
      time,
      name: selectedFood.name,
      gram: Number(gram),
      code: selectedFood.code,
      text: `${selectedFood.name} ${gram}g`,
    };

    setItems((prev) => [...prev, newItem]);

    setInput("");
    setSelectedFood(null);
    setGram("");
  };

  const save = () => {
    saveMeal(selectedDate, type, items);
    setEditType(null);
  };

  const removeItem = (idx) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const deleteAll = () => setItems([]);

  const goToReport = async () => {
    save();

    const result = await refetch(); // 버튼 클릭 시 **영양분석 실행**

    Navigate("/report", {
      state: {
        summary: result.data,
        items,
        type,
        date: selectedDate,
      },
    });
  };

  if (!selectedDate) return null;

  return (
    <div className={styles.meal_form}>
      {/* 식사 타입 & 시간 */}
      <div className={styles.meal_select}>
        <div className={styles.select_wrap}>
          <span className={styles.small_title}>식사 타입</span>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="breakfast">아침</option>
            <option value="lunch">점심</option>
            <option value="dinner">저녁</option>
            <option value="snack">간식</option>
          </select>
        </div>

        <div className={styles.select_wrap}>
          <span className={styles.small_title}>시간</span>
          <select value={time} onChange={(e) => setTime(e.target.value)}>
            {generateTimes().map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 음식 검색 */}
      <div className={styles.add_box}>
        <span className={styles.small_title}>음식 검색</span>
        <div className={styles.add_wrap}>
          <div className={styles.search}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="음식명 입력"
              className={styles.food_search_input}
            />
            <button onClick={handleSearch} className={styles.search_btn}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>

          <div className={styles.gram}>
            <input
              type="number"
              placeholder="그램(숫자만)"
              value={gram}
              onChange={(e) => setGram(e.target.value)}
              className={styles.gram_input}
            />
          </div>

          <button onClick={addItem} className={styles.add_btn}>
            추가
          </button>
        </div>

        {keyword && (
          <ul className={styles.search_list}>
            {isLoading && <li>검색 중...</li>}
            {foodList?.map((food) => (
              <li key={food.code} onClick={() => selectFood(food)}>
                {food.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 입력 리스트 */}
      <div className={styles.items_box}>
        <span className={styles.small_title}>입력한 식단</span>
        <div className={styles.items_wrap}>
          <p>
            <span>식사 시간 : </span>
            {time}
          </p>

          <ul className={styles.item_list}>
            {items.map((item, idx) => (
              <li key={idx}>
                <p>{item.text}</p>
                <button onClick={() => removeItem(idx)}>
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 버튼 */}
      <div className={styles.btn_wrap}>
        <button onClick={save}>저장하기</button>
        <button onClick={deleteAll}>전체 삭제</button>
        <button onClick={goToReport}>{isFetching ? "분석 중..." : "요약 보러 가기"}</button>
      </div>
    </div>
  );
};

export default MealForm;
