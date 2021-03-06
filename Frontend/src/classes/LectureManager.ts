import Student from "./Student"
import User from "./User"
import Seat from "./Seat"
import Instructor from "./Instructor";
import Lecture from "./Lecture";
import { getDatabase, ref, push, set, get, query, orderByChild, equalTo, onValue, child } from "firebase/database";
import { getAuth } from "firebase/auth";

export default class LectureManager {

  // Properties
  private static instance: LectureManager | null = null;

  // Constructor
  private constructor() {}

  //Methods
  public static getInstance(): LectureManager {
    if(this.instance == null) {
      this.instance = new LectureManager();
    }
    return this.instance;
  }

  //Create courses with given parameters
  public async createCourse(lectureName: string, section:number, building:string, place: string) {
    const auth = getAuth();
    const Uid = auth.currentUser?.uid;
    const db = getDatabase();

    let instructor = (await get(ref(db, `Users/${Uid}`))).val();

    if(instructor){
      let courseCode = (instructor._name.replace(/ /g, "").substring(0,5) + building + section).toLowerCase();
      let LID = Date.now();

      let row, col, nSID, SID
      let seatColArray = []
      let seatPlan = []
      let counter = 1

      //SeatPlan Creation
      for(row = 0; row < 5; row = row + 1){
        for(col = 0; col < 5; col = col + 1){
          // Creating unique LID
          counter = counter + 1
          nSID = Date.now()
          nSID = nSID + counter
          SID = nSID.toString()
          const seat = new Seat(SID, "", "", "", false, 0, lectureName)
          seatColArray.push(seat) // Seat added to row
        }
        seatPlan.push(seatColArray) // New row added to seatplan
        seatColArray = [] // Array reseted
      } // SeatPlan is now a 5x5 array
      let lecture = new Lecture(instructor._name, lectureName, section, place, courseCode, -1, LID, seatPlan);
      await set(ref(db,`Users/${instructor._Uid}/Lectures/${lecture.LID}`),lecture); // Add lecture to instructor's lecture array
      await set(ref(db,`Lectures/${lecture.LID}`),lecture); // Add lecture to lecture storage
    }
  }

  //Generates random lecture code which shown at start of every lecture
  public async generateLectureCode(LID:number){
    const db = getDatabase();

    let lectureCode = Date.now();
    set(ref(db, `Lectures/${LID}/_lectureCode`), lectureCode);
    this.resetSeatPlanStatus(LID);
  }

  //Gets lecture code of a lecture
  public async getLectureCode(LID:number){
    const db = getDatabase();
    // const reference = ref(db, `Lectures/${LID}/_lectureCode`);

    // let lectureCode: string = "";
    // onValue(reference, (snapshot) => {
    //     const data = snapshot.val();
    //     lectureCode = data;
    // })
    // return lectureCode;

    return get(ref(db, `Lectures/${LID}/_lectureCode`));
  }

  //This function is used to change status of a particular seat from teacher  
  // REVISED: get row and col value from _myseat via input UID. no more SID parameter 
  public async changeSeatStatus(LID: number, AID: number, SID: number, confirm: boolean) {
    const db = getDatabase();

    let attendance = (await get(ref(db,`Lectures/${LID}/Attendances/${AID}`))).val(); // Get attendance object to reach seat plan in it
    let seat = (await get(ref(db,`Lectures/${LID}/Attendances/${AID}/${attendance._particularLectureSeatPlan}/${SID}`))).val(); // Get particular seat
    await set(ref(db,`Lectures/${LID}/SeatPlan/${SID}/${seat._confirm}`), confirm); // Change particular seat's confirm property
  }

  // This function is used to enroll student to a course
  public async enrollStudentToCourse(courseCode: string){
    const auth = getAuth();
    const Uid = auth.currentUser?.uid;
    const db = getDatabase();
    let LID;

    let query1 = query(ref(db, `Lectures`),orderByChild('_courseCode'),equalTo(courseCode));
    onValue(query1, async (snapshot) => {
        const lecture = snapshot.val();

        console.log("lecture = " , lecture);

        let realLecture;

        for(let key of Object.keys(lecture))
        {
          realLecture = lecture[key];
        }

        LID = realLecture._LID;
        console.log("LID = " , realLecture._LID);
        await set(ref(db, `Users/${Uid}/Lectures/${LID}`), realLecture);
        await set(ref(db,`Users/${Uid}/Lectures/${LID}/${realLecture._selected}`), false);
    })
  }



