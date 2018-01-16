import { Component, OnInit } from '@angular/core';
import { Hero } from '../models/hero';
import { User } from '../models/user';

import { HeroService } from '../services/hero.service';
import { UserService } from '../services/user.service';
import { MessageService } from '../services/message.service';
 
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  heroes: Hero[] = [];       
  currentUser: User;
  users: User[] = [];
 
  constructor(private heroService: HeroService, private userService: UserService) {        
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }
 
  ngOnInit() {       
    this.getHeroes();
    this.loadAllUsers();
  }
 
  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes.slice(1, 5));
  }    
  
  deleteUser(_id: string) {
    this.userService.delete(_id).subscribe(() => { this.loadAllUsers() });
  }

  private loadAllUsers() {
      this.userService.getAll().subscribe(users => { this.users = users; });
  }
}