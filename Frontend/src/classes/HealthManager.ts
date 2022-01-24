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

    public async makeAmbulanceCall(UID: string) {
        const db = getDatabase();
        const user = (await get(ref(db, `Users/${UID}`))).val();

        const place = user?._dorm?._dormNo + " - " + user?._dorm?._dormRoomNo;
        const phone = user?._phoneNum;

        const ambulanceForm = new AmbulanceForm(place, UID, phone);
        const OID = ambulanceForm.OID;

        await set(ref(db, `PendingAmbulanceForms/${OID}`), ambulanceForm);
        return set(ref(db, `Users/${UID}/_orders/AmbulanceForm`), ambulanceForm);
    }

    public async getAllAmbulanceForms() {
        const db = getDatabase();

        return get(ref(db, `PendingAmbulanceForms`));
    }

    public async dismissAmbulanceForm(UID: string) {
        const db = getDatabase();

        const form = (await get(ref(db, `Users/${UID}/_orders/AmbulanceForm`))).val();

        await remove(ref(db, `PendingAmbulanceForms/${form._OID}`));
        await remove(ref(db, `Users/${UID}/_orders/AmbulanceForm`));
    }

    public async getAmbulanceForm(UID: string) {
        const db = getDatabase();

        const form = (await get(ref(db, `Users/${UID}/_orders/AmbulanceForm`))).val();

        return get(ref(db, `PendingAmbulanceForms/${form._OID}`));
    }

    public async setAmbulanceForm(form: any) {
        const db = getDatabase();

        await set(ref(db, `PendingAmbulanceForms/${form._OID}`), form);
        await set(ref(db, `Users/${form._ownerUID}/_orders/AmbulanceForm`), form);
    }

    public async createHealthForm(UID: string, symptomsList: Array<string>) {
        const db = getDatabase();
        const healthForm = new HealthForm(UID, false, false, symptomsList);
        const OID = healthForm.OID;

        await set(ref(db, `PendingHealthForms/${OID}`), healthForm);
        await set(ref(db, `Users/${UID}/_orders/HealthForm`), healthForm);
    }

    public async healthFormChatStarted(UID: string) {
        const db = getDatabase();
        const form = (await get(ref(db, `Users/${UID}/_orders/HealthForm`))).val();

        await remove(ref(db, `PendingHealthForms/${form._OID}`));
        await set(ref(db, `OngoingHealthForms/${form._OID}`), form);
    }

    public async getAllHealthForms() {
        const db = getDatabase();

        return get(ref(db, `PendingHealthForms`));
    }

    public async getAllOngoingHealthForms() {
        const db = getDatabase();

        return get(ref(db, `OngoingHealthForms`));
    }
}