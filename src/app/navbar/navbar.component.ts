import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentUser!: User;
  logoutMessage:string = ' logout';

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    const userString = localStorage.getItem("currentUser");
    if (userString != null) {
      this.currentUser = JSON.parse(userString);
    }
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigateByUrl('/login');
  }

  openDashboard(): void {
    this.router.navigateByUrl('/dashboard');
  }
}
