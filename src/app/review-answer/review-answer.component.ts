import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnswerService } from '../shared/data-access/services';
import { IsArrayPipe } from '../shared/pipes';
import { trackByIndex } from './../shared/utils/track-by';

@Component({
  selector: 'app-review-answer',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, IsArrayPipe],
  templateUrl: './review-answer.component.html',
  styleUrls: ['./review-answer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ReviewAnswerComponent {
  private readonly answerService = inject(AnswerService);
  readonly trackByIndex = trackByIndex();
  readonly listAnswer$ = this.answerService.getListAnswer();
}
