import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.scss']
})
export class ActivateComponent implements OnInit {
  error: Boolean = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute) {}

  ngOnInit() {
    console.log()
    const code = this.route.snapshot.paramMap.get('code');

    this.userService.activate(code).subscribe(
      result => {
      }, 
      error => {
        console.log(error);
        this.error = true;
      },
      () => {
        this.router.navigate(['/login?activated=true']);
      });
  }
}
