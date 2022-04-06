import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { userList } from '../data';
import { User } from '../user';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css']
})
export class UserDialogComponent implements OnInit {

  filteredUsersToAssign!: Observable<User[]>;
  ctrlForUserSelect = new FormControl();

  constructor(public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public user: User) { }

  ngOnInit(): void {
    this.filteredUsersToAssign = this.ctrlForUserSelect.valueChanges.pipe(
      startWith(''),
      map(value => this.filterUsersToAssign(value)),
    );
  }

  filterUsersToAssign(value: string): User[] {
    return userList.filter(x => x.name.toLowerCase().startsWith(value.toString().toLowerCase()) || x.id.toString().startsWith(value));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getUser(usr: User) {
    this.user = usr;
  }
}
