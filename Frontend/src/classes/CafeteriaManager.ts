import Meal, { MealType } from './Meal';
import User from './User';
import { getDatabase, ref, set, get, remove } from "firebase/database";
import { number } from '@intlify/core-base';
import { getAuth } from 'firebase/auth';

export default class CafeteriaManager {
  
  //Properties
  private static instance: CafeteriaManager | null = null;

  //Constructor
  private constructor() {}

  //Methods
  public static getInstance(): CafeteriaManager {
    if (this.instance == null) {
      this.instance = new CafeteriaManager();
    }
    return this.instance;
  }

  /**
   * Creates meal order with given parameters
   * @param place 
   * @param date 
   * @param time 
   * @param type 
   */
  public async createMealOrder(place: string, date: string, time: string, type: string){
    const ownerUID = getAuth().currentUser?.uid || ' ';
    const db = getDatabase();
    let meal = new Meal(place, date, time, ownerUID, type);
    let val;

    const isBuild = (await get(ref(db, `PendingMealOrders/isBuild`))).val();

    if(!isBuild){
      await this.buildMealBranch();
      await (set(ref(db, `PendingMealOrders/isBuild`), true));
    }

    if(place == "78"){
      val = (await get(ref(db, `PendingMealOrders/Regional/Counter78/Total78/`))).val();
      val = val + 1;
      await set(ref(db, `PendingMealOrders/Regional/Counter78/Total78/`), val);

      if(meal.mealType == MealType.NORMAL){
        val = (await get(ref(db, `PendingMealOrders/Regional/Counter78/Normal78/`))).val();
        val = val + 1;
        await set(ref(db, `PendingMealOrders/Regional/Counter78/Normal78/`), val);
      }

      else if(meal.mealType == MealType.VEGETARIAN){
        val = (await get(ref(db, `PendingMealOrders/Regional/Counter78/Vegetarian78/`))).val();
        val = val + 1;
        await set(ref(db, `PendingMealOrders/Regional/Counter78/Vegetarian78/`), val);
      }

      else{
        val = (await get(ref(db, `PendingMealOrders/Regional/Counter78/Vegan78/`))).val();
        val = val + 1;
        await set(ref(db, `PendingMealOrders/Regional/Counter78/Vegan78/`), val);
      }
    }

    else if(place == "51"){
      val = (await get(ref(db, `PendingMealOrders/Regional/Counter51/Total51/`))).val();
      val = val + 1;
      await set(ref(db, `PendingMealOrders/Regional/Counter51/Total51/`), val);
      
      if(meal.mealType == MealType.NORMAL){
        val = (await get(ref(db, `PendingMealOrders/Regional/Counter51/Normal51/`))).val();
        val = val + 1;
        await set(ref(db, `PendingMealOrders/Regional/Counter51/Normal51/`), val);
      }

      else if(meal.mealType == MealType.VEGETARIAN){
        val = (await get(ref(db, `PendingMealOrders/Regional/Counter51/Vegetarian51/`))).val();
        val = val + 1;
        await set(ref(db, `PendingMealOrders/Regional/Counter51/Vegetarian51/`), val);
      }

      else{
        val = (await get(ref(db, `PendingMealOrders/Regional/Counter51/Vegan51/`))).val();
        val = val + 1;
        await set(ref(db, `PendingMealOrders/Regional/Counter51/Vegan51/`), val);
      }
    }

    else{
      val = (await get(ref(db, `PendingMealOrders/Regional/Counter90/Total90/`))).val();
      val = val + 1;
      await set(ref(db, `PendingMealOrders/Regional/Counter90/Total90/`), val);

      if(meal.mealType == MealType.NORMAL){
        val = (await get(ref(db, `PendingMealOrders/Regional/Counter90/Normal90/`))).val();
        val = val + 1;
        await set(ref(db, `PendingMealOrders/Regional/Counter90/Normal90/`), val);
      }

      else if(meal.mealType == MealType.VEGETARIAN){
        val = (await get(ref(db, `PendingMealOrders/Regional/Counter90/Vegetarian90/`))).val();
        val = val + 1;
        await set(ref(db, `PendingMealOrders/Regional/Counter90/Vegetarian90/`), val);
      }

      else{
        val = (await get(ref(db, `PendingMealOrders/Regional/Counter90/Vegan90/`))).val();
        val = val + 1;
        await set(ref(db, `PendingMealOrders/Regional/Counter90/Vegan90/`), val);
      }
    }

    await set(ref(db, `Users/${ownerUID}/_orders/Meal`), meal);
    await set(ref(db, `PendingMealOrders/Orders/${meal._OID}`), meal);
  }

