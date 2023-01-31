import { NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { QuestionType } from '../shared/const';
import { AnswerOption } from '../shared/data-access/models';
import { CreateQuestionRequest, QuestionService } from '../shared/data-access/services';
import { TypedFormGroup } from '../shared/utils';
@Component({
  selector: 'app-question-form',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NzCheckboxModule,
    NzInputModule,
    NzSelectModule,
    NzFormModule,
    ReactiveFormsModule,
  ],
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionFormComponent {
  private readonly questionService = inject(QuestionService);
  readonly form: TypedFormGroup<CreateQuestionRequest> = new FormGroup({
    question: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    type: new FormControl<QuestionType>('paragraph', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    allowUserSpecifyAnswer: new FormControl(false, {
      nonNullable: true,
    }),
    isRequired: new FormControl(false, {
      nonNullable: true,
    }),
    answerOptions: new FormArray<TypedFormGroup<AnswerOption>>([]),
  });

  get answerOptionsForm() {
    return this.form.controls["answerOptions"] as FormArray;
  }

  private newAnswerOption() {
    return new FormGroup({
      content: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  onQuestionTypeChange(value: QuestionType) {
    if (value === 'checkbox') {
      this.addNewAnswerOption();
    } else {
      this.form.controls.answerOptions.clear();
      this.form.controls.allowUserSpecifyAnswer.setValue(false);
    }
  }

  addNewAnswerOption(): void {
    this.form.controls.answerOptions.push(this.newAnswerOption());
  }

  submit(): boolean {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return false;
    }
    this.questionService.createQuestion(this.form.getRawValue());
    return true;
  }
}
