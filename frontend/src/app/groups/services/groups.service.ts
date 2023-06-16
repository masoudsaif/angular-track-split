import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import IResponse from 'src/app/types/response.inteface';
import { environment as env } from 'src/environments/environment.development';

import IFullGroup from '../types/full-group.inteface';
import IGroup from '../types/group.interface';
import IMember from '../types/member.interface';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class GroupsService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
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

  addGroupMember(email: string, groupId: string) {
    return this.http.post<IResponse<Boolean>>(
      `${env.SERVER_URL}groups/${groupId}/members`,
      { email }
    );
  }

  getGroupMembers(groupId: string) {
    return this.http.get<IResponse<IMember[]>>(
      `${env.SERVER_URL}groups/${groupId}/members`
    );
  }

  updateMemberPendingStatusById(groupId: string) {
    return this.http.get<IResponse<IMember>>(
      `${env.SERVER_URL}groups/${groupId}/members/${
        this.authService.user()?._id
      }`
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
    const temp = [...this.groups()];
    temp.push(group);
    this.groups.set(temp);
  }

  removeRequest(index: number) {
    const temp = [...this.requests()];
    temp.splice(index, 1);
    this.requests.set(temp);
  }
}
