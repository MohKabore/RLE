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


export const appRoutes: Routes = [
    // { path: 'preInscription', component: NewUserComponent },
    { path: 'signIn', component: SigninComponent },
    { path: 'confirmEmail/:code', component: ConfirmEmailComponent, resolve: { user: EmailConfirmResolver } },
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            { path: 'assignAccount', component: AssignAccountComponent, data: { roles: ['Admin', 'SuperAdmin'] } },
            { path: 'registrationLocalilties', component: RegistrationLocalitiesComponent, data: { roles: ['Admin', 'SuperAdmin'] } },
            { path: 'preSelection', component: PreSelectionComponent, data: { roles: [ 'Admin', 'Maintenancier', 'AgentHotline'] } },
            { path: 'inscription', component: NewUserComponent, data: { roles: [ 'Admin', 'Maintenancier', 'AgentHotline'] } },
            { path: 'formations', component: TrainingsComponent, data: { roles: ['Admin', 'Maintenancier', 'AgentHotline'] } },
            { path: 'trainingResult', component: TrainedUsersComponent, data: { roles: ['Admin', 'Maintenancier', 'AgentHotline'] } },
            { path: 'formation/:id', component: TrainingDetailsComponent, data: { roles: ['Admin', 'Maintenancier', 'AgentHotline'] }
            , resolve: { training: TrainingDetailResolver }},
            { path: 'addParticipant/:id', component: PreSelectedUsersComponent, data: { roles: ['Admin', 'Maintenancier', 'AgentHotline'] }},
            { path: 'participants/:id', component: TrainingClassUsersComponent, data: { roles: ['Admin', 'Maintenancier', 'AgentHotline'] }},
            { path: 'detailInscription', component: RegistrationDetailsComponent, data: { roles: ['Admin', 'Maintenancier', 'AgentHotline'] }},
            // { path: '', component: HomeComponent, resolve: { regions: HomeResolver } }
            { path: 'home', component: HomeComponent},
            { path: '', component: HomeComponent }

        ]
    },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
