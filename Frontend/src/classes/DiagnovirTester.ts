import User from './User'

export default class DiagnovirTester extends User {
  
  public constructor(name: string, mail: string, password: string, role: string,  phoneNum: string, hesCode: string) {
    super(name, mail, password, role, phoneNum, hesCode);
  }
}