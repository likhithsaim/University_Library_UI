import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigateByUrl('/login');
  }

  openDashboard(): void{
    this.router.navigateByUrl('/dashboard');
  }
}
