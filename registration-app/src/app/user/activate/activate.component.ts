import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MzButtonModule } from 'ng2-materialize';

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
    const code = this.route.snapshot.paramMap.get('code');

    this.userService.activate(code).subscribe(
      result => {
        console.log('result', result);
        this.router.navigate(['/login'], { queryParams: { activated : true}});
      },
      error => {
        console.log('error', error);
        this.error = true;
      });
  }
}
