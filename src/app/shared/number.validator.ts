import { AbstractControl, ValidatorFn } from '@angular/forms';

export class NumberValidators {
  //validator function wrapped in a factory funcion and made static so that it can be used without instatntiatin gthis class.
  static range(min: number, max: number): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      if (c.value && (isNaN(c.value) || c.value < min || c.value > max)) {
        return { 'range': true };
      }
      return null;
    };
  }
}
