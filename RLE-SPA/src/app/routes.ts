import { Routes } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard';
import { HomeComponent } from './Home/Home.component';
import { NewUserComponent } from './users/new-user/new-user.component';
import { AssignAccountComponent } from './admin/assign-account/assign-account.component';
import { SigninComponent } from './views/sessions/signin/signin.component';
import { EmailConfirmResolver } from './_resolvers/email-confirm.resolver';
import { ConfirmEmailComponent } from './registration/confirm-email/confirm-email.component';
import { PreSelectionComponent } from './users/new-user/pre-selection/pre-selection.component';
import { TrainingsComponent } from './users/training/trainings/trainings.component';
import { TrainingDetailsComponent } from './users/training/training-details/training-details.component';
import { TrainingDetailResolver } from './_resolvers/training-detail.resolver';
import { RegistrationDetailsComponent } from './Home/opDetails/registration-details/registration-details/registration-details.component';
import { RegistrationLocalitiesComponent } from './users/registration-localities/registration-localities.component';
import { PreSelectedUsersComponent } from './users/new-user/pre-selected-users/pre-selected-users.component';
import { TrainingClassUsersComponent } from './users/training/training-class-users/training-class-users.component';
import { TrainedUsersComponent } from './users/training/trained-users/trained-users.component';
import { NotFoundComponent } from './Home/not-found/not-found.component';
import { StockAllocationComponent } from './stocks/stock-allocation/stock-allocation.component';
import { ErrorComponent } from './Home/error/error.component';
import { TabletsAllocationComponent } from './stocks/stock-allocation/tablets-allocation/tablets-allocation.component';
import { TrainingClassResultComponent } from './users/training/training-class-result/training-class-result.component';
import { EmployeesComponent } from './users/employees/employees.component';
import { ApproSpareComponent } from './stocks/stock-allocation/appro-spare/appro-spare.component';
import { BackTabletComponent } from './stocks/stock-allocation/back-tablet/back-tablet.component';
import { AssignmentComponent } from './operation/assignment/assignment/assignment.component';
import { ExpressAssigmentComponent } from './operation/assignment/assignment/express-assigment/express-assigment.component';
import { RetroStoresComponent } from './retrofit/retro-stores/retro-stores.component';
import { OpHandlingComponent } from './operation/assignment/assignment/op-handling/op-handling.component';
import { DemoComponent } from './Home/demo/demo.component';
import { RetrofitStockEntryComponent } from './retrofit/retro-stores/retrofit-stock-entry/retrofit-stock-entry.component';
import { RetrofitStockAllocationComponent } from './retrofit/retro-stores/retrofit-stock-allocation/retrofit-stock-allocation.component';
import { RetrofitStockHistoriesComponent } from './retrofit/retro-stores/retrofit-stock-histories/retrofit-stock-histories.component';
import { RetrofitProductsComponent } from './retrofit/retro-stores/retrofit-products/retrofit-products.component';
import { ForgotComponent } from './views/sessions/forgot/forgot.component';
import { ResetPasswordComponent } from './registration/reset-password/reset-password.component';
import { ResetPasswordResolver } from './_resolvers/reset-password.resolver';
import { EcsComponent } from './operation/ecs/ecs.component';
import { MunDetailComponent } from './operation/mun-detail/mun-detail.component';
import { FailureComponent } from './maintenance/failure/failure.component';
import { FailureReportsComponent } from './maintenance/failure-reports/failure-reports.component';
import { FailureReportComponent } from './maintenance/failure-report/failure-report.component';
import { SdcardComponent } from './export/sdcard/sdcard.component';
import { EcDataComponent } from './operation/ec-data/ec-data.component';
import { TabletDetailComponent } from './operation/tablet-detail/tablet-detail.component';
import { SdcardDetailComponent } from './export/sdcard-detail/sdcard-detail.component';
import { ExportComponent } from './export/export/export.component';
import { FailuresPointComponent } from './operation/failures-point/failures-point.component';


