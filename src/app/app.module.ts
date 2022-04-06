import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppComponent } from './app.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSortModule} from '@angular/material/sort';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatDialogModule} from '@angular/material/dialog';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatTableModule } from '@angular/material/table';
import { NavbarComponent } from './navbar/navbar.component';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    NavbarComponent,
    UserDialogComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    MatTableModule,
    MatToolbarModule,
    MatIconModule,
    MatCheckboxModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatSortModule,
    ReactiveFormsModule,
    MatDialogModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
