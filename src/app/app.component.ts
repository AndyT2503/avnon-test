import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { Component, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  PreloadAllModules,
  provideRouter,
  RouterOutlet,
  TitleStrategy,
  withInMemoryScrolling,
  withPreloading,
} from '@angular/router';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';

registerLocaleData(en);

@Component({
  selector: 'app-root',
  template: `<div class="container"><router-outlet></router-outlet></div>`,
  styles: [
    '.container { border: 1px solid grey; width: 1200px; margin-left: auto; margin-right: auto; padding: 16px }',
  ],
  standalone: true,
  imports: [RouterOutlet],
})
export class AppComponent {
  static bootstrap() {
    bootstrapApplication(this, {
      providers: [
        provideRouter(
          [
            {
              path: 'form/builder',
              loadComponent: () =>
                import('./list-question/list-question.component'),
            },
            {
              path: 'form/answers',
              loadComponent: () =>
                import('./review-answer/review-answer.component'),
            },
            {
              path: '',
              pathMatch: 'full',
              redirectTo: 'form/builder',
            },
          ],
          withPreloading(PreloadAllModules),
          withInMemoryScrolling({
            scrollPositionRestoration: 'top',
          }),
        ),
        importProvidersFrom(BrowserAnimationsModule),
        { provide: NZ_I18N, useValue: en_US },
      ],
    }).catch((err) => console.error(err));
  }
}
