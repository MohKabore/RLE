import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UploadFile, UploadInput, UploadOutput } from 'ng-uikit-pro-standard';
import { humanizeBytes } from 'ng-uikit-pro-standard';
import { TrainingClass } from 'src/app/_models/trainingClass';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-trainingClass-Photos',
  templateUrl: './trainingClass-Photos.component.html',
  styleUrls: ['./trainingClass-Photos.component.scss']
})
export class TrainingClassPhotosComponent implements OnInit {
  photos: any[] = [];
  trainingClass: TrainingClass;
  currentPhoto;
  trainingClassid: number;
  currentUserId: number;
  noPhoto = '';
  showImage = false;
  formData: FormData;
  files: File[];
  wait = false;
  fileNames = '';
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  photoId: number;
  dragOver: boolean;
  constructor(private route: ActivatedRoute, private router: Router, private alertify: AlertifyService, private authService: AuthService, private userService: UserService) { }

  ngOnInit() {
    this.currentUserId = this.authService.decodedToken.nameid;
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
    this.route.params.subscribe(params => {
      this.trainingClassid = params.id;
      this.getTrainingClassDetails(this.trainingClassid);
      this.getTrainingPhotos();
    });
  }

  getTrainingClassDetails(id) {
    this.userService.getTrainingClassDetails(id).subscribe((res: TrainingClass) => {
      this.trainingClass = res;
    }, error => {
      console.log(error);
    });
  }

  getTrainingPhotos() {
    this.photos = [];
    this.noPhoto = '';
    this.userService.trainingClassPhotos(this.trainingClassid).subscribe((res: any[]) => {
      this.photos = res;
      if (res.length < 1) {
        this.noPhoto = 'aucune photo enrégistrée';
      }
    }, error => {
      this.alertify.error(error);
    });
  }


  startUpload(): void {
    this.savePhotos();

  }

  resetFiles() {
    this.files = [];
    this.fileNames = '';
  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  onUploadOutput(output: UploadOutput | any): void {
    // if (output.type === 'allAddedToQueue') {
    // } else if (output.type === 'addedToQueue') {
    //   this.files.push(output.file); // add file to array when added
    // } else if (output.type === 'uploading') {
    //   // update current data in files array for uploading file
    //   const index = this.files.findIndex(file => file.id === output.file.id);
    //   this.files[index] = output.file;
    // } else if (output.type === 'removed') {
    //   // remove file from array when removed
    //   this.files = this.files.filter((file: UploadFile) => file !== output.file);
    // } else if (output.type === 'dragOver') {
    //   this.dragOver = true;
    // } else if (output.type === 'dragOut') {
    // } else if (output.type === 'drop') {
    //   this.dragOver = false;
    // }
    // this.showFiles();
  }





  displayPhoto(photo: any) {
    this.currentPhoto = photo;
    this.showImage = true;

  }

  getPhotos(event) {
    this.files = [];
    this.fileNames = '';
    for (let i = 0; i < event.target.files.length; i++) {
      const element = event.target.files[i];
      this.files = [...this.files, element];
      this.fileNames += ', ' + element.name;

    }

  }

  hidePhoto(p) {
    this.currentPhoto = null;
    this.showImage = false;

  }
  selectPhotoId(photoId) {
    this.photoId = photoId;
  }

  deletePhoto() {
    this.wait = true;
    this.userService.deletePhoto(this.photoId).subscribe(() => {
      this.alertify.success('photo supprimée...');
      this.wait = false;
      const cur = this.photos.findIndex(a => a.id === this.photoId);
      this.photos.splice(cur, 1);
    }, error => {
      console.log(error);
      // this.router.navigate(['error']);
    });
  }

  savePhotos() {
    this.wait = true;
    const formData = new FormData();
    for (let i = 0; i < this.files.length; i++) {
      const element = this.files[i];
      formData.append('photos', element);

    }

    this.userService.addTrainingPhotos(this.trainingClassid, formData).subscribe((res: any) => {
      this.getTrainingPhotos();
      this.alertify.success('enregistrement terminé...');
      this.files = [];
      this.fileNames = '';
      this.wait = false;
    }, error => {
      this.router.navigate(['error']);
    });
  }

}
