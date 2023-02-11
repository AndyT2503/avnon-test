import { NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { takeUntil } from 'rxjs';
import { QuestionFormComponent } from '../question-form/question-form.component';
import { QuestionType } from '../shared/const';
import { Answer, Question } from '../shared/data-access/models';
import { AnswerService, QuestionService } from '../shared/data-access/services';
import {
  injectDestroyService,
  provideDestroyService,
  TypedFormGroup,
} from '../shared/utils';


@Component({
  selector: 'app-list-question',
  standalone: true,
  imports: [
    NzModalModule,
    NzFormModule,
    NgForOf,
    NzCheckboxModule,
    NzInputModule,
    ReactiveFormsModule,
    NzButtonModule,
    FormsModule,
    NgIf,
  ],
  templateUrl: './list-question.component.html',
  styleUrls: ['./list-question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideDestroyService()],
})
export default class ListQuestionComponent implements OnInit {
  private readonly nzModalService = inject(NzModalService);
  private readonly destroyed$ = injectDestroyService();
  private readonly questionService = inject(QuestionService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly answerService = inject(AnswerService);
  readonly formQuestion = new FormArray<TypedFormGroup<Answer>>([]);
  listQuestion: Question[] = [];
  ngOnInit(): void {
    this.loadFormQuestion();
  }

  private loadFormQuestion(): void {
    this.questionService.listQuestion$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        this.formQuestion.clear();
        this.listQuestion = res;
        const listCurrentAnswer = this.answerService.getListAnswer();
        res.forEach((item, index) => {
          const newForm = this.createNewFormQuestion(
            item.type,
            item.question,
            item.isRequired,
          );
          const currAns = listCurrentAnswer.find(
            (x) => x.question === item.question,
          );
          if (currAns) {
            newForm.patchValue({
              answer: currAns.answer,
              note: currAns.note,
            });
          }
          if (currAns?.type === 'checkbox') {
            this.listQuestion[index].answerOptions.forEach((item) => {
              item.isChecked = currAns.answer.includes(item.content);
            });
          }
          this.formQuestion.push(newForm);
        });
        this.cdr.markForCheck();
      });
  }

  checkShowOtherTextArea(index: number) {
    return this.formQuestion.controls[index].get('answer')?.value.includes('Other');
  }

  private createNewFormQuestion(
    type: QuestionType,
    question: string,
    isRequired: boolean,
  ): TypedFormGroup<Answer> {
    return new FormGroup(
      {
        answer: new FormControl<string[] | string>(
          type === 'paragraph' ? '' : [],
          {
            nonNullable: true,
            validators: isRequired ? Validators.required : null,
          },
        ),
        question: new FormControl(question, {
          nonNullable: true,
        }),
        note: new FormControl('', {
          nonNullable: true,
        }),
        type: new FormControl(type, {
          nonNullable: true,
        }),
      },
    );
  }

  onCheckBoxCheck(
    isChecked: boolean,
    questionNumber: number,
    answerNumber: number,
  ): void {
    const currentAnswers = this.formQuestion.controls[questionNumber].get(
      'answer',
    )?.value as string[];
    const answerContent =
      this.listQuestion[questionNumber].answerOptions[answerNumber].content;
    if (isChecked) {
      this.formQuestion.controls[questionNumber]
        .get('answer')
        ?.setValue([...currentAnswers, answerContent]);
    } else {
      const newAnswers = currentAnswers.filter((x) => x !== answerContent);
      this.formQuestion.controls[questionNumber]
        .get('answer')
        ?.setValue(newAnswers);
    }
  }

  openModalAddQuestion(): void {
    this.nzModalService.create({
      nzTitle: 'Create Question',
      nzContent: QuestionFormComponent,
      nzOnOk: (component) => {
        return component.submit();
      },
    });
  }

  reviewAnswer(): void {
    if (this.formQuestion.invalid) {
      this.nzModalService.error({
        nzTitle: 'Error',
        nzContent:
          'Your answer is invalid. Please check your answer before review!',
      });
      return;
    }
    this.answerService.createAnswer(this.formQuestion.getRawValue());
    this.router.navigate(['/form/answers']);
  }

  deleteAllQuestion(): void {
    this.questionService.clearQuestion();
  }
}
