import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword  } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { getStorage, ref as refStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import Dorm from "./Dorm";

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

    public async changePhone(phoneNum:string){
        const auth = getAuth();
        const Uid = auth.currentUser?.uid;
        const db = getDatabase();

        await set(ref(db, `Users/${Uid}/_phoneNum`), phoneNum); 
    }

    public async changeAddress(dormNo:string, dormRoomNo:string){
        const auth = getAuth();
        const Uid = auth.currentUser?.uid;
        const db = getDatabase();

        const dorm = new Dorm(dormNo, dormRoomNo);
        await set(ref(db, `Users/${Uid}/_dorm`), dorm); 
    }

    public async changeHES(hesCode:string){
        const auth = getAuth();
        const Uid = auth.currentUser?.uid;
        const db = getDatabase();

        await set(ref(db, `Users/${Uid}/_hesObject/_hesCode`), hesCode);
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

    public async uploadProfilePictureToStorage(UID: string, file: File) {
        const storage = getStorage();
        const storageReference = refStorage(storage, `Users/${UID}/ProfilePhoto.jpg`);
        await uploadBytes(storageReference, file);

        const downloadURL = (await getDownloadURL(storageReference)); 
        const db = getDatabase();
        
        return set(ref(db, `Users/${UID}/_profilePic`), downloadURL);
    }
}
