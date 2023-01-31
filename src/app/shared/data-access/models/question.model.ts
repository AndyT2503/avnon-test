import { QuestionType } from '../../const';
import { AnswerOption } from './answer-option.model';

export interface Question {
  type: QuestionType;
  question: string;
  answerOptions: AnswerOption[];
  isRequired: boolean;
  allowUserSpecifyAnswer: boolean;
}
