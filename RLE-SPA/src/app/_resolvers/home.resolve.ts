import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserService } from '../_services/user.service';
import { Region } from '../_models/region';
@Injectable()
export class HomeResolver implements Resolve<Region[]> {

    constructor(private router: Router, private userService: UserService, private alertify: AlertifyService) { }
    resolve(route: ActivatedRouteSnapshot): Observable<Region[]> {
        return this.userService.getAllRegionsOpDetails().pipe(
            catchError(error => {
                this.alertify.error(error);
                this.router.navigate(['/Home']);
                return of(null);
            })
        );
    }
}
