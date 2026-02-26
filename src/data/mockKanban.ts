import type { Column } from "../components/kanban/types";
import { uid } from "../utils/uid";

export const initColumns: Column[] = [
  {
    id: "todo",
    title: "Todo",
    color: "#2196F3",
    cards: [
      { id: uid(), title: "Create project plan" },
      { id: uid(), title: "Design landing page" },
    ],
  },
  {
    id: "inprogress",
    title: "In Progress",
    color: "#FF9800",
    cards: [
      { id: uid(), title: "Implement authentication" },
      { id: uid(), title: "Fix navbar bugs" },
    ],
  },
  {
    id: "done",
    title: "Done",
    color: "#4CAF50",
    cards: [
      { id: uid(), title: "Setup repo" },
      { id: uid(), title: "Write API documentation" },
    ],
  },
];