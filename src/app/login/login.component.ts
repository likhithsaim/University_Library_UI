import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { User } from '../user';
import { userList } from '../data';
import { UserService } from '../user.service';

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

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    userList.splice(0, userList.length);
    this.userService.getUsers().subscribe((x: User[]) => {
      x.forEach(user => userList.push(user));
    });

    this.userService.getAdminUsers().subscribe((x: User[]) => {
      x.forEach(user => userList.push(user));
    });

    // this.user = new User(this.userId, this.password, this.name, this.admin);
  }

  onSubmit(): void {
    console.log('form submitted');

    if (this.adminTab) {
      this.user = this.getAdminUser();
    } else {
      this.user = this.getUser();
    }

    if (this.user !== undefined) {
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
    this.user = userList.find(x => x.readerId == this.userId && x.password === this.password);
    if (!!this.user)
      this.user.admin = this.adminTab;
    return this.user;
  }

  getAdminUser(): User | undefined {
    this.user = userList.find(x => x.adminId == this.userId && x.password === this.password);
    if (!!this.user) {
      this.user.admin = this.adminTab;
    }
    return this.user;
  }

}
