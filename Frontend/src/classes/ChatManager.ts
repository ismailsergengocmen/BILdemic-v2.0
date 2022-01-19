import { getDatabase, ref, push, set, get, query, orderByChild, equalTo, onValue } from "firebase/database";

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

    await set(ref(db, `Messages/${location}/${timestamp}`), message);
  }

}