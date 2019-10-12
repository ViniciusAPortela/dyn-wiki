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
    //Line by Line
    do{
      var res = regex.lines.exec(file);
      if(res) var line = this.getType(res[1]);

      if(line.type === 'title'){
        //Add title
        this.result.data.push({tag: line.type, data: line.data});
      }else if(line.type === 'tag'){
        //Check if has Other Tag inside

      }
    }while(res);
  }


  /**
   * Check and Get the Type of a Line
   * @param {string} line - Line to Read and Identify Content
   */
  getType(line){
    //Check for Title
    regex.title.lastIndex = 0;
    let title = regex.title.exec(line);
    if(title){
      return {type: 'title', data: title[1]};
    }

    //Check for Tag
    regex.tag.openClose.lastIndex = 0;
    let tag = regex.tag.all.exec(line);
    if(tag){
      console.log(tag);
      //match.index + ' ' + patt.lastIndex
      //return {type: 'tag', data: tag[1]};
    }

    return {type: null};
    //Check for Content
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