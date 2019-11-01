const fs = require('fs');
const regex = require('./regex');

//TODO: Identify Content from different languages
//TODO: Delete all 'file' param, or unecessary Params
//TODO: Verify function names and usage

/**
 *  @class A Custom Markdown Reader.
 *  @author vinicius-portela
 *  @version 0.2.0.alpha_1
 *  
 *  Reads and Render the MD files of Wiki Pages, also reads the additional stuff 
 *  that isn't in default markdown language
 * 
 *  This class Manipulates, Translates and Work around Articles in Markdown
 */
class MDReader {

  //The final Result
  result = {}

  //The information before insert into final result, items here needs reordering
  preData = []

  //TODO: Delete this and references
  //The User Configuration
  //userConfig = {}

  //CLI Modes
  cmd = {
    verbose: false,
    silent: true,
  }

  /**
   *  Transform the Readed File in an Array
   *  @param {string} file - The MD String File
   *  @returns The Result Array
   */
  toArray(file){
    //Erase the Array
    let result = {}

    //First Erase all Content that is not Compatible with UserConfig
    //file = this.justUserConfig(file);

    //Read Configs and Body
    const configsRes = this.getConfigs(file);
    result = Object.assign(result, configsRes.configs)
    file = configsRes.file;

    //Convert all data in a PreFinal Array
    result.data = [];
    result.data  = this.getBody(file);

    //Order in Correct Way
    //result.data = this.orderByIndex(result.data);

    return result;
  }

  //TODO: Remove this Function
  /**
   * Get just UserConfig
   * @param {string} file - The Markdown File
   * @deprecated
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

  //TODO: Transform getConfigs and getConfig into one unique function
  /**
   * Get all Configurations from a MD File
   * @param {string} file - The MD String File
   * @return {Object} - Array of Configurations and File without Configs
   */
  getConfigs(file){
    let re;
    let res = {
      configs: {}, 
      file: ''
    };

    //Get Configs by regex
    regex.config.lastIndex = 0;
    do{
      re = regex.config.exec(file);
      //re[1] = key ; re[2] = value
      if(re) res.configs[re[1]] = re[2];
    }while(re);

    //Return the file without configs
    res.file = file.replace(regex.config, '');

    return res;
  }


  /**
   * Get all Body Content from MD
   * @param {string} file - The MD String File
   * @returns The data from given MD file, in `Array`
   * @internal
   */
  getBody(file){
    //Response
    let res = []

    //First get Objects Scopes
    //So one Content Can be Inside Root or Inside one Compatibility Tag
    //Scopes are used for Articles Class to Get Correct Data by the User Configuration
    
    //This will result in something like that:
    // [{scope: only32, data: string}, {scope: only64, data: string}, {scope: root, data: string}]
    const scopes = this.getScopes(file)

    //Get Content from Scopes
    scopes.forEach(element => {
      //Add this Scope to Response
      let data = [];

      //Get file from Current Scope
      let file = element.data

      //Get all Title
      let title = this.getByType('title', file);
      if(title.has){
        //Add data to array
        data = data.concat(title.data);
      }
      file = title.file;

      //Get all CMD
      let cmd = this.getByType('cmd', file);
      if(cmd.has){
        //Add data to array
        data = data.concat(cmd.data);
      }
      file = cmd.file;

      //Get Scripts
      let scripts = this.getByType('scripts', file);
      if(scripts.has){
        //Add data to array
        data = data.concat(scripts.data);
      }
      file = scripts.file;

      //Get all Image
      let image = this.getByType('image', file);
      if(image.has){
        //Add data to array
        data = data.concat(image.data);
      }
      file = image.file;

      //Get all content (All the rest)
      let content = this.getByType('content', file);
      if(content.has){
        //Add data to array
        data = data.concat(content.data);
      }

      //Add this Scope to Response
      res.push({ scope: element.scope, data});
    });

    return res;
  }

  /**
   * Get Scopes from a file
   * @param {String} file - The MD in String Format 
   * @returns the scopes of file in `Array` format
   * @internal
   */
  getScopes(file){
    //The Response
    let res = []

    //Look for Compatibility Scopes (only32, only64)
    //Get Tag configurations from tags.config.js
    const tagsConf = require('./tags.config');

    //Look for each tag configured in tagsConf
    Object.keys(tagsConf).map((prop)=>{
      //Look for this prop inside file (with Regex)
      let pattern = regex.tag[0] + prop + regex.tag[1] + prop + regex.tag[2];
      let re = new RegExp(pattern, 'gm');
      let response;

      //Get all Tags with this prop
      while(response = re.exec(file)){
        res.push({scope: response[1], data: response[3], index: response.index})
        //Transform Current Scope in Blank
        file = 
            file.substr(0, response.index) + 
            `\u0000`.repeat(re.lastIndex-response.index) + 
            file.substr(response.index + `\u0000`.repeat(re.lastIndex-response.index).length);
      }
    })

    //Get all rest (Root Scope (Any Platform))
    res.push({scope: 'root', data: file})

    return res;
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
  orderByIndex(data){
    let res = []
    
    /* FOR DEBUG */
    //console.log('NEW: ', data);

    //Look for the higher, then start looking from 0 index to higher
    let higher = -1;
    
    data.map((item)=>{
      if(item.index > higher) higher = item.index;
    })

    /* FOR DEBUG */
    //console.log(`higher: ${higher}`);
    /* FOR DEBUG */

    //Look for the lower index
    var length = data.length;

    for(let i=0 ; i<length ; i++){
      /* FOR DEBUG */
      //console.log('--------------------');
      //console.log('PEGANDO '+i+' VALOR!');
      //console.log('AINDA FALTA: '+this.preData.length);
      /* FOR DEBUG */

      let lower = higher+1;
      var itemIndex = -1;

      //Looks for the Lower in the Array
      data.map((item, index)=>{
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

      res.push(data[itemIndex]);
      data.splice(itemIndex, 1);
    };

    return res;
  }

  /**
   * @deprecated
   * Export the Object to Data.js to be read by the PageRender
   * @param {String} path - Path to were output the file
   * @param {Object} array - The Array of Objects 
   */
  toFile(array){
    /* FOR DEBUG */
    array.langs = ['pt']
    array.versions = ['1']
    /* FOR DEBUG */

    let content = `module.exports = ` + JSON.stringify(array);
    fs.writeFileSync('data.js', content);
  }

  /**
   * Get all conditional tags from a given article
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
   * Part of Complex Way
   * Check Equal parts to merge for Cache System
   */
  mergeTags(){

  }

  /**
   * Get all possible Variations from Article based on given Tags
   * @param {Array} tags - Tags from Article
   */
  possibleVariations(tags){
    //Simple way, get all tags and mix
    //Complex way, read tags configuration and see merging configurations
    //Two PCs with differents but same effect to some tag
    let res = []

    // ...
  }

  /**
   * Make Recursive Reading
   * @param {Array} tags - Tags
   */
  forEachTag(tags){
    const len = tags.length()

    // ...
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
    //this.userConfig = config;
    
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
const filepath = 'services/MDReader/article.example.md';
reader.toFile(reader.toArray(fs.readFileSync(filepath, 'utf-8')));
/* TESTING AREA */

module.exports = new MDReader;