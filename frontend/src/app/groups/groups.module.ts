import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AddGroupDialogComponent } from './add-group-dialog.component';
import { AddMemberDialogComponent } from './add-member-dialog.component';
import { AddTransactionDialogComponent } from './add-transaction-dialog.component';
import { BalanceColorDirective } from './directives/balance-color.directive';
import { FilterDialogComponent } from './filter-dialog.component';
import { GroupCardComponent } from './group-card.component';
import { GroupComponent } from './group.component';
import { GroupRoutingModule } from './groups-routing.module';
import { GroupsComponent } from './groups.component';
import { ImageViewerDialogComponent } from './image-viewer-dialog.component';
import { MemberCardComponent } from './member-card.component';
import { MemberBalancePipe } from './pipes/member-balance.pipe';
import { MemberSpentPipe } from './pipes/member-spent.pipe';
import { TransactionCardComponent } from './transaction-card.component';

@NgModule({
  declarations: [
    GroupsComponent,
    GroupCardComponent,
    GroupComponent,
    AddGroupDialogComponent,
    AddMemberDialogComponent,
    AddTransactionDialogComponent,
    MemberCardComponent,
    TransactionCardComponent,
    MemberBalancePipe,
    BalanceColorDirective,
    MemberSpentPipe,
    ImageViewerDialogComponent,
    FilterDialogComponent,
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
    MatSelectModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatTooltipModule,
  ],
})
export class GroupsModule {}
