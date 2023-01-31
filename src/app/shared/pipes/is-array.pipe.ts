import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isArray',
  standalone: true
})
export class IsArrayPipe implements PipeTransform {

  transform(value: unknown): Array<any> {
    if (!Array.isArray(value)) {
      throw new Error('Value is not array');
    }
    return value;
  }

}
