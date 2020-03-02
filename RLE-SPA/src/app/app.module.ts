import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, TabsModule, BsDatepickerModule, PaginationModule, ButtonsModule, ModalModule } from 'ngx-bootstrap';
import { RouterModule } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { } from 'ng-uikit-pro-standard';
// import { InMemoryDataService } from './shared/inmemory-db/inmemory-db.service';

// MDB Angular Pro
import { StepperModule, ToastModule, WavesModule, MDBSpinningPreloader, ProgressbarModule } from 'ng-uikit-pro-standard';
import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';
import { NgxGalleryModule } from 'ngx-gallery';
import { FileUploadModule } from 'ng2-file-upload';
import { TimeAgoPipe } from 'time-ago-pipe';
import { NgxEchartsModule } from 'ngx-echarts';
import { TextMaskModule } from 'angular2-text-mask';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { SharedModule } from './shared/shared.module';
// import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
// import { InMemoryDataService } from './shared/inmemory-db/inmemory-db.service';
import { appRoutes } from './routes';
import { AuthGuard } from './_guards/auth.guard';
import { registerLocaleData, CommonModule } from '@angular/common';
import fr from '@angular/common/locales/fr';
import { AppComponent } from './app.component';
import { HomeComponent } from './Home/Home.component';
import { NewUserComponent } from './users/new-user/new-user.component';
import { AssignAccountComponent } from './admin/assign-account/assign-account.component';
import { SigninComponent } from './views/sessions/signin/signin.component';
import { NavGPanelComponent } from './nav/navGPanel/navGPanel.component';
import { NavAdminComponent } from './nav/nav-admin/nav-admin.component';
import { CallSheetCardComponent } from './admin/callSheet-card/callSheet-card.component';
import { EmailConfirmResolver } from './_resolvers/email-confirm.resolver';
import { ConfirmEmailComponent } from './registration/confirm-email/confirm-email.component';
import { HasRoleDirective } from './_directives/hasRole.directive';
import { PreSelectionComponent } from './users/new-user/pre-selection/pre-selection.component';
import { TrainingsComponent } from './users/training/trainings/trainings.component';
import { TrainingDetailsComponent } from './users/training/training-details/training-details.component';
import { TrainingDetailResolver } from './_resolvers/training-detail.resolver';
import { HomeResolver } from './_resolvers/home.resolve';
import { RegistrationDetailsComponent } from './Home/opDetails/registration-details/registration-details/registration-details.component';
import { RegistrationLocalitiesComponent } from './users/registration-localities/registration-localities.component';
import { PreSelectedUsersComponent } from './users/new-user/pre-selected-users/pre-selected-users.component';
import { TrainingClassUsersComponent } from './users/training/training-class-users/training-class-users.component';
import { TrainedUsersComponent } from './users/training/trained-users/trained-users.component';
registerLocaleData(fr);

export function tokenGetter() {
  return localStorage.getItem('token');
}
@NgModule({
  declarations: [
    TimeAgoPipe,
    HasRoleDirective,
    AppComponent,
    HomeComponent,
    NewUserComponent,
    AssignAccountComponent,
    SigninComponent,
    NavGPanelComponent,
    NavAdminComponent,
    CallSheetCardComponent,
    ConfirmEmailComponent,
    PreSelectionComponent,
    TrainingsComponent,
    TrainingDetailsComponent,
    RegistrationDetailsComponent,
    RegistrationLocalitiesComponent,
    PreSelectedUsersComponent,
    TrainingClassUsersComponent,
    TrainedUsersComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    HttpClientModule,
    // InMemoryWebApiModule.forRoot(InMemoryDataService, {passThruUnknownUrl: true}),
    SharedModule,
    TextMaskModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    TabsModule,
    BsDatepickerModule,
    PaginationModule,
    ButtonsModule,
    ModalModule,
    StepperModule,
    ToastModule.forRoot(),
    WavesModule,
    MDBBootstrapModulesPro.forRoot(),
    RouterModule.forRoot(appRoutes),
    // NgxGalleryModule,
    FileUploadModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:5000'],
        blacklistedRoutes: ['localhost:5000/api/auth']
      },
    }),
    NgxEchartsModule
  ],
  providers: [
    AuthGuard,
    EmailConfirmResolver,
    TrainingDetailResolver,
    HomeResolver,
    MDBSpinningPreloader,
    ProgressbarModule

  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
