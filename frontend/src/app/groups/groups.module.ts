import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

import { GroupCardComponent } from './group-card.component';
import { GroupRoutingModule } from './groups-routing.module';
import { GroupsComponent } from './groups.component';
import { GroupComponent } from './group.component';

@NgModule({
  declarations: [GroupsComponent, GroupCardComponent, GroupComponent],
  imports: [
    CommonModule,
    GroupRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatGridListModule,
  ],
})
export class GroupsModule {}
