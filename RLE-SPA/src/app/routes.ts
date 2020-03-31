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
// import { HomeResolver } from './_resolvers/home.resolve';
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


export const appRoutes: Routes = [
    // { path: 'preInscription', component: NewUserComponent },
    { path: 'signIn', component: SigninComponent },
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
            { path: 'opHandling', component: OpHandlingComponent, data: { roles: ['Admin', 'Maintenancier', 'AgentHotline'] } },
            { path: 'formations', component: TrainingsComponent, data: { roles: ['Admin', 'Maintenancier', 'AgentHotline'] } },
            { path: 'trainingResult', component: TrainedUsersComponent, data: { roles: ['Admin', 'Maintenancier', 'AgentHotline'] } },
            { path: 'trainingClassResult/:id', component: TrainingClassResultComponent, data: { roles: ['Admin', 'Maintenancier', 'AgentHotline'] } },
            { path: 'stockEntry', component: StockAllocationComponent, data: { roles: ['Admin', 'AgentHotline'] } },
            { path: 'stockAllocation', component: TabletsAllocationComponent, data: { roles: ['Admin', 'AgentHotline'] } },
            { path: 'approSphare', component: ApproSpareComponent, data: { roles: ['Admin', 'AgentHotline'] } },
            { path: 'assignment', component: AssignmentComponent, data: { roles: ['Admin', 'AgentHotline'] } },
            { path: 'expressAssignment', component: ExpressAssigmentComponent, data: { roles: ['Admin', 'AgentHotline'] } },
            { path: 'backTablet', component: BackTabletComponent, data: { roles: ['Admin', 'AgentHotline'] } },
            { path: 'retrofitStores', component: RetroStoresComponent, data: { roles: ['Admin', 'AgentHotline'] } },
            { path: 'retrofitStockEntry', component: RetrofitStockEntryComponent, data: { roles: ['Admin', 'AgentHotline'] } },
            { path: 'products', component: RetrofitProductsComponent, data: { roles: ['Admin', 'AgentHotline'] } },
            { path: 'retrofitStockTransfer', component: RetrofitStockAllocationComponent, data: { roles: ['Admin', 'AgentHotline'] } },
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
