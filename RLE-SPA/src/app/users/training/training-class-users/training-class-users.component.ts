import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { User } from 'src/app/_models/user';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { TrainingClass } from 'src/app/_models/trainingClass';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-training-class-users',
  templateUrl: './training-class-users.component.html',
  styleUrls: ['./training-class-users.component.scss']
})
export class TrainingClassUsersComponent implements OnInit {
  trainingClassid: number;
  show = false;
  trainingClass: TrainingClass;
  participants: any[] = [];
  isSelected: any = [];
  showConfirmation = false;
  currentUserId: number;
  qrcodename: string;
  title = 'generate-qrcode';
  elementType: 'url' | 'canvas' | 'img' = 'url';
  value: string;
  display = false;
  href: string;
  defauLink = environment.defaultLink;

  headElements = ['id', 'nom', 'Prenoms', 'Contact', 'Poste', 'Region', 'Departement', 'Ville'];

  constructor(private authService: AuthService, private route: ActivatedRoute, private alertify: AlertifyService, private userService: UserService) { }

  ngOnInit() {
    this.currentUserId = this.authService.decodedToken.nameid;
    this.route.params.subscribe(params => {
      this.trainingClassid = params.id;
      this.getTrainingClassParticipants();
      this.getTrainingClassDetails(this.trainingClassid);
      // this.generateQRCode();
    });

  }
  getTrainingClassParticipants() {
    this.userService.getTrainingClassParticipants(this.trainingClassid).subscribe((res: User[]) => {
      this.participants = res;
    }, error => {
      console.log(error);
    });
  }

  captureScreen() {
    this.show = true;
    const data = document.getElementById('test');
    html2canvas(data).then(canvas => {
      // const imgWidth = 208;
      // const pageHeight = 295;
      // const imgHeight = canvas.height * imgWidth / canvas.width;
      // const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'mm', 'a4');
      let position = 0;
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;


      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      const titre = 'fiche_de_presence_' + this.trainingClass.name + '.pdf';
      pdf.save(titre);
      this.show = false;

    });
  }

  hideDiv() {
    this.show = false;
  }

  showDiv(param) {
    if (param === true) {
      this.show = true;
      this.showConfirmation = false;
    } else {
      this.showConfirmation = true;

    }
  }

  select(e) {
    const idx = this.isSelected.indexOf(e);
    if (idx < 0) {
      this.isSelected = [...this.isSelected, e];
    } else {
      this.isSelected.splice(idx, 1);
    }
  }

  getTrainingClassDetails(id) {
    this.userService.getTrainingClassDetails(id).subscribe((res: TrainingClass) => {
      this.trainingClass = res;
    }, error => {
      console.log(error);
    });
  }

  removeUsers() {
    this.userService.removeUserToClass(this.trainingClassid, this.isSelected, this.authService.decodedToken.nameid).subscribe(() => {
      for (let i = 0; i < this.isSelected.length; i++) {
        const userId = this.isSelected[i];
        const idx = this.participants.findIndex(a => a.id === userId);
        this.participants.splice(idx, 1);
      }
      this.isSelected = [];
      this.alertify.success('enregistrement terminé...');
    }, error => {
      console.log(error);
    });
  }

  generateQRCode() {
    this.qrcodename = this.defauLink + 'trainingClassResult/' + this.trainingClassid;
  }
  downloadImage() {
    this.href = document.getElementsByTagName('img')[0].src;
  }

  selectUsers() {
    if (confirm('confirmez-vous la selection ??')) {
      let userids = [];
      for (let i = 0; i < this.isSelected.length; i++) {
        const element = this.isSelected[i].userId;
        userids = [...userids, element];
      }
      this.userService.selectUsers(this.isSelected, this.currentUserId).subscribe((res) => {
        this.isSelected = [];
        this.alertify.success('enregistrement terminé...');
        this.ngOnInit();
      });
    }
  }

  removeSelectedUsers() {
    if (confirm('confirmez-vous la désélection ??')) {

      this.userService.unSelectUsers(this.isSelected, this.currentUserId).subscribe((res) => {
        this.alertify.success('enregistrement terminé...');
        this.isSelected = [];
        this.ngOnInit();
      });
    }
  }
}