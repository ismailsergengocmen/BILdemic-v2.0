import SportActivity from "./SportActivity";
import { getDatabase, ref, set, get, remove } from "firebase/database";
import { getAuth } from "firebase/auth";

export default class SportManager {

    //Properties
    private static instance: SportManager | null = null;

    //Methods
    public static getInstance():SportManager{
        if(this.instance == null) {
            this.instance = new SportManager();
        }
        return this.instance;
    }

    public async createSportRes(place: string, activity: string, date: string, time: string) {
        const UID = getAuth().currentUser?.uid || "";
        const db = getDatabase();

        const sportActivity = new SportActivity(place, time, date, UID, activity, false);
        const OID = sportActivity.OID;

        await set(ref(db, `Users/${UID}/_orders/Sports/${OID}`), sportActivity);
        
    }

    public async getSportsRes(UID: string) {
        const db = getDatabase();

        return get(ref(db, `Users/${UID}/_orders/Sports`));
    }

    public async cancelOrder(OID: string) {
        const db = getDatabase();
        const UID = getAuth().currentUser?.uid;

        await remove(ref(db, `Users/${UID}/_orders/Sports/${OID}`));
    }
}
