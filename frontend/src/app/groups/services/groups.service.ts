import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import IResponse from 'src/app/types/response.inteface';
import { environment as env } from 'src/environments/environment.development';

import IFullGroup from '../types/full-group.inteface';
import IGroup from '../types/group.interface';
import IMember from '../types/member.interface';

@Injectable({
  providedIn: 'root',
})
export class GroupsService {
  private http = inject(HttpClient);
  requests = signal<IGroup[]>([]);
  groups = signal<(IGroup | IFullGroup)[]>([]);

  addGroup(title: string) {
    return this.http.post<IResponse<IFullGroup>>(`${env.SERVER_URL}groups`, {
      title,
    });
  }

  getGroups(pending?: boolean) {
    return this.http.get<IResponse<IGroup[]>>(
      `${env.SERVER_URL}groups${pending ? '?pending=true' : ''}`
    );
  }

  addGroupMember(member: IMember, groupId: string) {
    return this.http.post<IResponse<IGroup[]>>(
      `${env.SERVER_URL}groups/${groupId}/members`,
      member
    );
  }

  getGroupMembers(groupId: string) {
    return this.http.get<IResponse<IMember[]>>(
      `${env.SERVER_URL}groups/${groupId}/members`
    );
  }

  updateMemberPendingStatusById(member_id: string, groupId: string) {
    return this.http.post<IResponse<IMember>>(
      `${env.SERVER_URL}groups/${groupId}/members/:member_id`,
      member_id
    );
  }

  addTransactions(transaction: any, groupId: string) {
    return this.http.post<IResponse<any>>(
      `${env.SERVER_URL}groups/${groupId}/transactions`,
      transaction
    );
  }

  getTransactions(groupId: string) {
    return this.http.get<IResponse<any>>(
      `${env.SERVER_URL}groups/${groupId}/transactions`
    );
  }

  getTransactionsById(groupId: string, transactionId: string) {
    return this.http.get<IResponse<any>>(
      `${env.SERVER_URL}groups/${groupId}/transactions/${transactionId}`
    );
  }

  pushGroup(group: IFullGroup | IGroup) {
    const temp = this.groups();
    temp.push(group);
    this.groups.set(temp);
  }
}
