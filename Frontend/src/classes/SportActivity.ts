import Order from "./Order";

export default class SportActivity extends Order{

    private _activity:string = "";
    private _absenceStatus:boolean = false;

    public constructor(place:string, time:string, date:string, UID:string, activity:string, absenceStatus:boolean){
        super(place, date, time, UID, "SportActivity");
        this._activity = activity;
        this._absenceStatus = absenceStatus;
    }

    public get activity(): string {
        return this._activity;
    }
    public set activity(activity: string) {
        this._activity = activity;
    }

    public get absenceStatus(): boolean {
        return this._absenceStatus;
    }
    public set absenceStatus(absenceStatus: boolean) {
        this._absenceStatus = absenceStatus;
    }

}
