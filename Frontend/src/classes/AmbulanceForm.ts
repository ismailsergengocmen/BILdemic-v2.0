import Order from './Order'
import User from './User'

export default class AmbulanceForm extends Order {
  private _phoneNum: number;

  public constructor(place: string, UID: string, phoneNumber: number) {
    const DATE = new Date();
    const time = DATE.toLocaleDateString("tr-TR");
    const date = DATE.toLocaleTimeString("tr-TR");

    super(place, time, date, UID, "AmbulanceForm");
    this._phoneNum = phoneNumber;
  }

  public get phoneNum(): number {
    return this._phoneNum;
  }

  public set phoneNum(phoneNum: number) {
    this._phoneNum = phoneNum;
  }
}