import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword  } from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";

export default class SettingsManager {

    //Properties
    private static instance:SettingsManager | null = null;

    //Constructor
    private SettingsManager(){}
    
    //Methods
    public static getInstance():SettingsManager{
        if(this.instance == null) {
            this.instance = new SettingsManager();
        }
        return this.instance;
    }

    public async changeMail(mail:string){
        const auth = getAuth();
        const Uid = auth.currentUser?.uid;
        const db = getDatabase();

        let user = (await get(ref(db, `Users/${Uid}`))).val();
        if(user){
            await set(ref(db, `Users/${Uid}/Mail`), mail); 
        }
    }

    public async changePassword(password:string){
        const auth = getAuth();
        const Uid = auth.currentUser?.uid;
        const db = getDatabase();

        let user = (await get(ref(db, `Users/${Uid}`))).val();
        if(user){
            await set(ref(db, `Users/${Uid}/Password`), password); 
        }
        return true;
    }

    public async changePhone(phoneNum:string){
        const auth = getAuth();
        const Uid = auth.currentUser?.uid;
        const db = getDatabase();

        let user = (await get(ref(db, `Users/${Uid}`))).val();
        if(user){
            await set(ref(db, `Users/${Uid}/PhoneNum`), phoneNum); 
        }
        return true;
    }

    public async changeAddress(address:string){
        const auth = getAuth();
        const Uid = auth.currentUser?.uid;
        const db = getDatabase();

        let user = (await get(ref(db, `Users/${Uid}`))).val();
        let currentAddress = (await get(ref(db, `Users/${Uid}`))).val();
        if(user){
            await set(ref(db, `Users/${Uid}/Address`), address); 
        }
        return true;
    }

    public async changeHES(hesCode:string){
        const auth = getAuth();
        const Uid = auth.currentUser?.uid;
        const db = getDatabase();

        let user = (await get(ref(db, `Users/${Uid}`))).val();
        if(user){
            await set(ref(db, `Users/${Uid}/HesCode`), hesCode); 
        return true;
        }
    }

    public async checkPassword(password: string) {
        const currentUser = getAuth().currentUser;

        // @ts-expect-error
        const cred = EmailAuthProvider.credential(currentUser?.email, password);
    
        // @ts-expect-error
        return reauthenticateWithCredential(currentUser, cred);
    }

    public async updatePassword(password: string) {
        const currentUser = getAuth().currentUser;

        // @ts-expect-error
        return updatePassword(currentUser, password);
    }
}
