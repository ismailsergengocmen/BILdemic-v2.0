import HealthForm from "./HealthForm";
import User from "./User";
import { ref, get, getDatabase, set, remove } from 'firebase/database';
import AmbulanceForm from "./AmbulanceForm";

export default class HealthManager {
    private static instance: HealthManager | null = null;

    private constructor() {

    }

    public static getInstance(): HealthManager {
        if(this.instance == null) {
            this.instance = new HealthManager();
        }
        return this.instance;
    }

    public createForm(user: User, date: string, place: string, time: string): boolean {
        //TO DO
        return true;
    }

    public async makeAmbulanceCall(UID: string) {
        const db = getDatabase();
        const user = (await get(ref(db, `Users/${UID}`))).val();

        const place = user?._dorm?._dormNo + " - " + user?._dorm?._dormRoomNo;
        const phone = user?._phoneNum;

        const ambulanceForm = new AmbulanceForm(place, UID, phone);
        const OID = ambulanceForm.OID;

        return set(ref(db, `AmbulanceForms/${OID}`), ambulanceForm);
    }

    public async getAllAmbulanceForms() {
        const db = getDatabase();

        return get(ref(db, `AmbulanceForms`));
    }

    public async dismissAmbulanceForm(OID: string) {
        const db = getDatabase();

        return remove(ref(db, `AmbulanceForms/${OID}`));
    }

    public async createHealthForm(UID: string, symptomsList: Array<string>) {
        const db = getDatabase();
        const healthForm = new HealthForm(UID, false, false, symptomsList);
        const OID = healthForm.OID;

        return set(ref(db, `HealthForms/${OID}`), healthForm);
    }

    public async getAllHealthForms() {
        const db = getDatabase();

        return get(ref(db, `HealthForms`));
    }
}