  /**
   * Removes given meal order
   * @param UID, user ID
   * @param OID, order ID 
   */
  public async deleteMealOrder(UID: string, OID: string){
    const db = getDatabase();
    let val;
    
    let meal = (await get(ref(db, `Users/${UID}/_orders/Meal/`))).val();
    let place = meal._place;

    if(place == "78"){
      val = (await get(ref(db, `PendingMealOrders/Regional/Counter78/Total78`))).val();
      val = val - 1;
      await set(ref(db, `PendingMealOrders/Regional/Counter78/Total78/`), val);

      if(meal._mealType == MealType.NORMAL){
        val = (await get(ref(db, `PendingMealOrders/Regional/Counter78/Normal78/`))).val();
        val = val - 1;
        await set(ref(db, `PendingMealOrders/Regional/Counter78/Normal78/`), val);
      }

      else if(meal._mealType == MealType.VEGETARIAN){
        val = (await get(ref(db, `PendingMealOrders/Regional/Counter78/Vegetarian78/`))).val();
        val = val - 1;
        await set(ref(db, `PendingMealOrders/Regional/Counter78/Vegetarian78/`), val);
      }

      else{
        val = (await get(ref(db, `PendingMealOrders/Regional/Counter78/Vegan78/`))).val();
        val = val - 1;
        await set(ref(db, `PendingMealOrders/Regional/Counter78/Vegan78/`), val);
      }
    }

    else if(place == "51"){
      val = (await get(ref(db, `PendingMealOrders/Regional/Counter51/`))).val();
      val = val - 1;
      await set(ref(db, `PendingMealOrders/Regional/Counter51/`), val);

      if(meal._mealType == MealType.NORMAL){
        val = (await get(ref(db, `PendingMealOrders/Regional/Counter51/Normal51/`))).val();
        val = val - 1;
        await set(ref(db, `PendingMealOrders/Regional/Counter51/Normal51/`), val);
      }

      else if(meal._mealType == MealType.VEGETARIAN){
        val = (await get(ref(db, `PendingMealOrders/Regional/Counter51/Vegetarian51/`))).val();
        val = val - 1;
        await set(ref(db, `PendingMealOrders/Regional/Counter51/Vegetarian51/`), val);
      }

      else{
        val = (await get(ref(db, `PendingMealOrders/Regional/Counter51/Vegan51/`))).val();
        val = val - 1;
        await set(ref(db, `PendingMealOrders/Regional/Counter51/Vegan51/`), val);
      }
    }

    else{
      val = (await get(ref(db, `PendingMealOrders/Regional/Counter90/Total90/`))).val();
      val = val - 1;
      await set(ref(db, `PendingMealOrders/Regional/Counter90/Total90/`), val);

      if(meal._mealType == MealType.NORMAL){
        val = (await get(ref(db, `PendingMealOrders/Regional/Counter90/Normal90/`))).val();
        val = val - 1;
        await set(ref(db, `PendingMealOrders/Regional/Counter90/Normal90/`), val);
      }

      else if(meal._mealType == MealType.VEGETARIAN){
        val = (await get(ref(db, `PendingMealOrders/Regional/Counter90/Vegetarian90/`))).val();
        val = val - 1;
        await set(ref(db, `PendingMealOrders/Regional/Counter90/Vegetarian90/`), val);
      }

      else{
        val = (await get(ref(db, `PendingMealOrders/Regional/Counter90/Vegan90/`))).val();
        val = val - 1;
        await set(ref(db, `PendingMealOrders/Regional/Counter90/Vegan90/`), val);
      }
    }

    await remove(ref(db, `Users/${UID}/_orders/Meal`));
    await remove(ref(db, `PendingMealOrders/Orders/${OID}`));
  }

