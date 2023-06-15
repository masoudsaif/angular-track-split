import IGroup from './group.interface';
import IMember from './member.interface';

export default interface IFullGroup extends IGroup {
  members: IMember[];
  transactions: any[];
}
