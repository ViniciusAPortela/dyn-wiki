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
    this.content = [];
    this.open_tag = [];
  }
  
  //TODO: Create the MD to Array Converter
  /**
   * 
   */
  toArray(){
    //Transform all Configs
    this.configs.map((item)=>{
      this.result[item.name] = item.value
    });

    //Merge all data
    this.result['data'] = {};

    console.log('Result Array: ');
    console.log(this.result);
  }

  /**
   * Get the type of the Line
   * @param {*} line 
   */
  getType(line){
    //Check if is a configuration tag
    var config_tag = line.search('#!');
    if(config_tag !== -1){
      //Return the configuration
      let config = line.substr(config_tag+2);      
      let n = config.search(':');
      
      //Get Config Name
      let conf_name = config.substr(0, n);

      //Get Config Value
      let conf_value = config.substr(n+1);

      return({type: 'config', data: {name: conf_name, value: conf_value}});
    }else{
      //Check if is a opening tag
      return({});
    }
  }

  /**
   * Transformm the Current Line to Non-Final Array
   * @param {*} line 
   */
  transformLine(line){
    let res = this.getType(line);
    //Is a Valid Array Object
    console.log(res.type !== undefined);
    if(res.type !== undefined){
      console.log('addded to configs');
      if(res.type === 'config'){
        //Add to Config Array
        this.configs.push(res.data);
      }else if(res.type === ''){

      }
    //Is Content, Add to Content Array
    }else{

    }
  }

  inside(){
    
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