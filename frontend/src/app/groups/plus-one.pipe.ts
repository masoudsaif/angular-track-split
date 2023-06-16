import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'plusOne',
})
export class PlusOnePipe implements PipeTransform {
  transform(value: number): number {
    return value + 1;
  }
}
