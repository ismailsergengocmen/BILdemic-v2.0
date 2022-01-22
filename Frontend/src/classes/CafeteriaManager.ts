import Meal, { MealType } from './Meal';
import User from './User';
import { getDatabase, ref, set, get, remove } from "firebase/database";
import { number } from '@intlify/core-base';
import { getAuth } from 'firebase/auth';

export default class CafeteriaManager {
  
  //Properties
  private static instance: CafeteriaManager | null = null;
  private static isBuild: boolean = false;

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
    let meal = new Meal(place, time, date, ownerUID, type);
    let val;

    if(!CafeteriaManager.isBuild){
      this.buildMealBranch();
      CafeteriaManager.isBuild = true
    }

    else{
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
        val = (await get(ref(db, `PendingMealOrders/Regional/Counter51/`))).val();
        val = val + 1;
        await set(ref(db, `PendingMealOrders/Regional/Counter51/`), val);
      
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

      await set(ref(db, `Users/${ownerUID}/Orders/${meal._OID}`), meal);
      await set(ref(db, `PendingMealOrders/Orders/${meal._OID}`), meal);
      return true;
    }
  }

  /**
   * Removes given meal order
   * @param UID, user ID
   * @param OID, order ID 
   */
  public async deleteMealOrder(UID: string, OID: string){
    const db = getDatabase();
    let val;
    
    let meal = (await get(ref(db, `Users/${UID}/_orders/Sports/${OID}`))).val();
    let place = meal.place();

      if(place == "78"){
        val = (await get(ref(db, `PendingMealOrders/Regional/Counter78/Total78`))).val();
        val = val - 1;
        await set(ref(db, `PendingMealOrders/Regional/Counter78/Total78/`), val);

        if(meal.mealType == MealType.NORMAL){
          val = (await get(ref(db, `PendingMealOrders/Regional/Counter78/Normal78/`))).val();
          val = val - 1;
          await set(ref(db, `PendingMealOrders/Regional/Counter78/Normal78/`), val);
        }

        else if(meal.mealType == MealType.VEGETARIAN){
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
      
        if(meal.mealType == MealType.NORMAL){
          val = (await get(ref(db, `PendingMealOrders/Regional/Counter51/Normal51/`))).val();
          val = val - 1;
          await set(ref(db, `PendingMealOrders/Regional/Counter51/Normal51/`), val);
        }

        else if(meal.mealType == MealType.VEGETARIAN){
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

        if(meal.mealType == MealType.NORMAL){
          val = (await get(ref(db, `PendingMealOrders/Regional/Counter90/Normal90/`))).val();
          val = val - 1;
          await set(ref(db, `PendingMealOrders/Regional/Counter90/Normal90/`), val);
        }

        else if(meal.mealType == MealType.VEGETARIAN){
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

      await remove(ref(db, `Users/${UID}/_orders/Meals/${OID}`));
      await remove(ref(db, `PendingMealOrders/Orders/${OID}`));
      return true;
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

    let order = (await get(ref(db, `Users/${UID}/Orders/Meal/`))).val();
    await set(ref(db, `Users/${UID}/Orders/${OID}/${order._taken}`), true);
    await set(ref(db, `PendingMealOrders/Orders/${OID}/${order._taken}`), true);
    return true;
  }

  /**
   * To be used in menu based distribution tab
   * Calculate total order count with specified type
   * @param type, represent order type which will be calculated 
   * @param totalType, holds total order count 
   */
  public async calculateTotalOrder(type:string, totalType: number){
    const db = getDatabase();
    let type90,type78,type51;

    if(type == "normal"){
      type90 = (await get(ref(db, `PendingMealOrders/Regional/Counter90/Normal90`))).val();
      type78 = (await get(ref(db, `PendingMealOrders/Regional/Counter78/Normal78`))).val();
      type51 = (await get(ref(db, `PendingMealOrders/Regional/Counter51/Normal51`))).val();
    }

    else if(type == "vegeterian"){
      type90 = (await get(ref(db, `PendingMealOrders/Regional/Counter90/Vegetarian90`))).val();
      type78 = (await get(ref(db, `PendingMealOrders/Regional/Counter78/Vegetarian78`))).val();
      type51 = (await get(ref(db, `PendingMealOrders/Regional/Counter51/Vegetarian51`))).val();
    }

    else if(type == "vegan"){
      type90 = (await get(ref(db, `PendingMealOrders/Regional/Counter90/Normal90`))).val();
      type78 = (await get(ref(db, `PendingMealOrders/Regional/Counter78/Normal78`))).val();
      type51 = (await get(ref(db, `PendingMealOrders/Regional/Counter51/Normal51`))).val();
    }

    else{
      type90 = (await get(ref(db, `PendingMealOrders/Regional/Counter90/Total90`))).val();
      type78 = (await get(ref(db, `PendingMealOrders/Regional/Counter78/Total78`))).val();
      type51 = (await get(ref(db, `PendingMealOrders/Regional/Counter51/Total51`))).val();
    }
    totalType = type51 + type78 + type90;
  }

  /**
   * To get specific order with takerID
   * @param takerID 
   * @param meal 
   */
  public async searchOrder(takerID:number,meal:Meal){
    const db = getDatabase();
    meal = (await get(ref(db, `Users/${takerID}/Orders/Meal/`))).val();
  }
}