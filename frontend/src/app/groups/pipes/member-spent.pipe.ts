import { Pipe, PipeTransform } from '@angular/core';
import IMember from '../types/member.interface';
import IFullGroup from '../types/full-group.inteface';

@Pipe({
  name: 'memberSpent',
})
export class MemberSpentPipe implements PipeTransform {
  transform(member: IMember, group: IFullGroup) {
    return group.transactions.reduce((acc, t) => {
      if (t.paid_by.user_id === member.user_id) {
        return (acc += t.amount);
      }

      return acc;
    }, 0);
  }
}
