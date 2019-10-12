/**
 * MARKDOWN READER
 * Reads and Render the MD files of Wiki Pages, also reads the additional stuff 
 * that isn't in default markdown language
 * 
 * This class Transform everything in a readable array for the PageRender React Component
 */

//Reads the file, static file (For now)
const readline = require('readline')
const fs = require('fs');

class MDReader {

  constructor(){
    //The final Result
    this.result = {};

    //The Array needed for Reading Process
    this.configs = [];
    this.body = [];
    this.content = [];
    this.openTag = [];
  }
  
  /**
   *  Transform Everything in the Final Array
   */
  toArray(){
    //Transform all Configs
    this.configs.map((item)=>{
      this.result[item.name] = item.value
    });

    //Merge all data
    this.result['data'] = [];

    /* DEBUG */
    console.log('Result Array: ');
    console.log(this.result);
    /* DEBUG */
  }

  /**
   * Get the type of the Line
   * @param {*} line 
   */
  getType(line){
    //Check if is a configuration tag
    var configRegex = /#!(.*):(.*)/;

    if(configRegex.test(line)){
      //Get Config and return it
      const res = configRegex.exec(line);
      this.configs.push({name: res[1], value: res[2]});
    }else{
      //Anothers Types
    }
  }

  /**
   * Transformm the Current Line to Non-Final Array
   * @param {*} line 
   */
  transformLine(line){
    this.getType(line);
  }

  inside(){

  }

  hasTag(){

  }

  read(file){
    const data = fs.createReadStream(file);

    const readInterface = readline.createInterface({
      input: data,
      console: false,
    });

    //Read all lines
    readInterface.on('line', (line) => {
      this.transformLine(line);
    }).on('close', (line) => {
      // EOF
      this.toArray();
    });
  }
}

/* TESTING AREA */
const reader = new MDReader;
reader.read('article.md');
/* TESTING AREA */

module.exports = MDReader;