  /**
   * Created meal branch and fill counters with 0
   */
  public async buildMealBranch(){
    const db = getDatabase();

    await set(ref(db, `PendingMealOrders/Regional/Counter90/Total90`), 0);
    await set(ref(db, `PendingMealOrders/Regional/Counter90/Normal90`), 0);
    await set(ref(db, `PendingMealOrders/Regional/Counter90/Vegetarian90`), 0);
    await set(ref(db, `PendingMealOrders/Regional/Counter90/Vegan90`), 0);

    await set(ref(db, `PendingMealOrders/Regional/Counter78/Total78`), 0);
    await set(ref(db, `PendingMealOrders/Regional/Counter78/Normal78`), 0);
    await set(ref(db, `PendingMealOrders/Regional/Counter78/Vegetarian78`), 0);
    await set(ref(db, `PendingMealOrders/Regional/Counter78/Vegan78`), 0);

    await set(ref(db, `PendingMealOrders/Regional/Counter51/Total51`), 0);
    await set(ref(db, `PendingMealOrders/Regional/Counter51/Normal51`), 0);
    await set(ref(db, `PendingMealOrders/Regional/Counter51/Vegetarian51`), 0);
    await set(ref(db, `PendingMealOrders/Regional/Counter51/Vegan51`), 0);
  }

  // To change taken status of meal order 
  public async changeTakenStatus(UID:string, OID: string){
    const db = getDatabase();

    await set(ref(db, `Users/${UID}/_orders/Meal/_taken`), true);
    await set(ref(db, `PendingMealOrders/Orders/${OID}/_taken`), true);
  }

  /**
   * To be used in menu based distribution tab
   * Calculates all orders counts
   */
  public async calculateTotalOrder(){
    const db = getDatabase();

    const orders = {
      normal: {
        type90: "",
        type78: "",
        type51: "",
      },
      vegetarian: {
        type90: "",
        type78: "",
        type51: "",
      },
      vegan: {
        type90: "",
        type78: "",
        type51: "",
      },
      total: {
        type90: "",
        type78: "",
        type51: "",
      }
    };

    orders.normal.type90 = (await get(ref(db, `PendingMealOrders/Regional/Counter90/Normal90`))).val();
    orders.normal.type78 = (await get(ref(db, `PendingMealOrders/Regional/Counter78/Normal78`))).val();
    orders.normal.type51 = (await get(ref(db, `PendingMealOrders/Regional/Counter51/Normal51`))).val();

    orders.vegetarian.type90 = (await get(ref(db, `PendingMealOrders/Regional/Counter90/Vegetarian90`))).val();
    orders.vegetarian.type78 = (await get(ref(db, `PendingMealOrders/Regional/Counter78/Vegetarian78`))).val();
    orders.vegetarian.type51 = (await get(ref(db, `PendingMealOrders/Regional/Counter51/Vegetarian51`))).val();
    
    orders.vegan.type90 = (await get(ref(db, `PendingMealOrders/Regional/Counter90/Vegan90`))).val();
    orders.vegan.type78 = (await get(ref(db, `PendingMealOrders/Regional/Counter78/Vegan78`))).val();
    orders.vegan.type51 = (await get(ref(db, `PendingMealOrders/Regional/Counter51/Vegan51`))).val();
    
    orders.total.type90 = (await get(ref(db, `PendingMealOrders/Regional/Counter90/Total90`))).val();
    orders.total.type78 = (await get(ref(db, `PendingMealOrders/Regional/Counter78/Total78`))).val();
    orders.total.type51 = (await get(ref(db, `PendingMealOrders/Regional/Counter51/Total51`))).val();
    
    return orders;
  }

  /**
   * To get specific order with takerID
   * @param takerID 
   * @param meal 
   */
  public async searchOrder(takerID:number){
    const db = getDatabase();
    return (await get(ref(db, `Users/${takerID}/_orders/Meal/`))).val();
  }

  /**
   * To get all meal orders
   */
  public async getAllMealOrders() {
    const db = getDatabase();

    return (await get(ref(db, `PendingMealOrders/Orders`))).val();
  }
}