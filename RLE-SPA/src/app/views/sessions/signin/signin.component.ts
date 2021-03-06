import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouteConfigLoadStart, ResolveStart, RouteConfigLoadEnd, ResolveEnd } from '@angular/router';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';


@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],
    animations: [SharedAnimations]
})
export class SigninComponent implements OnInit {
    model: any = {};
    user: User;
    verifyModel: any = {};
    notConfirmed: boolean;
    showValidationForm: boolean;
    isVisible: boolean;
    passwordForm: FormGroup;
    signinForm: FormGroup;
    loading: boolean;
    loadingText: string;
    formValid: boolean;

    constructor(private authService: AuthService, private router: Router, private fb: FormBuilder,
        private alertify: AlertifyService) { }

    ngOnInit() {
        this.signinForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
        // if (this.loggedIn()) {
        //     this.router.navigate(['/home']);
        // } else {
        //     this.router.events.subscribe(event => {
        //         if (event instanceof RouteConfigLoadStart || event instanceof ResolveStart) {
        //             this.loadingText = 'Loading Dashboard Module...';

        //             this.loading = true;
        //         }
        //         if (event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
        //             this.loading = false;
        //         }
        //     });

        //     this.signinForm = this.fb.group({
        //         username: ['', Validators.required],
        //         password: ['', Validators.required]
        //     });
        // }
    }

    loggedIn() {
        return this.authService.loggedIn();
    }

    signin() {
        this.loading = true;
        this.notConfirmed = false;
        this.authService.login(this.signinForm.value).subscribe(() => {
            if(this.authService.redirectUrl) {
                this.router.navigate([this.authService.redirectUrl]);
            } else {
                this.router.navigate(['/home']);
            }
            this.loading = false;
        }, error => {
            this.alertify.error(error.error);
            this.loading = false;
        });
    }

}
