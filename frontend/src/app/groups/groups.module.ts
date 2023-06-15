import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { GroupRoutingModule } from './groups-routing.module';
import { GroupsComponent } from './groups.component';
import { GroupCardComponent } from './group-card.component';

@NgModule({
  declarations: [
    GroupsComponent,
    GroupCardComponent
  ],
  imports: [CommonModule, GroupRoutingModule],
})
export class GroupsModule {}
