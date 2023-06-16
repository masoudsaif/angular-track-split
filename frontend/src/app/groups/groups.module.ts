import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';

import { AddGroupDialogComponent } from './add-group-dialog.component';
import { GroupCardComponent } from './group-card.component';
import { GroupComponent } from './group.component';
import { GroupRoutingModule } from './groups-routing.module';
import { GroupsComponent } from './groups.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddMemberDialogComponent } from './add-member-dialog.component';

@NgModule({
  declarations: [
    GroupsComponent,
    GroupCardComponent,
    GroupComponent,
    AddGroupDialogComponent,
    AddMemberDialogComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GroupRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatGridListModule,
    MatIconModule,
    MatProgressBarModule,
    MatDialogModule,
    MatInputModule,
    MatDividerModule,
  ],
})
export class GroupsModule {}
