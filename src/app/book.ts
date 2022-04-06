export class Book {

    public id: number;
    public name: string;
    public pages: number;
    public subject: string;
    public userId?: number;

    constructor(
        id: number,
        name: string,
        pages: number,
        subject: string,
        userId: number
    ) {
        this.id = id;
        this.name = name;
        this.pages = pages;
        this.subject = subject;
        this.userId = userId;
    }

}