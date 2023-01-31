import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { STORAGE_KEY } from '../../const';
import { Question } from '../models';
import { LocalStorageService } from '../store/local-storage.service';

export type CreateQuestionRequest = Pick<
  Question,
  | 'allowUserSpecifyAnswer'
  | 'answerOptions'
  | 'isRequired'
  | 'question'
  | 'type'
>;

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private readonly ls = inject(LocalStorageService);
  private _listQuestion$ = new BehaviorSubject<Question[]>(
    this.ls.getItem<Question[]>(STORAGE_KEY.listQuestion) || [],
  );

  get listQuestion$() {
    return this._listQuestion$.asObservable();
  }

  createQuestion(request: CreateQuestionRequest): void {
    const newQuestion: Question = {
      answerOptions: request.answerOptions,
      question: request.question,
      type: request.type,
      allowUserSpecifyAnswer: request.allowUserSpecifyAnswer,
      isRequired: request.isRequired,
    };
    if (request.allowUserSpecifyAnswer && request.type === 'checkbox') {
      newQuestion.answerOptions = [
        ...newQuestion.answerOptions,
        { content: 'Other' },
      ];
    }
    const currentListQuestion = this._listQuestion$.value;
    const updateListQuestion = [...currentListQuestion, newQuestion];

    this._listQuestion$.next(JSON.parse(JSON.stringify(updateListQuestion)));
    this.ls.setItem(STORAGE_KEY.listQuestion, updateListQuestion);
  }

  clearQuestion(): void {
    this.ls.removeItem(STORAGE_KEY.listQuestion);
    this.ls.removeItem(STORAGE_KEY.listAnswer);
    this._listQuestion$.next([]);
  }
}
