const fs = require('fs');
const regex = require('./regex.js');

/**
 *  @class A Custom Markdown Reader.
 *  @author vinicius-a-portela
 *  @version 0.1.0
 *  Reads and Render the MD files of Wiki Pages, also reads the additional stuff 
 *  that isn't in default markdown language
 * 
 *  This class Transform everything in a readable array for the PageRender React Component
 */
class MDReader {

  /**
   * A Custom Markdown Reader
   * @constructor
   */
  constructor(){
    //The final Result
    this.result = {};

    //The Arrays and Vars needed for the Reading Process
    this.body = [];
    this.content = [];
    this.openTag = [];
    this.lastIndex = 0;

    //The Readed File
    this.file = '';
  }
  

  /**
   *  Transform the Readed File in an Array
   *  @param {string} file - The MD String File
   */
  toArray(file){
    //Erase the Array
    this.result = {};

    //Read Configs and Body
    file = this.getConfigs(file);
    this.getBody(file);

    this.result['data'] = [];

    /* DEBUG */
    console.log('Result Array: ');
    console.log(this.result);
    /* DEBUG */
  }


  /**
   * Get all MD Configurations
   * @param {string} file - The MD String File
   * @return {string} - The new File (Without Configurations)
   */
  getConfigs(file){
    do{
      var res = regex.config.exec(file);
      if(res) this.result[res[1]] = res[2];
    }while(res);
    let newFile = file.replace(regex.config, '');

    return newFile;
  }


  /**
   * Get all Body Content from MD
   * @param {string} file - The MD String File
   */
  getBody(file){
    //Get Page Titles
    file = this.getFromType('title', file);
    
    //Get all Page Content
    file = this.getFromType('content', file);

    //Get all File Tags
    this.getFromType('tag', file);
  }


  /**
   * Get all Matched Content of a Specific Type
   * @param {string} type 
   * @param {string} file 
   * @return The String Without the Selected Type
   */
  getFromType(type, file){
    if(type === 'title'){
      //Get titles
    }else{
      //Other Types
    }

    let newFile = '';
    return newFile;
  }


  /**
   * Reads a Given File and Convert it to JSON
   * @param {string} file
   */
  read(file){
    //Get the File
    this.file = fs.readFileSync(file, 'utf-8');
    
    //Convert in Array
    this.toArray(this.file);
  }

}

/* TESTING AREA */
const reader = new MDReader;
reader.read(process.argv[2]);
/* TESTING AREA */

module.exports = MDReader;