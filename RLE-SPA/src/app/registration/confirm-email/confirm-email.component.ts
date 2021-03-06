import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { User } from 'src/app/_models/user';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/_services/user.service';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css'],
  animations: [SharedAnimations]
})
export class ConfirmEmailComponent implements OnInit {
  user: User;
  loginForm: FormGroup;
  userNameExist = false;
  waitDiv = false;
  userPhotoUrl = '';
  file: File = null;



  constructor(private authService: AuthService, private fb: FormBuilder, private route: ActivatedRoute,
    private alertify: AlertifyService, private router: Router) { }

  ngOnInit() {

    this.route.data.subscribe(data => {
      this.user = data['user'].user;
      console.log(this.user);
    });

    this.loginForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
    });
  }

  userNameVerification() {
    const userName = this.loginForm.value.userName;
    this.userNameExist = false;
    this.authService.userNameExist(userName).subscribe((res: boolean) => {
      if (res === true) {
        this.userNameExist = true;
        // this.user1Form.valid = false;
      }
    });

  }

  parentImgResult(event) {
    this.file = <File>event.target.files[0];

    // recuperation de l'url de la photo
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.userPhotoUrl = e.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  addPhoto(userId) {
    const formData = new FormData();
    formData.append('file', this.file, this.file.name);
    this.authService.addUserPhoto(userId, formData).subscribe(() => {
      this.userPhotoUrl = '';
     // this.alertify.success('enregistrement terminé...');
      // this.userForm.reset();
      // this.waitDiv = false;
    }, error => {
      console.log(error);
      this.waitDiv = false;
    });
  }

  resultMode(val: boolean) {
    if (val) {
      this.alertify.success('votre mot de passe a bien été enregistré');
      this.router.navigate(['/Home']);
    } else {
      this.alertify.success('erreur survenue');

    }
  }


  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.loginForm.controls.password.value) {
      return { confirm: true, error: true };
    }
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.loginForm.controls.checkPassword.updateValueAndValidity());
  }

  submitForm(): void {
    this.waitDiv = true;
    this.authService.setUserLoginPassword(this.user.id, this.loginForm.value).subscribe(() => {
      if (this.userPhotoUrl) {
        this.addPhoto(this.user.id);
      }
      // this.passwordSetingResult.emit(true);
      this.alertify.success('enregistrement terminé...');
      this.router.navigate(['home']);

    }, error => {
      this.alertify.error(error);
      this.router.navigate(['error']);
    });

  }

}
