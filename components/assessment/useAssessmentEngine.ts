import { useMemo, useState } from "react";
import { assessmentModules } from "./assessmentData";

export default function useAssessmentEngine() {

  // flatten questions
  const flatQuestions = useMemo(() => {
    return assessmentModules.flatMap((module, moduleIndex) =>
      module.questions.map((q, questionIndex) => ({
        ...q,
        module,
        moduleIndex,
        questionIndex,
      }))
    );
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);

  const current = flatQuestions[currentIndex];

  const progress =
    ((currentIndex + 1) / flatQuestions.length) * 100;

  const nextQuestion = () => {
    setCurrentIndex((prev) =>
      Math.min(prev + 1, flatQuestions.length - 1)
    );
  };

   const prevQuestion = () => {
    setCurrentIndex((prev) =>
      Math.max(prev - 1, 0)
    );
  };

  const goToModule = (module) => {
    const index = flatQuestions.findIndex(
      (q) => q.module.id === module.id
    );
    setCurrentIndex(index);
  };

  return {
    modules: assessmentModules,
    currentQuestion: current,
    currentModule: current.module,
    currentIndex,
    totalQuestions: flatQuestions.length,
    progress,
    nextQuestion,
    prevQuestion,
    goToModule,
  };
}