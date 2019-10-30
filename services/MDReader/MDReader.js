const fs = require('fs');
const regex = require('./regex');

//TODO: Identify Content from different languages
//TODO: Delete all 'file' param, or unecessary Params
//TODO: Verify function names and usage

/**
 *  @class A Custom Markdown Reader.
 *  @author vinicius-a-portela
 *  @version 0.2.0.alpha_1.unfunctional
 *  
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

    //The User Configuration
    this.userConfig = {}

    //Console Modes
    this.cmd = {
      verbose: false,
      silent: true,
    }
  }

  /**
   *  Transform the Readed File in an Array
   *  @param {string} file - The MD String File
   */
  toArray(file){
    //Erase the Array
    this.result = {};

    //First Erase all Content that is not Compatible with UserConfig
    file = this.justUserConfig(file);

    //Read Configs and Body
    file = this.getConfigs(file);

    //Convert all data in a PreFinal Array
    this.result['data'] = [];
    this.getBody(file);

    //Order in Correct Way
    this.orderByIndex();

    /* DEBUG */
    //console.log('Result Array: ');
    //console.log(this.result);
    /* DEBUG */
  }

  /**
   * Get just UserConfig
   * @param {string} file - The Markdown File
   */
  justUserConfig(file){
    //Get all MD Config Tags
    //Read the tags.config.js
    //Use Content Regex [0][1][2]
    let tags = require('./tags.config');
    for(const prop in tags){
      //First Look for this Tag in Markdown File
      const { verbose } = this.cmd
      if(verbose) console.log(`[V] Looking for ${prop}`);

      let regexT = regex.tag[0] + prop + regex.tag[1] + prop + regex.tag[2];
      let re = new RegExp(regexT, 'gm');

      re.lastIndex = 0;
      let has = re.test(file);
      if(verbose) console.log(`[V] ⤷ Has? ${has}`);
      if(has){
        //Check if is compatible with user
        //Get all inside Configs and Compare One-By-One Inside Array Items
        let ok = false;

        //Get all tag Needed Configuration
        for(const config in tags[prop]){
          ok = false;
          if(verbose) console.log(`[V] Getting [${config}] configuration`);
          //So, transform in for(); to use break;
          let index = 0;
          for(const item in tags[prop][config]){
            if(verbose) console.log(`[V] Possibility ${index}: ${tags[prop][config][item]}`);
            if(this.userConfig[config] === tags[prop][config][item]){
              ok = true;
              if(verbose) console.log(`[V] ✔️ Is Compatible`);
              break;
            }
          };
          
          if(!ok){
            //NOT COMPATIBLE
            //Dont read the rest and delete from file
            if(verbose) console.log(`[V] ❌ Not Compatible`);

            re.lastIndex = 0;
            let response = '';
            while(response = re.exec(file)){
              file = 
                file.substr(0, response.index) + 
                `\u0000`.repeat(re.lastIndex-response.index) + 
                file.substr(response.index + `\u0000`.repeat(re.lastIndex-response.index).length);
            }

            break;
          }else{
            //COMPATIBLE
            //Mantain inside content but exclude tags
            const regexT2 = regex.tag[3] + prop + regex.tag[4];
            let re2 = new RegExp(regexT2, 'gm');
            
            re2.lastIndex = 0;
            let response = '';
            while(response = re2.exec(file)){
              file = 
                file.substr(0, response.index) + 
                `\u0000`.repeat(re2.lastIndex-response.index) + 
                file.substr(response.index + `\u0000`.repeat(re2.lastIndex-response.index).length);
            }
          }
        }
      }
    };

    return file;
  }

  /**
   * Get all MD Configurations
   * @param {string} file - The MD String File
   * @return {string} - The new File (Without Configurations)
   */
  getConfigs(file){
    let res;
    regex.config.lastIndex = 0;
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
      this.preData = this.preData.concat(title.data);
    }
    file = title.file;

    //Get all CMD
    let cmd = this.getByType('cmd', file);
    if(cmd.has){
      //Add data to array
      this.preData = this.preData.concat(cmd.data);
    }
    file = cmd.file;

    //Get Scripts
    let scripts = this.getByType('scripts', file);
    if(scripts.has){
      //Add data to array
      this.preData = this.preData.concat(scripts.data);
    }
    file = scripts.file;

    //Get all Image
    let image = this.getByType('image', file);
    if(image.has){
      //Add data to array
      this.preData = this.preData.concat(image.data);
    }
    file = image.file;

    //Get all content (All the rest)
    let content = this.getByType('content', file);
    if(content.has){
      //Add data to array
      this.preData = this.preData.concat(content.data);
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

          //Delete this from file, but mantain same space (for indexes later)
          //TODO: create a function to do that
          //TODO: maybe find another way to do that
          file = 
            file.substr(0, response.index) + 
            `\u0000`.repeat(regex.title.lastIndex-response.index) + 
            file.substr(response.index + `\u0000`.repeat(regex.title.lastIndex-response.index).length);
        }
      }while(response);

      //Return the new file
      res.file = file;
    }

    else if(type === 'cmd'){
      let response = '';

      let regT = regex.tag[0]+'cmd'+regex.tag[1]+'cmd'+regex.tag[2];
      let re = new RegExp(regT, 'gm');

      while(response = re.exec(file)){
        res.data.push({tag: 'command', sudo: true, data: response[3], index: response.index})
        res.has = true;

        file = 
          file.substr(0, response.index) + 
          `\u0000`.repeat(re.lastIndex-response.index) + 
          file.substr(response.index + `\u0000`.repeat(re.lastIndex-response.index).length);
      }

      //Return the new file
      res.file = file;
    }

    else if(type === 'image'){
      let response = '';

      //Get all Files
      while(response = regex.tag.selfClose.exec(file)){
        res.has = true;
        //Get tag attributes
        let response2 = '';
        let attrs = {tag: 'image', index: response.index}

        //For Each Attribute
        regex.tag.attribute.lastIndex = 0;
        while(response2 = regex.tag.attribute.exec(response[0])){
          attrs[response2[1]] = response2[2];
        }
        //Add file
        res.data.push(attrs);

        file = 
          file.substr(0, response.index) + 
          `\u0000`.repeat(regex.tag.selfClose.lastIndex-response.index) + 
          file.substr(response.index + `\u0000`.repeat(regex.tag.selfClose.lastIndex-response.index).length);
      }

      //Return the new file
      res.file = file;
    }

    //TODO: It repeats, try to convert in just one function
    //TODO: Wrong Name, It's a File Container
    else if(type === 'scripts'){
      let response = '';

      let regT = regex.tag[0]+'scripts'+regex.tag[1]+'scripts'+regex.tag[2];
      let re = new RegExp(regT, 'gm');

      while(response = re.exec(file)){
        //First, get all inside files to put in data array
        let files = this.getByType('file', response[3]);
        if(files.has){
          //Add data to array
          res.data.push({tag: 'scripts', data: files.data, index: response.index})
          res.has = true;
        }

        file = 
          file.substr(0, response.index) + 
          `\u0000`.repeat(re.lastIndex-response.index) + 
          file.substr(response.index + `\u0000`.repeat(re.lastIndex-response.index).length);
      }

      //Return the new file
      res.file = file;
    }

    else if(type === 'file'){
      let response = '';

      //Get all Files
      regex.tag.selfClose.lastIndex = 0;
      while(response = regex.tag.selfClose.exec(file)){
        res.has = true;
        //Get tag attributes
        let response2 = '';
        let attrs = {}

        //For Each Attribute
        regex.tag.attribute.lastIndex = 0;
        while(response2 = regex.tag.attribute.exec(response[0])){
          attrs[response2[1]] = response2[2];
        }
        //Add file
        res.data = res.data.concat(attrs);
      }

      //Return the new file
      res.file = file;
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
    let higher = -1;
    
    this.preData.map((item)=>{
      if(item.index > higher) higher = item.index;
    })

    /* FOR DEBUG */
    //console.log(`higher: ${higher}`);
    /* FOR DEBUG */

    //Look for the lower index
    var length = this.preData.length;

    for(let i=0 ; i<length ; i++){
      /* FOR DEBUG */
      //console.log('--------------------');
      //console.log('PEGANDO '+i+' VALOR!');
      //console.log('AINDA FALTA: '+this.preData.length);
      /* FOR DEBUG */

      let lower = higher+1;
      var itemIndex = -1;

      //Looks for the Lower in the Array
      this.preData.map((item, index)=>{
        if(item.index<lower) {
          /* FOR DEDBUG */
          //console.log(`achado menor: ${item.index} <- ${lower} (na pos ${index})`);
          /* FOR DEDBUG */

          lower = item.index;
          itemIndex = index;
        };
      });

      /* FOR DEBUG */
      //console.log(`SUCESS - ADDED: ${this.preData[itemIndex]}`);
      //this.preData[itemIndex].data = `[${i}][${lower}] `+this.preData[itemIndex].data
      /* FOR DEBUG */

      this.result.data.push(this.preData[itemIndex]);
      this.preData.splice(itemIndex, 1);
    };
  }

  /**
   * @deprecated
   * Export the Object to Data.js to be read by the PageRender
   * @param {Object} array - The Array of Objects 
   */
  toFile(array){
    let content = `module.exports = ` + JSON.stringify(array);
    fs.writeFileSync('data.js', content);
  }

  /**
   * Get all tags from a given article
   * @param {String} file - the file (in string format)
   */
  tags(file){
    regex.tag.name.lastIndex = 0;
    let ret;
    let res = [];
    let tags = require('./tags.config');

    //Search for all tags inside the given file
    while(ret = regex.tag.name.exec(file)){

      //Tag Verification
      //Only Condicional tags are importants
      if(Object.keys(tags).indexOf(ret[1]) !== -1)
        //Check if Already exists
          if(res.indexOf(ret[1]) === -1)
            res.push(ret[1]);
    }

    return res;
  }

  /**
   * Read a file by filename and returns the file in string format
   * @param {String} filepath  - Path to File
   * @retuns File in String
   */
  read(filepath){
    return fs.readFileSync(filepath);
  }
  
  //Just Identify and Erase what is not supported in the user system
  //Then is the Common Process

  /**
   * Converts a Given File to Readable Data for PageRender
   * @param {string} filename - The Markdown File to Read
   * @param {Object} userConfig - The User configuration
   * @returns - An Object With all Content
   */
  convert(filename, userConfig){
    //To meansure Process Time
    let start = process.hrtime();

    //Get console Args and set UserConfig
    this.setEnv(process.argv.length>2 || ['-silent'], userConfig);
    const { verbose, silent } = this.cmd;

    //Get the File
    if(!silent) console.log(`🌀 MDReader v0.1.0 🌀`);
    if(!silent) console.log(`⏳ Reading ${file} ...`);
    let file = fs.readFileSync(filename, 'utf-8');
    
    //Convert in Array
    if(!silent) console.log(`⏳ Converting to Array ...`);
    this.toArray(file);

    //Create Data.js File
    //if(!silent) console.log(`⏳ Generating Data.js ...`);
    //this.toFile(this.result);

    //To meansure Process Time
    let end = process.hrtime(start);
    if(!silent) console.log(`🕓 All work done in ${end[1]/1000000}ms`);
    if(!silent) console.log(`✔  All done! 😃`);

    //Return the Result Array
    return(this.result);
  }

  /**
   * Set the Class Environment
   * Get all CMD args
   */
  setEnv(args=[], config={}){
    this.userConfig = config;
    
    this.cmd.silent = args.includes('-silent');
    this.cmd.verbose = args.includes('-verbose');
  }

  /**
   * Get a Certain Config from MD File
   * @param {String} filename - The name of file to Read
   * @param {String} config - The Configuration Name to Get from MD File
   * @param {Array} args - The CMD Args (verbose, silent ...)
   * @return - The Value of Choosed Config (If has)
   */
  config(filename, config, args=[]){
    this.setEnv(args);
    let file = fs.readFileSync(filename, 'utf-8');

    let res = '';
    regex.config.lastIndex = 0;
    while(res = regex.config.exec(file)){
      if(res[1] === config) return res[2];
    }
    return false;
  }

}

/* TESTING AREA */
const reader = new MDReader;
let file = reader.read('./article.example.md');
console.log(reader.tags(file));
/* TESTING AREA */

module.exports = new MDReader;