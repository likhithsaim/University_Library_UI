import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { Book } from '../book';
import { userList } from '../data';
import { User } from '../user';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { BookService } from '../book.service';
import { ReservationService } from '../reservation.service';
import { Reservation } from '../reservation';

export type BookUi = {
  title: string;
  pages: number;
  subject: string;
  departmentId: number;
  userId?: number;
  available: number;
  total: number;
}

export type UserDialogData = {
  bookUi: BookUi;
  action: string;
  books: Book[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  users: User[] = [];
  dummyBook: Book = {
    id: 0,
    departmentId: 0,
    title: '',
    authorName: '',
    publishedYear: '',
    rackNumber: '',
    status: '',
    pageCount: 0,
    subject: '',
    userId: 0,
    dueDate: undefined
  };
  userDataToDisplay: any;
  books: Book[] = []
  reservations: Reservation[] = []
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
  today!: Date;

  constructor(public dialog: MatDialog, public bookService: BookService, public reservationServie: ReservationService) { }

  ngOnInit(): void {
    this.reservationServie.getReservations().subscribe((x: Reservation[]) => {
      x.forEach(reservation => this.reservations.push(reservation));
      this.updateBooks();
    });
  }

  updateBooks(): void {
    this.today = new Date();
    this.books.splice(0, this.books.length);
    this.bookService.getBooksForUi().subscribe((x: Book[]) => {
      x.forEach(book => this.books.push({ ...this.dummyBook, ...book }));

      this.map.clear();
      const userString = localStorage.getItem("currentUser");
      if (userString != null) {
        this.user = JSON.parse(userString);
        this.users = userList;
        this.displayedColumnsForChecked = ['id', 'title', 'author', 'pages', 'subject', 'rack', 'due'];
        if (this.user.admin) {
          this.displayedColumnsForRemaining = ['id', 'title', 'author', 'pages', 'subject', 'rack', 'availability', 'assign', 'return'];
        } else {
          this.displayedColumnsForRemaining = ['id', 'title', 'author', 'pages', 'subject', 'rack', 'availability'];
        }
        this.checkedBooks = this.books.filter(book => book.userId === this.user.readerId);
        this.checkedBooks.forEach(book => {
          book.dueDate = this.reservations.find(reservation => reservation.bookId === book.id && reservation.status === 'Yet to return')?.dueDate;
        })
        this.checkedBooksUI = this.checkedBooks;
        this.unCheckedBooks = this.books.filter(book => book.userId !== this.user.readerId);

        // Group all books and create a map with name+subject as key
        this.map.clear();
        this.books.forEach(x => {
          let key: string = x.title + ':' + x.subject;
          if (this.map.has(key)) {
            this.map.get(key)?.push(x);
          } else {
            this.map.set(key, [x]);
          }
        });

        this.uiBooks.splice(0, this.uiBooks.length);
        this.map.forEach(x => {
          let uiB: BookUi = {
            ...x[0],
            available: x.filter(y => y.userId === undefined || y.userId === null || !y.userId).length,
            total: x.length,
            pages: 0,
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
    })
  }

  filterUsersToAssign(value: string): string[] {
    return userList.filter(x => x.firstName.toLowerCase().startsWith(value.toLowerCase()) || x.readerId.toString().startsWith(value)).map(x => x.firstName + '(' + x.readerId + ')');
  }

  filterBooksWithTab(filterValue: string) {
    if (this.user.admin) {
      this.unCheckedBooksUI = this.uiBooks.filter(data => data.title.toLowerCase().startsWith(filterValue.toLowerCase()) || data.subject.toLowerCase().startsWith(filterValue.toLowerCase()));
    } else {
      if (this.tabName === 'My Books') {
        this.checkedBooksUI = this.checkedBooks.filter(data => data.title.toLowerCase().startsWith(filterValue.toLowerCase()) || data.subject.toLowerCase().startsWith(filterValue.toLowerCase()));
      } else if (this.tabName === 'Inventory') {
        this.unCheckedBooksUI = this.uiBooks.filter(data => data.title.toLowerCase().startsWith(filterValue.toLowerCase()) || data.subject.toLowerCase().startsWith(filterValue.toLowerCase()));
      }
    }
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent) {
    this.tabName = tabChangeEvent.tab.textLabel === "My Books" ? "My Books" : "Inventory";
  }

  doAssign(b: MatButton, s: MatFormField) {
    b._elementRef.nativeElement.style.display = 'none';
    s._elementRef.nativeElement.style.display = '';
    this.hideUserToAssign = false;
  }

  openDialogToAssign(b: BookUi): void {
    this.dialog.open(UserDialogComponent, {
      width: '250px',
      data: { bookUi: b, action: 'assign' }
    }).afterClosed().subscribe(result => {
      if (result.firstName) {
        alert('book ' + b.title + ' is checked out by ' + result.firstName);
        let booksToAssign = this.books.filter(book => book.departmentId === b.departmentId && book.subject === b.subject && book.title === b.title && (!b.userId || b.userId == null || b.userId == undefined));
        let reservation = new Reservation(-1, result.readerId, this.user.adminId, booksToAssign[0].id, new Date(), (new Date(new Date().getTime() + (7 * 24 * 60 * 60 * 1000))), 'Yet to return', null, 0);
        this.reservationServie.postReservation(reservation).subscribe(res => {
          this.updateBooks();
          location.reload();
        });
      }
    });
  }

  openDialogToReturn(b: BookUi): void {
    this.dialog.open(UserDialogComponent, {
      width: '250px',
      data: { bookUi: b, action: 'return', books: this.books }
    }).afterClosed().subscribe(result => {
      if (result?.firstName) {
        alert('book ' + b.title + ' is returned by ' + result.firstName);
        location.reload();
      }
    });

  }
}
