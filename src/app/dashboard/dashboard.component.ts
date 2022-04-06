import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { Book } from '../book';
import { bookList, userList } from '../data';
import { User } from '../user';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { BookService } from '../book.service';

type BookUi = {
  name: string;
  pages: number;
  subject: string;
  userId?: number;
  available: number;
  total: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  users: User[] = [];
  books: Book[] = [];
  userDataToDisplay: any;
  uiBooks: BookUi[] = [];
  checkedBooks: Book[] = [];
  checkedBooksUI: Book[] = [];
  unCheckedBooks: Book[] = [];
  unCheckedBooksUI: BookUi[] = [];
  user!: User;
  noCheckedBooks: boolean = false;
  noUnCheckedBooks: boolean = false;
  map: Map<string, Book[]> = new Map<string, Book[]>();
  displayedColumnsForChecked: string[] = [];
  displayedColumnsForRemaining: string[] = [];
  selectedUser: any;
  tabName: string = 'My Books';
  hideUserToAssign: boolean = false;
  ctrlForUserSelect = new FormControl();
  filteredUsersToAssign!: Observable<string[]>;
  userToAssign!: User;

  constructor(public dialog: MatDialog, public bookService : BookService) { }

  ngOnInit(): void {
    this.bookService.getHelloMessage().subscribe((x : string)=> console.log(x));
    this.map.clear();
    const userString = localStorage.getItem("currentUser");
    if (userString != null) {
      this.user = JSON.parse(userString);
      this.users = userList;
      this.books = bookList;
      this.displayedColumnsForChecked = ['id', 'name', 'pages', 'subject'];
      if (this.user.admin) {
        this.displayedColumnsForRemaining = ['id', 'name', 'pages', 'subject', 'availability', 'assign', 'return'];
      } else {
        this.displayedColumnsForRemaining = ['id', 'name', 'pages', 'subject', 'availability'];
      }
      this.checkedBooksUI = this.checkedBooks = this.books.filter(book => book.userId === this.user.id);
      this.unCheckedBooks = this.books.filter(book => book.userId !== this.user.id);

      // Group all books and create a map with name+subject as key
      this.books.forEach(x => {
        let key: string = x.name + ':' + x.subject;
        if (this.map.has(key)) {
          this.map.get(key)?.push(x);
        } else {
          this.map.set(key, [x]);
        }
      });


      this.map.forEach(x => {
        let uiB: BookUi = {
          ...x[0],
          available: x.filter(y => y.userId === undefined || y.userId === null).length,
          total: x.length
        };
        this.uiBooks.push(uiB);
      });

      this.noCheckedBooks = this.checkedBooks.length <= 0;
      this.noUnCheckedBooks = this.uiBooks.length <= 0;
      this.unCheckedBooksUI = this.uiBooks;
      this.filteredUsersToAssign = this.ctrlForUserSelect.valueChanges.pipe(
        startWith(''),
        map(value => this.filterUsersToAssign(value)),
      );
    }
  }

  filterUsersToAssign(value: string): string[] {
    return userList.filter(x => x.name.toLowerCase().startsWith(value.toLowerCase()) || x.id.toString().startsWith(value)).map(x => x.name + '(' + x.id + ')');
  }

  toggleCheck() {
    console.log("Checked books:", this.books.filter(book => book.userId !== null).map(book => book.name));
  }

  filterBooksWithTab(filterValue: string) {
    if (this.tabName === 'My Books') {
      this.checkedBooksUI = this.checkedBooks.filter(data => data.name.toLowerCase().startsWith(filterValue.toLowerCase()) || data.subject.toLowerCase().startsWith(filterValue.toLowerCase()));
    } else {
      this.unCheckedBooksUI = this.uiBooks.filter(data => data.name.toLowerCase().startsWith(filterValue.toLowerCase()) || data.subject.toLowerCase().startsWith(filterValue.toLowerCase()));
    }
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent) {
    this.tabName = tabChangeEvent.tab.textLabel === "My Books" ? "My Books" : "Inventory";
  }

  doAssign(b: MatButton, s: MatFormField) {
    console.log(b);
    b._elementRef.nativeElement.style.display = 'none';
    s._elementRef.nativeElement.style.display = '';
    this.hideUserToAssign = false;
  }

  openDialogToAssign(b: BookUi): void {
    this.dialog.open(UserDialogComponent, {
      width: '250px',
      data: { user: this.userToAssign }
    }).afterClosed().subscribe(result => {
      if (result?.name) {
        alert('book ' + b.name + ' is checked out by ' + result?.name);
      }
    });
  }

  openDialogToReturn(b: BookUi): void {
    this.dialog.open(UserDialogComponent, {
      width: '250px',
      data: { user: this.userToAssign }
    }).afterClosed().subscribe(result => {
      if (result?.name) {
        alert('book ' + b.name + ' is reurned by ' + result.name);
      }
    });

  }
}
