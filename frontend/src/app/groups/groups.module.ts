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
import { MatTableModule } from '@angular/material/table';

import { AddGroupDialogComponent } from './add-group-dialog.component';
import { GroupCardComponent } from './group-card.component';
import { GroupComponent } from './group.component';
import { GroupRoutingModule } from './groups-routing.module';
import { GroupsComponent } from './groups.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddMemberDialogComponent } from './add-member-dialog.component';
import { PlusOnePipe } from './plus-one.pipe';
import { AddTransactionDialogComponent } from './add-transaction-dialog.component';

@NgModule({
  declarations: [
    GroupsComponent,
    GroupCardComponent,
    GroupComponent,
    AddGroupDialogComponent,
    AddMemberDialogComponent,
    PlusOnePipe,
    AddTransactionDialogComponent,
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
    MatTableModule,
  ],
})
export class GroupsModule {}
