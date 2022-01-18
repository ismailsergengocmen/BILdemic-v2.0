import User from './User'
import HealthForm from './HealthForm'

export default class HealthCenterStaff extends User {
  
  public constructor(name: string, mail: string, password: string, role: string, phoneNum: string, hesCode: string){
        super(name, mail, password, role, phoneNum, hesCode);
    }

  public closeForm(healthForm: HealthForm): boolean {
    //TODO
    return true;
  }
}