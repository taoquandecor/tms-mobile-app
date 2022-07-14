import { Component } from '@angular/core';
import { AuthenticationService } from '../core/services/authentication.service';
import { Roles } from '../shared/models/constant/roles.model';
import { NotificationService } from '../core/services/notification.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  constructor(private authService: AuthenticationService, private nsv: NotificationService) {
    this.authService.laySessionInfo(Roles.User);

    this.nsv.check(true);
  }
}
