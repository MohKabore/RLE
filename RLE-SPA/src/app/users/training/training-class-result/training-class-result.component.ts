import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';

@Component({
  selector: 'app-training-class-result',
  templateUrl: './training-class-result.component.html',
  styleUrls: ['./training-class-result.component.scss'],
  animations: [SharedAnimations]
})
export class TrainingClassResultComponent implements OnInit {
  trainingClassId;
  users: any = [];
  filteredUsers: any = [];
  isSelected: any = [];
  currentUserId: number;
  totalSelected = 0;
  totalReserved = 0;
  pageSize = 8;
  searchControl: FormControl = new FormControl();


  constructor(private authService: AuthService, private route: ActivatedRoute, private alertify: AlertifyService, private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.currentUserId = this.authService.decodedToken.nameid;
    this.route.params.subscribe(params => {
      this.trainingClassId = params.id;
      this.verifyTrainerClass();
    });
    this.searchControl.valueChanges.pipe(debounceTime(200)).subscribe(value => {
      this.filerData(value);
    });
  }


  getTrainedUsers() {
    this.users = [];
    this.filteredUsers = [];
    this.userService.getTrainingClassParticipants(this.trainingClassId).subscribe((res: any[]) => {
      this.users = res;
      this.filteredUsers = res;
      this.totalReserved = this.users.filter(a => a.reserved === true).length;
      this.totalSelected = this.users.filter(a => a.selected === true).length;
    });
  }

  filerData(val) {
    if (val) {
      val = val.toLowerCase();
    } else {
      return this.filteredUsers = [...this.users];
    }
    const columns = Object.keys(this.users[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.users.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.filteredUsers = rows;
  }

  verifyIStatus() {
    this.userService.verifytrainingClassStatus(this.trainingClassId).subscribe((res: number) => {
      if (res === 0) {
        this.closeTrainingClass();
      } else {
        this.getTrainedUsers();
      }
    });
  }

  closeTrainingClass() {
    if (confirm('cette salle de formation n\'est pas encore clôturée... Voulez vous la cloturer mtnt?')) {
      this.userService.closeTrainingClass(this.trainingClassId, this.currentUserId).subscribe(() => {
        this.alertify.success('salle de formation cloturée...');
        this.getTrainedUsers();
      });
    } else {
      this.alertify.info('vous ne pouvez pas faire le point de cette salle de formation');
      this.router.navigate(['/home']);
    }
  }

  removeSelectedUsers() {
    if (confirm('confirmez-vous la désélection ??')) {
      let userids = [];
      for (let i = 0; i < this.isSelected.length; i++) {
        const element = this.isSelected[i].userId;
        userids = [...userids, element];
      }
      this.userService.unSelectUsers(userids, this.currentUserId).subscribe((res) => {
        this.filteredUsers = [];
        this.alertify.success('enregistrement terminé...');
        this.getTrainedUsers();
        // for (let i = 0; i < this.isSelected.length; i++) {
        //   const elt = userids[i];
        //   const curUser = this.users.find(a => a.id === elt);
        //   curUser.selected = false;
        //   curUser.isSelected = false;
        //   this.totalSelected = this.totalSelected - 1;
        // }
        // this.filteredUsers = this.users;
        this.isSelected = [];
      });
    }
  }

  selectUsers() {
    if (confirm('confirmez-vous la selection ??')) {
      let userids = [];
      for (let i = 0; i < this.isSelected.length; i++) {
        const element = this.isSelected[i].userId;
        userids = [...userids, element];
      }
      this.userService.selectUsers(userids, this.currentUserId).subscribe((res) => {
        this.getTrainedUsers();

        // for (let i = 0; i < this.isSelected.length; i++) {
        //   const elt = this.isSelected[i].userId;
        //   let curUser = this.users.find(a => a.id === elt);
        //   curUser.isSelected = false;
        //   curUser.selected = true;
        //   this.totalSelected = this.totalSelected + 1;
        // }
        // this.filteredUsers = this.users;
        this.isSelected = [];
        this.alertify.success('enregistrement terminé...');
      });
    }
  }
  reserveUsers() {
    if (confirm('confirmez-vous la mise en reserve ??')) {
      let userids = [];
      for (let i = 0; i < this.isSelected.length; i++) {
        const element = this.isSelected[i].userId;
        userids = [...userids, element];
      }
      this.userService.reserveUsers(userids, this.currentUserId).subscribe((res) => {
        this.getTrainedUsers();
        // this.filteredUsers = [];
        // for (let i = 0; i < this.isSelected.length; i++) {
        //   const elt = this.isSelected[i].userId;
        //   let curUser = this.users.find(a => a.id === elt);
        //   curUser.isSelected = false;
        //   curUser.reserved = true;
        //   this.totalReserved = this.totalReserved + 1;
        // }
        // this.filteredUsers = this.users;
        this.isSelected = [];
        this.alertify.success('enregistrement terminé...');
      });
    }
  }

  removeReservedUsers() {
    if (confirm('confirmez-vous la selection ??')) {
      let userids = [];
      for (let i = 0; i < this.isSelected.length; i++) {
        const element = this.isSelected[i].userId;
        userids = [...userids, element];
      }
      this.userService.unReserveUsers(userids, this.currentUserId).subscribe((res) => {
        // this.searchEmp();
        this.getTrainedUsers();
        // this.filteredUsers = [];
        // for (let i = 0; i < this.isSelected.length; i++) {
        //   const elt = this.isSelected[i].userId;
        //   let curUser = this.users.find(a => a.id === elt);
        //   curUser.reserved = false;
        //   curUser.isSelected = false;
        //   this.totalReserved = this.totalReserved - 1;
        // }
        // this.filteredUsers = this.users;
        this.isSelected = [];
        this.alertify.success('enregistrement terminé...');
      });
    }
  }

  setSelection(absenceData) {

    const index = absenceData.index;
    const userId = absenceData.userId;
    const idx = this.users.findIndex(a => a.id === userId);
    this.users[idx].isSelected = !this.users[index].isSelected;
    const selectPos = this.isSelected.findIndex(s => Number(s.userId) === userId);
    if (selectPos !== -1) {
      // l'element existe
      this.isSelected.splice(selectPos, 1);
    } else {
      this.isSelected = [...this.isSelected, absenceData];
    }
  }

  verifyTrainerClass() {
    if (this.authService.isMaintenancier()) {
      this.userService.veriftTrainerClass(this.currentUserId, this.trainingClassId).subscribe((res: boolean) => {
        if (res === false) {
          this.alertify.error('vous ne pouvez pas faire le point de cette salle de formation');
          this.router.navigate(['/home']);
        } else {
          this.verifyIStatus();
        }
      });
    } else {
      this.verifyIStatus();
      // this.getTrainedUsers();
    }
  }

}
