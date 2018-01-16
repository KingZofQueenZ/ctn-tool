import { Component, OnInit } from '@angular/core'; 
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {    
  model: any = {};

  constructor(
    private router: Router,
    private userService: UserService) { }

  register() {
    this.userService.create(this.model)
        .subscribe(
            data => {
              console.log('Register success')
                this.router.navigate(['/login']);
            });
  }

}
