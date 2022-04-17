export class Book {

    public id: number;
    public departmentId: number;
    public title: string;
    public authorName: string;
    public publishedYear: string;
    public rackNumber: string;
    public status: string;
    public pageCount: number;
    public subject: string;
    public userId: number;

    constructor(
        id: number,
        departmentId: number,
        title: string,
        authorName: string,
        publishedYear: string,
        rackNo: string,
        status: string,
        pageCount: number,
        subject: string,
        userId: number
    ) {
        this.id = id;
        this.departmentId = departmentId;
        this.title = title;
        this.authorName = authorName;
        this.publishedYear = publishedYear;
        this.rackNumber = rackNo;
        this.status = status;
        this.pageCount = pageCount;
        this.subject = subject;
        this.userId = userId;
    }

}