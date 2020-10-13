import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, BsDatepickerModule, PaginationModule, ButtonsModule, ModalModule, TimepickerModule } from 'ngx-bootstrap';
import { RouterModule } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
// import { } from 'ng-uikit-pro-standard';
// import { InMemoryDataService } from './shared/inmemory-db/inmemory-db.service';

// MDB Angular Pro
import { StepperModule, ToastModule, WavesModule, MDBSpinningPreloader, ProgressbarModule, IconsModule, CarouselModule, TabsModule  } from 'ng-uikit-pro-standard';
import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';
import { NgxGalleryModule } from 'ngx-gallery';
import { FileUploadModule } from 'ng2-file-upload';
import { TimeAgoPipe } from 'time-ago-pipe';
import { NgxEchartsModule } from 'ngx-echarts';
import { TextMaskModule } from 'angular2-text-mask';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ColorPickerModule } from 'ngx-color-picker';

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
// import { PreSelectionComponent } from './users/new-user/pre-selection/pre-selection.component';
import { TrainingsComponent } from './users/training/trainings/trainings.component';
import { TrainingDetailsComponent } from './users/training/training-details/training-details.component';
import { TrainingDetailResolver } from './_resolvers/training-detail.resolver';
import { HomeResolver } from './_resolvers/home.resolve';
import { RegistrationDetailsComponent } from './Home/opDetails/registration-details/registration-details/registration-details.component';
import { RegistrationLocalitiesComponent } from './users/registration-localities/registration-localities.component';
// import { PreSelectedUsersComponent } from './users/new-user/pre-selected-users/pre-selected-users.component';
import { TrainingClassUsersComponent } from './users/training/training-class-users/training-class-users.component';
// import { TrainedUsersComponent } from './users/training/trained-users/trained-users.component';
// import { NotFoundComponent } from './Home/not-found/not-found.component';
// import { StockAllocationComponent } from './stocks/stock-allocation/stock-allocation.component';
import { ErrorComponent } from './Home/error/error.component';
// import { TabletsAllocationComponent } from './stocks/stock-allocation/tablets-allocation/tablets-allocation.component';
import { NgxQRCodeModule } from 'ngx-qrcode2';
// import { TrainingClassResultComponent } from './users/training/training-class-result/training-class-result.component';
import { EmployeesComponent } from './users/employees/employees.component';
// import { ApproSpareComponent } from './stocks/stock-allocation/appro-spare/appro-spare.component';
// import { BackTabletComponent } from './stocks/stock-allocation/back-tablet/back-tablet.component';
// import { AssignmentComponent } from './operation/assignment/assignment/assignment.component';
// import { ExpressAssigmentComponent } from './operation/assignment/assignment/express-assigment/express-assigment.component';
import { ForgotComponent } from './views/sessions/forgot/forgot.component';
import { ResetPasswordComponent } from './registration/reset-password/reset-password.component';
// import { RetroStoresComponent } from './retrofit/retro-stores/retro-stores.component';
import { OpHandlingComponent } from './operation/assignment/assignment/op-handling/op-handling.component';
import { DemoComponent } from './Home/demo/demo.component';
// import { RetrofitStockEntryComponent } from './retrofit/retro-stores/retrofit-stock-entry/retrofit-stock-entry.component';
// import { RetrofitStockAllocationComponent } from './retrofit/retro-stores/retrofit-stock-allocation/retrofit-stock-allocation.component';
// import { RetrofitStockHistoriesComponent } from './retrofit/retro-stores/retrofit-stock-histories/retrofit-stock-histories.component';
// import { RetrofitProductsComponent } from './retrofit/retro-stores/retrofit-products/retrofit-products.component';
import { ResetPasswordResolver } from './_resolvers/reset-password.resolver';
import { MemberPasswordSettingComponent } from './registration/member-password-setting/member-password-setting.component';
// import { EcsComponent } from './operation/ecs/ecs.component';
// import { MunDetailComponent } from './operation/mun-detail/mun-detail.component';
// import { FailureComponent } from './maintenance/failure/failure.component';
// import { FailureReportsComponent } from './maintenance/failure-reports/failure-reports.component';
// import { FailureReportComponent } from './maintenance/failure-report/failure-report.component';
// import { SdcardComponent } from './export/sdcard/sdcard.component';
// import { EcDataComponent } from './operation/ec-data/ec-data.component';
// import { TabletDetailComponent } from './operation/tablet-detail/tablet-detail.component';
// import { SdcardDetailComponent } from './export/sdcard-detail/sdcard-detail.component';
// import { ExportComponent } from './export/export/export.component';
// import { FailuresPointComponent } from './operation/failures-point/failures-point.component';
// import { SendToRepairComponent } from './stocks/send-to-repair/send-to-repair.component';
// import { EnrolmentPointComponent } from './operation/enrolment-point/enrolment-point.component';
// import { ExportPointComponent } from './export/export-point/export-point.component';
// // import { SignupComponent } from './views/sessions/signup/signup.component';
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
    // PreSelectionComponent,
    TrainingsComponent,
    TrainingDetailsComponent,
    RegistrationDetailsComponent,
    RegistrationLocalitiesComponent,
    // PreSelectedUsersComponent,
    TrainingClassUsersComponent,
    // TrainedUsersComponent,
    // NotFoundComponent,
    // StockAllocationComponent,
    ErrorComponent,
  // TabletsAllocationComponent,
  // TrainingClassResultComponent,
  EmployeesComponent,
  // ApproSpareComponent,
  // BackTabletComponent,
  // AssignmentComponent,
  // ExpressAssigmentComponent,
   ResetPasswordComponent,
  ForgotComponent,
  // RetroStoresComponent,
  OpHandlingComponent,
  DemoComponent,
  // RetrofitStockEntryComponent,
  // RetrofitStockAllocationComponent,
  // RetrofitStockHistoriesComponent,
  // RetrofitProductsComponent,
  MemberPasswordSettingComponent,
  // EcsComponent,
  // MunDetailComponent,
  // FailureComponent,
  // FailureReportsComponent,
  // FailureReportComponent,
  // SdcardComponent,
  // EcDataComponent,
  // TabletDetailComponent,
  // SdcardDetailComponent,
  // ExportComponent,
  // FailuresPointComponent,
  // SendToRepairComponent,
  // EnrolmentPointComponent,
  // ExportPointComponent
  // // SignupComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxQRCodeModule,
    // InMemoryWebApiModule.forRoot(InMemoryDataService, {passThruUnknownUrl: true}),
    SharedModule,
    TextMaskModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    BsDatepickerModule,
    PaginationModule,
    ButtonsModule,
    ModalModule,
    TimepickerModule,
    CarouselModule ,
    StepperModule,
    ColorPickerModule,
    IconsModule,
    TabsModule,
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
    ResetPasswordResolver,
    HomeResolver,
    MDBSpinningPreloader,
    ProgressbarModule

  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
