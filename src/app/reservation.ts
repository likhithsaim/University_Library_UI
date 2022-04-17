export class Reservation {
    reservationId: number;
    readerId: number;
    adminId: number;
    bookId: number;
    reservationDate: Date;
    dueDate: Date;
    status: string;
    returnDate: Date | null;
    penalty: number;

    constructor(
        reservationId: number,
        readerId: number,
        adminId: number,
        bookId: number,
        reservationDate: Date,
        dueDate: Date,
        status: string,
        returnDate: Date | null,
        penalty: number
    ) {
        this.reservationId = reservationId;
        this.readerId = readerId;
        this.adminId = adminId;
        this.bookId = bookId;
        this.reservationDate = reservationDate;
        this.dueDate = dueDate;
        this.status = status;
        this.returnDate = returnDate;
        this.penalty = penalty;
    }
}