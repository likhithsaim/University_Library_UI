import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { UserDialogData } from '../dashboard/dashboard.component';
import { Reservation } from '../reservation';
import { ReservationService } from '../reservation.service';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css']
})
export class UserDialogComponent implements OnInit {

  filteredUsersToAssign!: Observable<User[]>;
  filteredUsersToDeAssign!: Observable<User[]>;
  filteredUsers!: Observable<User[]>;
  ctrlForUserSelect = new FormControl();
  isChecked = false;
  user!: User;
  allUsers: User[] = [];
  usersOfBook: User[] = [];
  reservation!: Reservation;
  penalty!: number;
  hasPenalty:boolean = false;

  constructor(public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public userDialogData: UserDialogData, private userService: UserService, private reservationService: ReservationService) {
  }

  ngOnInit(): void {
    if (this.userDialogData.action === 'assign') {
      this.userService.getUsers().subscribe(users => {
        this.allUsers = users;
        this.filteredUsers = this.ctrlForUserSelect.valueChanges.pipe(
          startWith(''),
          map(value => this.filterUsersToAssign(value)),
        );
      });
    } else {
      this.userService.getUsersOfBook(this.userDialogData.bookUi.departmentId, this.userDialogData.bookUi.subject, this.userDialogData.bookUi.title).subscribe(users => {
        this.usersOfBook = users;
        this.filteredUsers = this.ctrlForUserSelect.valueChanges.pipe(
          startWith(''),
          map(value => this.filterUsersOfBook(value)),
        );
      });
    }
  }

  filterUsersToAssign(value: string): User[] {
    return this.allUsers.filter(x => x.firstName.toLowerCase().startsWith(value.toString().toLowerCase()) || x.readerId.toString().startsWith(value));
  }

  filterUsersOfBook(value: string): User[] {
    if (this.usersOfBook != null) {
      return this.usersOfBook.filter(x => x.firstName.toLowerCase().startsWith(value.toString().toLowerCase()) || x.readerId.toString().startsWith(value));
    } else {
      return [];
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  selectionChanged(usr: User) {
    this.user = usr;
    if (this.userDialogData.action === 'return') {
      let matchedBook = this.userDialogData.books.find(book => book.departmentId === this.userDialogData.bookUi.departmentId && book.subject === this.userDialogData.bookUi.subject && book.title === this.userDialogData.bookUi.title && !!book.userId && book.userId === this.user.readerId);
      if (!!matchedBook) {
        this.reservationService.getReservation(matchedBook.userId, matchedBook.id).subscribe(res => {
          this.reservation = res;
          if (!!this.reservation) {
            let dayDiff = this.getDifferenceInDays(new Date(), this.reservation.reservationDate);
            this.penalty = 10 + ((dayDiff-8) *2);
            this.hasPenalty = this.penalty > 0;
          }
        });
      }
    }
  }

  checked(event: MatCheckboxChange, okBtn: MatButton) {
    this.isChecked = event.checked;
    okBtn.disabled = !event.checked;
  }

  getDifferenceInDays(date1: Date, date2: Date) {
    let timeInMilisec: number = new Date(date1).getTime() - new Date(date2).getTime();
    return Math.ceil(timeInMilisec / (1000 * 60 * 60 * 24));
  }

  submitted() {
    this.reservationService.patchReservation(this.penalty < 0 ? 0 : this.penalty, this.reservation.reservationId).subscribe(res=>console.log('patch complete',res));
  }
}