  // This function is used to set seat's first owner
  public async setSeatOwner(LID: number, row: number, col:number){
    const db = getDatabase();
    const UID = getAuth().currentUser?.uid;

    let lecture = (await get(ref(db, `Users/${UID}/Lectures/${LID}`))).val();
    let condition = (await get(ref(db,`Users/${UID}/Lectures/${LID}/_selected`))).val();
    console.log(condition)
    if(!condition){
      // const reference = ref(db, `Lectures/${LID}/_seatPlan`);

      let seatPlan = (await get(ref(db, `Lectures/${LID}/_seatPlan`))).val();

      // onValue(reference, (snapshot) => {
      //     const temp = snapshot.val();
      //     seatPlan = temp;

      // })
      let seat = seatPlan[row][col];
      seat._studentOwnerUID = UID;
      // Seat owner's right and left owner assigned
      if(col == 0){
        seatPlan[row][col+1]._studentLeftUID = UID;
      }
      else if(col == 4){
        seatPlan[row][col-1]._studentRightUID = UID;
      }
      else {
        seatPlan[row][col+1]._studentLeftUID = UID;
        seatPlan[row][col-1]._studentRightUID = UID;
      }
      //Seat updated
      seatPlan[row][col] = seat
      await set(ref(db, `Lectures/${LID}/_seatPlan`), seatPlan);
      await set(ref(db,`Users/${UID}/Lectures/${LID}/_selected`), true);
      await set(ref(db, `Users/${UID}/Lectures/${LID}/_mySeat`), {row: row, col: col});
    }
  }

  // This function get instructor's lectures and returns it in lecture array.
  public async getLectures(UID:number){
    const db = getDatabase();
    // const reference = ref(db, `Users/${UID}/Lectures/`);

    // let lectures: any[] = [];
    // onValue(reference, (snapshot) => {
    //     const data = snapshot.val();
    //     for (const [key, value] of Object.entries(data)) {
    //       lectures.push(value)
    //     }
    // })

    return get(ref(db, `Users/${UID}/Lectures/`));
  }

  public async getLecture(LID:number) {
    const db = getDatabase();
    // const reference = ref(db, `Lectures/${LID}`);

    // let lecture;
    // onValue(reference, (snapshot) => {
    //     const data = snapshot.val();
    //     lecture = data;
    // })
    // return lecture;

    return get(ref(db, `Lectures/${LID}`));
  }

  public async getMySeat(LID:number) {
    const db = getDatabase();
    const UID = getAuth().currentUser?.uid;

    // const reference = ref(db, `Users/${UID}/Lectures/${LID}/_mySeat`);

    // let seatData;
    // onValue(reference, (snapshot) => {
    //     const data = snapshot.val();
    //     seatData = data;
    // })
    // return seatData;

    return get(ref(db, `Users/${UID}/Lectures/${LID}/_mySeat`));
  }

  public getSelectedStatus(LID: string) {
    const db = getDatabase();
    // let reference = ref(db, `Users/${getAuth().currentUser?.uid}/Lectures/${LID}/_selected`)
    // let result;

    // onValue(reference, (snapshot) => {
    //   const data = snapshot.val();
    //   result = data;
    // })
    // return result;

    return get(ref(db, `Users/${getAuth().currentUser?.uid}/Lectures/${LID}/_selected`));
  }

  //Checks lecture code and compares with real lecture code
  public async controlLectureCode(LID:string, lectureCode: string){
    const db = getDatabase();
    // let reference = ref(db, `Lectures/${LID}/_lectureCode`)
    // let result = false;

    // onValue(reference, (snapshot) => {
    //   const realLectureCode = snapshot.val();
    //   if(lectureCode == realLectureCode){
    //     result = true;
    //   }
    // })
    // return result;

    const realLectureCode = (await get(ref(db, `Lectures/${LID}/_lectureCode`))).val();

    return realLectureCode == lectureCode;
  }

  // get seat plan function => parameters: LID Returns seat plan
  public async getSeatPlan(LID:number){
    const db = getDatabase();

    return (await get(ref(db,`Lectures/${LID}/_seatPlan`))).val();
  }

  
  // Update Seat code function => Changes original seat ID(which is now seat code). Parameters (LectureID, UserID). No return
  public async updateSeatCode(LID:number,UID:number){
    const db = getDatabase();
    let name = (await get(ref(db,`Users/${UID}/_name`))).val();
    let namePart = name.substring(0,2);

    let numPart = (Math.floor(Math.random() * 100000) + 10000).toString();
    let newCode = namePart.concat(numPart);

    let col = (await get(ref(db,`Users/${UID}/Lectures/${LID}/_mySeat/col`))).val();
    let row = (await get(ref(db,`Users/${UID}/Lectures/${LID}/_mySeat/row`))).val();

    (await set(ref(db,`Lectures/${LID}/_seatPlan/${row}/${col}/_SID`), newCode));
  }

  // Show seat code function => get myseat row and col value from user UID and LID. do not return anything in definition, use return get(...).
  public async getSeatCode(LID:number, UID:number){
    const db = getDatabase();

    const mySeat = (await get(ref(db,`Users/${UID}/Lectures/${LID}/_mySeat`))).val();

    return (await get(ref(db,`Lectures/${LID}/_seatPlan/${mySeat.row}/${mySeat.col}/_SID`))).val();
  }

