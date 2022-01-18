export default class Dorm {
  private _dormNo: string;
  private _dormRoomNo: string;

  public constructor(dormNo: string, dormRoomNo: string) {
    this._dormNo = dormNo;
    this._dormRoomNo = dormRoomNo;
  }

  public get dormNo(): string {
    return this._dormNo;
  }
  
  public set dormNo(value: string) {
    this._dormNo = value;
  }

  public get dormRoomNo(): string {
    return this._dormRoomNo;
  }
  
  public set dormRoomNo(value: string) {
    this._dormRoomNo = value;
  }
}