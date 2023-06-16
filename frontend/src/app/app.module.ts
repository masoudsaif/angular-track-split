import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { addTokenInterceptor } from './add-token.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TOKEN_KEY, USER_KEY } from './constants/keys';
import { GroupsService } from './groups/services/groups.service';
import { NotificationComponent } from './notification.component';
import { AuthService } from './services/auth.service';
import { SignInComponent } from './sign-in.component';
import { SignUpComponent } from './sign-up.component';

const bootstrap = (authService: AuthService, groupsService: GroupsService) => {
  return () => {
    const token =
      localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    const user =
      localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    if (token) {
      authService.token.set(token);
      authService.user.set(JSON.parse(user!));
      groupsService.getGroups(true).subscribe((res) => {
        if (res.success) {
          groupsService.requests.set(res.data);
        }
      });
    }
  };
};

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    NotificationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatBadgeModule,
    MatMenuModule,
    MatDividerModule,
  ],
  providers: [
    provideHttpClient(withInterceptors([addTokenInterceptor])),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: bootstrap,
      deps: [AuthService, GroupsService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
