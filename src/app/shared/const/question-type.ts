import { ObjectValues } from "../utils";

export const QUESTION_TYPE = {
  paragraph: 'paragraph',
  checkbox: 'checkbox',
} as const;

export type QuestionType = ObjectValues<typeof QUESTION_TYPE>;
