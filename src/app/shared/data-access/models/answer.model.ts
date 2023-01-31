import { QuestionType } from "../../const";

export interface Answer {
  question: string;
  answer: string[] | string;
  note: string;
  type: QuestionType;
}
