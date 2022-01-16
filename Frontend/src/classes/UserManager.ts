import { getDatabase, get, ref } from "firebase/database";

export default class UserManager {
  
  private static instance: UserManager | null = null;

  private UserManager() {
        
  }

  public static getInstance(): UserManager{
    if(this.instance == null) {
        this.instance = new UserManager();
    }
    return this.instance;
  }

  public async getUserInfo(UID: string) {
    const db = getDatabase();
    
    return get(ref(db, `Users/${UID}`));
  }
}