export const appRoutes: Routes = [
    // { path: 'preInscription', component: NewUserComponent },
    { path: 'forgotPassword', component: ForgotComponent },
    { path: 'signIn', component: SigninComponent },
    { path: 'resetPassword/:code', component: ResetPasswordComponent, resolve: { user: ResetPasswordResolver } },

    { path: 'confirmEmail/:code', component: ConfirmEmailComponent, resolve: { user: EmailConfirmResolver } },
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            { path: 'error', component: ErrorComponent },
            { path: 'demo', component: DemoComponent },
            { path: 'assignAccount', component: AssignAccountComponent, data: { roles: ['Admin', 'SuperAdmin'] } },
            { path: 'registrationLocalilties', component: RegistrationLocalitiesComponent, data: { roles: ['Admin', 'SuperAdmin'] } },
            { path: 'preSelection', component: PreSelectionComponent, data: { roles: ['Admin', 'Maintenancier', 'AgentHotline'] } },
            { path: 'employees', component: EmployeesComponent, data: { roles: ['Admin', 'Maintenancier', 'AgentHotline'] } },
            { path: 'inscription', component: NewUserComponent, data: { roles: ['Admin', 'Maintenancier', 'AgentHotline'] } },
            { path: 'opHandling', component: OpHandlingComponent, data: { roles: ['Admin', 'AgentHotline'] } },
            { path: 'formations', component: TrainingsComponent, data: { roles: ['Admin', 'AgentHotline'] } },
            { path: 'trainingResult', component: TrainedUsersComponent, data: { roles: ['Admin', 'AgentHotline'] } },
            { path: 'trainingClassResult/:id', component: TrainingClassResultComponent, data: { roles: ['Admin', 'Maintenancier', 'AgentHotline'] } },
            { path: 'stockEntry', component: StockAllocationComponent, data: { roles: ['Admin', 'AgentHotline'] } },
            { path: 'stockAllocation', component: TabletsAllocationComponent, data: { roles: ['Admin', 'AgentHotline'] } },
            { path: 'approSphare', component: ApproSpareComponent, data: { roles: ['Admin', 'AgentHotline'] } },
            { path: 'assignment', component: AssignmentComponent, data: { roles: ['Admin', 'AgentHotline'] } },
            { path: 'failure', component: FailureComponent, data: { roles: ['Admin', 'AgentHotline'] } },
            { path: 'failures', component: FailureReportsComponent, data: { roles: ['Admin', 'AgentHotline'] } },
            { path: 'failuresPoint', component: FailuresPointComponent, data: { roles: ['Admin', 'AgentHotline'] } },
            { path: 'failureReport/:id', component: FailureReportComponent, data: { roles: ['Admin', 'AgentHotline'] } },
            { path: 'sdcard', component: SdcardComponent, data: { roles: ['Admin', 'AgentHotline'] } },
            { path: 'exports', component: ExportComponent, data: { roles: ['Admin', 'AgentHotline'] } },
            { path: 'sdcardDetails', component: SdcardDetailComponent , data: { roles: ['Admin', 'AgentHotline'] } },
            { path: 'expressAssignment', component: ExpressAssigmentComponent, data: { roles: ['Admin', 'AgentHotline'] } },
            { path: 'ecs', component: EcsComponent, data: { roles: ['Admin', 'AgentHotline', 'Maintenancier'] } },
            { path: 'tablette', component: TabletDetailComponent, data: { roles: ['Admin', 'AgentHotline', 'Maintenancier'] } },
            { path: 'ecdata', component: EcDataComponent, data: { roles: ['Admin', 'AgentHotline', 'Maintenancier'] } },
            { path: 'backTablet', component: BackTabletComponent, data: { roles: ['Admin', 'AgentHotline'] } },
            { path: 'retrofitStores', component: RetroStoresComponent, data: { roles: ['Admin', 'AgentHotline'] } },
            { path: 'retrofitStockEntry', component: RetrofitStockEntryComponent, data: { roles: ['Admin', 'AgentHotline'] } },
            { path: 'products', component: RetrofitProductsComponent, data: { roles: ['Admin', 'AgentHotline'] } },
            { path: 'retrofitStockTransfer', component: RetrofitStockAllocationComponent, data: { roles: ['Admin', 'AgentHotline'] } },
            { path: 'communes', component: MunDetailComponent, data: { roles: ['Admin', 'AgentHotline'] } },
            { path: 'retrofitStockHistories', component: RetrofitStockHistoriesComponent, data: { roles: ['Admin', 'AgentHotline'] } },
            {
                path: 'formation/:id', component: TrainingDetailsComponent, data: { roles: ['Admin', 'Maintenancier', 'AgentHotline'] }
                , resolve: { training: TrainingDetailResolver }
            },
            { path: 'addParticipant/:id', component: PreSelectedUsersComponent, data: { roles: ['Admin', 'Maintenancier', 'AgentHotline'] } },
            { path: 'participants/:id', component: TrainingClassUsersComponent, data: { roles: ['Admin', 'Maintenancier', 'AgentHotline'] } },
            { path: 'detailInscription', component: RegistrationDetailsComponent, data: { roles: ['Admin', 'Maintenancier', 'AgentHotline'] } },
            // { path: '', component: HomeComponent, resolve: { regions: HomeResolver } }
            { path: 'home', component: HomeComponent },
            { path: '', component: HomeComponent }

        ]
    },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
