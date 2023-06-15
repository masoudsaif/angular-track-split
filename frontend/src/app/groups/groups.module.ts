import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { GroupRoutingModule } from './groups-routing.module';
import { GroupsComponent } from './groups.component';

@NgModule({
  declarations: [
    GroupsComponent
  ],
  imports: [CommonModule, GroupRoutingModule],
})
export class GroupsModule {}