  // Reset seat status function => Reset every seat's status to black color 
  // after teacher creates random lecture code.
  public async resetSeatPlanStatus(LID:number){
    const db = getDatabase();

    const seatPlan = (await get(ref(db,`Lectures/${LID}/_seatPlan`))).val();
    const rowCount = Object.keys(seatPlan).length;

    for (let row = 0; row < rowCount; row++) {
      const colCount = Object.keys(seatPlan[row]).length;
      for (let col = 0; col < colCount; col++) {
        (await set(ref(db,`Lectures/${LID}/_seatPlan/${row}/${col}/_color`), 0));
      }
    }
  }

  // Add status property to seat which holds seat owner's status in particular lesson(DONE).
  // Also add neighbour seat statuses as property to seat which reprensents if neighbor code is entered wrong. != This will be used to show tooltip in frontend(DONE).

  //-------------------------------------------------

  // Check neighbour seat code function => parameters: LID, UID, rightcode, leftcode. return 1 if left code is wrong, 2 if right code is wrong, 0 if both true. !!= For frontend popup 
  // to warn user which side if entered wrong
  public async checkNeighbourSeatCode(LID: string, UID: string, rightCode: string, leftCode: string) {
    const db = getDatabase();

    const mySeat = (await get(ref(db,`Users/${UID}/Lectures/${LID}/_mySeat`))).val();
    const seat = (await get(ref(db, `Lectures/${LID}/_seatPlan/${mySeat.row}/${mySeat.col}`))).val();

    const rightSeat = (await get(ref(db,`Users/${seat._studentRightUID}/Lectures/${LID}/_mySeat`))).val();
    const leftSeat = (await get(ref(db,`Users/${seat._studentLeftUID}/Lectures/${LID}/_mySeat`))).val();

    const realRightCode = (await get(ref(db,`Lectures/${LID}/_seatPlan/${rightSeat.col}/${rightSeat.row}/_SID`))).val();
    const realLeftCode = (await get(ref(db,`Lectures/${LID}/_seatPlan/${leftSeat.col}/${leftSeat.row}/_SID`))).val();

    if (realRightCode === rightCode && realLeftCode === leftCode) {
      set(ref(db, `Lectures/${LID}/_seatPlan/${mySeat.row}/${mySeat.col}/_color`), 3);
      set(ref(db, `Lectures/${LID}/_seatPlan/${mySeat.row}/${mySeat.col}/_leftNeighbourStatus`), true);
      set(ref(db, `Lectures/${LID}/_seatPlan/${mySeat.row}/${mySeat.col}/_rightNeighbourStatus`), true);
      return 0;
    }
    else if (realLeftCode !== leftCode && realRightCode === rightCode) {
      set(ref(db, `Lectures/${LID}/_seatPlan/${mySeat.row}/${mySeat.col}/_color`), 4);
      set(ref(db, `Lectures/${LID}/_seatPlan/${mySeat.row}/${mySeat.col}/_leftNeighbourStatus`), false);
      set(ref(db, `Lectures/${LID}/_seatPlan/${mySeat.row}/${mySeat.col}/_rightNeighbourStatus`), true);
      return 1;
    }
    else if (realLeftCode === leftCode && realRightCode !== rightCode) {
      set(ref(db, `Lectures/${LID}/_seatPlan/${mySeat.row}/${mySeat.col}/_color`), 4);
      set(ref(db, `Lectures/${LID}/_seatPlan/${mySeat.row}/${mySeat.col}/_leftNeighbourStatus`), true);
      set(ref(db, `Lectures/${LID}/_seatPlan/${mySeat.row}/${mySeat.col}/_rightNeighbourStatus`), false);
      return 2;
    }
    else {
      set(ref(db, `Lectures/${LID}/_seatPlan/${mySeat.row}/${mySeat.col}/_color`), 4);
      set(ref(db, `Lectures/${LID}/_seatPlan/${mySeat.row}/${mySeat.col}/_leftNeighbourStatus`), false);
      set(ref(db, `Lectures/${LID}/_seatPlan/${mySeat.row}/${mySeat.col}/_rightNeighbourStatus`), false);
      return 3;
    }
  }

  public async changeColor(LID: string, UID: string, color: number) {
    const db = getDatabase();

    const mySeat = (await get(ref(db,`Users/${UID}/Lectures/${LID}/_mySeat`))).val();
    await set(ref(db, `Lectures/${LID}/_seatPlan/${mySeat.row}/${mySeat.col}/_color`), color);
  }

  public async findOwnerUIDBySeat(LID: string, row: string, col: string) {
    const db = getDatabase();

    return (await get(ref(db, `Lectures/${LID}/_seatPlan/${row}/${col}/_studentOwnerUID`))).val();
  }

  // when teacher creates random lecture code, every seat color status will be black (DONE). Then seat current owner's allowence status
  // will be checked and not allowed ones will be colored as red. If student enters correct lecture code, their seat's color status
  // will be grey. After that, when students enter their neighbour student and check, depending on the correct and wrong entrances,
  // color status will be green and yellow.  !! = This propabably cause to double yellow seats in seatplan. 


  // black => 0 X
  // red => 1
  // grey => 2 X
  // green => 3 X
  // yellow => 4 X

}

