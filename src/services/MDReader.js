import { throwError } from "rxjs";

/*
    MARKDOWN READER
    Reads and Render the MD files of Wiki Pages, also reads the additional stuff 
    that isn't in default markdown language
*/

export default class MDReader {

  constructor(){}

  /* 
    Reads the 
  */
  read(){

  }

  /*
    Read all the File and Render
  */
  render(page){
    if(typeof page != undefined) throwError(`${page} not found!`);

    this.read();
  }

}