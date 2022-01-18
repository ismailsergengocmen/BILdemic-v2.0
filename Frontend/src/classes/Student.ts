import Lecture from './Lecture';
import LoginManager from './LoginManager';
import LectureManager from './LectureManager';
import Seat from './Seat';
import User from './User'
import Dorm from './Dorm';

export default class Student extends User{

    //Properties
    private _ID:number;
    private _sportPunishStatus:boolean = false;
    private _resideInDorm:boolean;
    private _lectures:Lecture[] | null;
    private _dorm:Dorm;

    //Constructor
    public constructor(name:string, mail:string, password:string, role:string, phoneNumber:string, hesCode:string, ID:number, resideInDorm:boolean, dorm:Dorm){
        super(name,mail,password,role,phoneNumber,hesCode);
        this._ID = ID;
        this._resideInDorm = resideInDorm;
        this._lectures = null;
        this._dorm = dorm;
    }

    //Methods
    public enrollCourse(courseCode:string):boolean{
        let lm = LectureManager.getInstance();
        lm.enrollStudentToCourse(courseCode);
        return false;
    }

    public selectSeatFirst(UID: number, LID: number, row:number, col: number):boolean{
        let lm = LectureManager.getInstance();
        lm.setSeatOwner(LID, row, col);
        return false;
    }

    public confirmNeighbourSeat(courseCode:string, leftNeighbour:Student, rightNeighbour:Student):boolean{
        //TO DO
        return false;
    }

    
    public get ID(): number {
        return this._ID;
    }
    public set ID(ID: number) {
        this._ID = ID;
    }
    
    public get sportPunishStatus(): boolean {
        return this._sportPunishStatus;
    }
    public set sportPunishStatus(sportPunishStatus: boolean) {
        this._sportPunishStatus = sportPunishStatus;
    }
    
    public get resideInDorm(): boolean {
        return this._resideInDorm;
    }
    public set resideInDorm(resideInDorm: boolean) {
        this._resideInDorm = resideInDorm;
    }
    
    public get lectures(): Lecture[] | null {
        return this._lectures;
    }
    public set lectures(lectures: Lecture[] | null) {
        this._lectures = lectures;
    }
    
    public get dorm(): Dorm {
        return this._dorm;
    }
    public set dorm(dorm: Dorm) {
        this._dorm = dorm;
    }
}
