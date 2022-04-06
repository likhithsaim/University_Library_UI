import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { User } from '../user';
import { bookList, userList } from '../data';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userId!: number;
  password: string = '';
  name: string = '';
  admin: boolean = true;
  public user?: User;
  adminTab: boolean = true;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.user = new User(this.userId, this.password, this.name, this.admin);
  }

  onSubmit(): void {
    console.log('form submitted');
    this.user = this.getUser();

    if (this.user !== undefined) {
      this.admin = this.adminTab
      localStorage.setItem('currentUser', JSON.stringify(this.user));
      this.router.navigateByUrl('/dashboard');
    } else {
      alert('No ' + (this.adminTab ? 'admin' : 'student') + ' match found');
    }
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent) {
    this.adminTab = tabChangeEvent.tab.textLabel === 'admin' ? true : false;
    console.log(this.adminTab);
  }

  getUser(): User | undefined {
    this.user = userList.find(x => x.id == this.userId && x.password === this.password && x.admin === this.adminTab);
    return this.user;
  }

}
