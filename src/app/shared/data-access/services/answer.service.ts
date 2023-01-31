import { inject, Injectable } from '@angular/core';
import { STORAGE_KEY } from '../../const';
import { Answer } from '../models';
import { LocalStorageService } from '../store/local-storage.service';
@Injectable({
  providedIn: 'root',
})
export class AnswerService {
  private readonly ls = inject(LocalStorageService);

  createAnswer(answers: Answer[]): void {
    this.ls.setItem(STORAGE_KEY.listAnswer, answers);
  }

  getListAnswer(): Answer[] {
    return this.ls.getItem<Answer[]>(STORAGE_KEY.listAnswer) || [];
  }
}
