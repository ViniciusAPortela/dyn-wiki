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

    //The information before insert into final result, items here needs reordering
    this.preData = []

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
    
    this.result['data'] = [];
    this.getBody(file);

    /* DEBUG */
    //console.log('Result Array: ');
    //console.log(this.result);
    /* DEBUG */
  }


  /**
   * Get all MD Configurations
   * @param {string} file - The MD String File
   * @return {string} - The new File (Without Configurations)
   */
  getConfigs(file){
    let res;
    do{
      res = regex.config.exec(file);
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

    //Get all Title
    let title = this.getByType('title', file);
    if(title.has){
      //Add data to array
      this.result.data = this.result.data.concat(title.data);
    }
    file = title.file;

    //Get all CMD
    let cmd = this.getByType('cmd', file);
    if(cmd.has){
      //Add data to array
      this.result.data = this.result.data.concat(cmd.data);
    }
    file = cmd.file;

    //Get all Image (LATER)
    //let image = this.getByType('image', file);

    //Get all content (All the rest)
    let content = this.getByType('content', file);
    if(content.has){
      //Add data to array
      this.result.data = this.result.data.concat(content.data);
    }
  }

  /**
   * Get the the Specified Type and Return it
   * @param {string} type 
   * @param {string} file 
   * @return 
   *  [0] If has the Specified Type
   *  [1] The New File 
   *  [2] The Data to insert into preResult
   */
  getByType(type, file){
    let res = {
      has: false,
      file: file,
      data: []
    }

    if(type === 'title'){
      do{
        var response = regex.title.exec(file);
        if(response) {
          //Has this Type in the MD File
          res.has = true;
          res.data.push({tag: 'title', data: response[1], index: response.index});
        }
      }while(response);

      //Return the new file
      res.file = file.replace(regex.title, '');
    }

    else if(type === 'cmd'){
      let response = '';

      let regT = regex.tag[0]+'cmd'+regex.tag[1]+'cmd'+regex.tag[2];
      let re = new RegExp(regT, 'gm');

      while(response = re.exec(file)){
        res.data.push({tag: 'command', sudo: true, data: response[3], index: response.index})
        res.has = true;
      }

      //Return the new file
      res.file = file.replace(re, '');
    }

    else if(type === 'content'){
      let response = '';

      while(response = regex.content.exec(file)){
        res.data.push({tag: 'content', data: response[1], index: response.index})
        res.has = true;
      }
    }

    return res;
  }

  /**
   *  Order all elements by Index
   */
  orderByIndex(){
    //Look for the higher, then start looking from 0 index to higher
    //Look for the lower index
  }

  /**
   * Export the Object to Data.js to be read by the PageRender
   * @param {Object} array - The Array of Objects 
   */
  toFile(array){
    let content = `export default ` + JSON.stringify(array);
    fs.writeFileSync('Data.js', content);
  }

  /**
   * Converts a Given File to Readable Data for PageRender
   * @param {string} file
   */
  convert(file){
    //Get the File
    console.log(`🌀 MDReader v0.1.0 🌀`);
    console.log(`⏳ Reading ${file} ...`);
    this.file = fs.readFileSync(file, 'utf-8');
    
    //Convert in Array
    console.log(`⏳ Converting to Array ...`);
    this.toArray(this.file);

    //Create Data.js File
    console.log(`⏳ Generating Data.js ...`);
    this.toFile(this.result);

    console.log(`✔ All done! 😃`);
  }

}

/* TESTING AREA */
const reader = new MDReader;
reader.convert(process.argv[2]);
/* TESTING AREA */

module.exports = MDReader;