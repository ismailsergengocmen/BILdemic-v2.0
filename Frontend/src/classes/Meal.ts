import { TouchSwipe } from "quasar";
import Order from "./Order";
import User from "./User";


export enum MealType{
    NORMAL,
    VEGETARIAN,
    VEGAN
}

export default class Meal extends Order{
    
    // Properties
    private _type: string;
    private _taken: boolean;
    private _mealType: MealType;
    
    // Constructors
    public constructor(place:string,  date:string, time:string, ownerUID:string, type:string){
        super(place, date, time, ownerUID, "Meal");
        
        if(type == "normal"){
            this._mealType = MealType.NORMAL;
        }
        else if(type == "HealthForm"){
            this._mealType = MealType.VEGETARIAN;
        }
        else if(type == "Meal"){
            this._mealType = MealType.VEGAN;
        }
    }

    // Methods

    public get OID(): string {
        return this.OID;
    }

    public set OID(OID: string) {
        this.OID = OID;
    }

    public get type(): string {
        return this._type;
    }

    public set type(type: string) {
        this._type = type;
    }

    public get taken(): boolean {
        return this._taken;
    }

    public set taken(type: boolean) {
        this._taken = type;
    }

    public get mealType(): MealType {
        return this._mealType;
    }

    public set mealType(mealtype: MealType) {
        this._mealType = mealtype;
    }
}

