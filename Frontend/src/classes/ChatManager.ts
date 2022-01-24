import { getDatabase, ref, set, get, remove } from "firebase/database";

export default class ChatManager {
  
  //Properties
  private static instance: ChatManager | null = null;

  //Constructor
  private constructor() {}

  //Methods
  public static getInstance(): ChatManager {
    if (this.instance == null) {
      this.instance = new ChatManager();
    }
    return this.instance;
  }

  public async sendMessage(location: string, UID: string, name: string, content: string) {
    const db = getDatabase();

    const timestamp = Date.now();
    const message = {
      uid: UID,
      name: name,
      content: content,
      timestamp: timestamp
    };

    await set(ref(db, `HealthCenterChats/${location}/${timestamp}`), message);
  }

  public async hasActiveChat(UID: string) {
    const db = getDatabase();

    return (await get(ref(db, `HealthCenterChats/${UID}`))).val() !== null;
  }

  public async endChat(UID: string) {
    const db = getDatabase();
    const user = (await get(ref(db, `Users/${UID}`))).val();

    await remove(ref(db, `HealthCenterChats/${UID}`));
    await remove(ref(db, `OngoingHealthForms/${user._orders.HealthForm._OID}`));
    await remove(ref(db, `Users/${UID}/_orders/HealthForm`));
  }
}