export const assessmentModules = [
  {
    id: "attitude",
    name: "Attitude",
    questions: [
      {
        id: 1,
        text: "When faced with a setback at work, what is your typical response?",
        options: [
          "Analyze what went wrong",
          "Feel frustrated",
          "Ask colleague feedback",
          "Revisit later",
        ],
      },
      { id: 2, text: "How do you react to feedback?", options:[
        "Welcome it",
        "Feel defensive",
        "Seek clarification",
        "Ignore it",
      ] }
    ],
  },
  {
    id: "behavioral",
    name: "Behavioral",
    questions: [
      {
        id: 3,
        text: "How do you react to tight deadlines?",
        options: [
          "Plan early",
          "Work longer hours",
          "Ask team help",
          "Prioritize tasks",
        ],
      },
       { id: 4, text: "Handling conflict?",options:[ "Listen actively", "Defend opinion", "Seek compromise", "Escalate issue" ] }

    ],
  },
  {
    id: "communication",
    name: "Communication",
    questions: [
      {
        id: 5,
        text: "How do you handle disagreements?",
        options: [
          "Listen actively",
          "Defend opinion",
          "Seek compromise",
          "Escalate issue",
        ],
      },
    ],
  },
  {
    id: "psychometric",
    name: "Psychometric",
    questions: [
      {
        id: 6,
        text: "What is your preferred way of working?",
        options: [
          "Independently",
          "In a team",
          "With clear instructions",
          "With flexibility",
        ],
      },
    ],
  },
];