const fs = require('fs');
const regex = require('./regex');

//TODO: Identify Content from different languages

/**
 *  @class A Custom Markdown Reader.
 *  @author vinicius-portela
 *  @version 0.2.0
 *  
 *  Reads and Render the MD files of Wiki Pages, also reads the additional stuff 
 *  that isn't in default markdown language
 * 
 *  This class Manipulates, Translates and Work around Articles in Markdown
 */
class MDReader {

  /**
   * Defaut command mode
   * @returns the default command mode
   */
  static defaultCmd(){
    return {
      verbose: false,
      silent: true,
    }
  }

  /**
   * Converts a Given File to Readable Data for PageRender
   * @param {string} filename - The Markdown File to Read
   * @param {Object} args - The User configuration
   * @returns - An Object With all Content
   */
  static convert(filename, args=this.defaultCmd()){
    //To meansure Process Time
    let start = process.hrtime();

    //Get console Args
    const { silent } = args;

    //Get the File
    let file = fs.readFileSync(filename, 'utf-8');
    if(!silent) console.log(`🌀 MDReader v0.1.0 🌀`);
    if(!silent) console.log(`⏳ Reading ${file} ...`);

    //Convert in Array
    if(!silent) console.log(`⏳ Converting to Array ...`);
    let result = this.toArray(file);

    //To meansure Process Time
    let end = process.hrtime(start);
    if(!silent) console.log(`🕓 All work done in ${end[1]/1000000}ms`);
    if(!silent) console.log(`✔  All done! 😃`);

    //Return the Result Array
    return(result);
  }

  /**
   * Get a Certain Config from MD File
   * @param {String} filename - The name of file to Read
   * @param {String} config - The Configuration Name to Get from MD File
   * @param {Array} args - The CMD Args (verbose, silent ...)
   * @return - The Value of Choosed Config (If has)
   */
  static config(filename, config, args=this.defaultCmd()){
    let file = fs.readFileSync(filename, 'utf-8');

    let res = '';
    regex.config.lastIndex = 0;
    while(res = regex.config.exec(file)){
      if(res[1] === config) return res[2];
    }
    return false;
  }

  /**
   * @deprecated
   * Export the Object to Data.js to be read by the PageRender
   * @param {String} path - Path to were output the file
   * @param {Object} array - The Array of Objects 
   */
  static toFile(array){
    /* FOR DEBUG */
    array.langs = ['pt']
    array.versions = ['1']
    /* FOR DEBUG */

    let content = `module.exports = ` + JSON.stringify(array);
    fs.writeFileSync('services/MDReader/data.js', content);
  }

  /**
   *  Transform the Readed File in an Array
   *  @param {string} file - The MD String File
   *  @returns The Result Array
   */
  static toArray(file){
    //Create final array
    let result = {}

    //Read Configs and Body
    const configsRes = this.getConfigs(file);
    result = Object.assign(result, configsRes.configs)
    file = configsRes.file;

    //Convert all data in a PreFinal Array
    result.data = [];
    result.data  = this.getBody(file);

    //Order in Correct Way
    result.data = this.orderByIndex(result.data);

    return result;
  }

  //TODO: Transform getConfigs and getConfig into one unique function
  /**
   * Get all Configurations from a MD File
   * @param {string} file - The MD String File
   * @return {Object} - Array of Configurations and File without Configs
   */
  static getConfigs(file){
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
  static getBody(file){
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

      //Get all ArticleImages
      let articleImage = this.getByType('articleImage', file);
      if(articleImage.has){
        //Add data to array
        data = data.concat(articleImage.data);
      }
      file = articleImage.file;

      //Get all content (All the rest)
      let content = this.getByType('content', file);
      if(content.has){
        //Add data to array
        data = data.concat(content.data);
      }

      //Add this Scope to Response
      res.push({ scope: element.scope, data, index: element.index});
    });

    return res;
  }

  /**
   * Get Scopes from a file
   * @param {String} file - The MD in String Format 
   * @returns the scopes of file in `Array` format
   * @internal
   */
  static getScopes(file){
    //The Response
    let res = [];

    //Look for Compatibility Scopes (only32, only64)
    //Get Tag configurations from tags.config.js
    const tagsConf = require('../../tags.config');

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
        /*file = 
            file.substr(0, response.index) + 
            `\u0000`.repeat(re.lastIndex-response.index) + 
            file.substr(response.index + `\u0000`.repeat(re.lastIndex-response.index).length);*/
        file = this.createSpace(response.index, re.lastIndex, file);
      }
    })

    //Get all rest (Root Scope (Any Platform))
    res.push({scope: 'root', data: file});

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
  static getByType(type, file){
    let res = {
      has: false,
      file: file,
      data: []
    }

    //TODO: Identifies sub-titles too
    if(type === 'title'){
      do{
        var response = regex.title.exec(file);
        if(response) {
          //Has this Type in the MD File
          res.has = true;
          res.data.push({tag: 'title', data: response[1], index: response.index});

          //Delete this from file, but mantain same space (for indexes later)
          //TODO: maybe find another way to do that
          /*file = 
            file.substr(0, response.index) + 
            `\u0000`.repeat(regex.title.lastIndex-response.index) + 
            file.substr(response.index + `\u0000`.repeat(regex.title.lastIndex-response.index).length);*/
          file = this.createSpace(response.index, regex.title.lastIndex, file);
          //console.log(file.length, 'FILE: \n' ,file);
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
        //Get inside attributes and add it
        let attr;
        let attrs = {};
        regex.tag.attribute.lastIndex = 0;
        while(attr = regex.tag.attribute.exec(response[0])){
          attrs[attr[1]] = attr[2];
        }

        res.data.push({tag: 'command', data: response[3], index: response.index, ...attrs})
        res.has = true;

        /*file = 
          file.substr(0, response.index) + 
          `\u0000`.repeat(re.lastIndex-response.index) + 
          file.substr(response.index + `\u0000`.repeat(re.lastIndex-response.index).length);*/
        file = this.createSpace(response.index, re.lastIndex, file);
      }

      //Return the new file
      res.file = file;
    }

    else if(type === 'image'){
      let response = '';

      //Get all Images
      while(response = regex.tag.img.exec(file)){
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

        /*file = 
          file.substr(0, response.index) + 
          `\u0000`.repeat(regex.tag.img.lastIndex-response.index) + 
          file.substr(response.index + `\u0000`.repeat(regex.tag.img.lastIndex-response.index).length);*/
        file = this.createSpace(response.index, regex.tag.img.lastIndex, file);
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
        //Get inside attributes and add it
        let attr;
        let attrs = {};

        let attributes = regex.tag.scriptsAttribute.exec(response[0]);

        if(attributes){
          regex.tag.attribute.lastIndex = 0;
          while(attr = regex.tag.attribute.exec(attributes[1])){
            attrs[attr[1]] = attr[2];
          }
        }

        //First, get all inside files to put in data array
        let files = this.getByType('file', response[3]);
        if(files.has){
          //Add data to array
          res.data.push({tag: 'scripts', data: files.data, index: response.index, ...attrs})
          res.has = true;
        }

        /*file = 
          file.substr(0, response.index) + 
          `\u0000`.repeat(re.lastIndex-response.index) + 
          file.substr(response.index + `\u0000`.repeat(re.lastIndex-response.index).length);*/
        file = this.createSpace(response.index, re.lastIndex, file);
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
   *  @param {Array} data - Processed Components Unordained
   *  @internal
   */
  static orderByIndex(data){
    //The Response
    let res = []

    //First Organizate Index for Root group
    let root = data.filter(item => { 
      if(item.scope === 'root') return true; 
    })[0]

    //Look for the higher, then start looking from 0 index to higher
    let higher = -1;
    let length = root.data.length;

    //Look for higher
    for(let i=0 ; i<length ; i++){
      if(root.data[i].index > higher) higher = root.data[i].index;
    }

    //For each Item
    for(let i=0 ; i<length ; i++){
      let lower = higher+1;
      let lowerItem = {};
      let lowerIndex = 0;

      //Look for lower
      root.data.map((item, index) => {
        if(item.index < lower) {
          lower = item.index
          lowerItem = item;
          lowerIndex = index;
        }
      })

      //Add to Result Array, Also Remove from root.data Array
      res.push(lowerItem);
      root.data.splice(lowerIndex, 1);
    }

    //Organizate others Contents
    let others = data.filter(item => {
      if(item.scope !== 'root') return true
    })

    //Used before order in final Array
    let othersRes = []

    //For each Tag
    others.map(item => {
      let res = []

      //Get higher inside Tag (Not global position)
      let higher = this.getHigher(item.data)
      let data = item.data

      for(let i=0 ; i<item.data.length ; i++){
        let { lower, lowerIndex } = this.getLower(data, higher)

        res.push(item.data[lowerIndex])
        data.splice(lowerIndex, 1)
      }

      othersRes.push({scope: item.scope, data: res, index: item.index})
    })

    //Then, put others groups inside the root in correct order
    othersRes.map(item =>{
      let index = item.index
      let lastIndex = -1

      //Look for each until reach higher
      for(let i=0 ; i<res.length ; i++){
        if(index>res[i].index) {
          lastIndex = i
        }else break;
      }
      //Add after lastIndex
      res.splice(lastIndex+1, 0, item)
    })

    return res
  }

  /**
   * Get higher from a Object with Index Key
   * @param {Object} obj - Object with Index Key
   * @returns The higher value from an given Object (by Index Key)
   * @internal
   */
  static getHigher(obj){
    let higher = -1;

    obj.map(item => {
      if(item.index > higher) higher = item.index
    })

    return higher;
  }

  /**
   * Get lower from a Object with Index Key
   * @param {Object} obj - Object with Index Key
   * @param {Number} higher - Higher Index from given Object ( Can get with getHigher(obj) )
   * @returns The lower value from an given Object (by Index Key)
   * @internal
   */
  static getLower(obj, higher){
    let res = {
      lower: higher+1,
      lowerIndex: 0,
    }
    
    obj.map((item, index) => {
      if(item.index < res.lower) {
        res.lower = item.index
        res.lowerIndex = index
      }
    })

    return res;
  }

  /**
   * A function 
   * @param {Number} start - Index of Start
   * @param {Number} end - Index of End
   * @param {String} file - The file to put Space
   * @returns The file with White Space
   * @internal
   */
  static createSpace(start, end, file){
    let length = end - start;

    return file.substr(0, start) +
          `\u0000`.repeat(length) + 
          file.substr(start + `\u0000`.repeat(length).length);
  }

}

//TODO: Check relative path to module

/* TESTING AREA */
//const filepath = 'services/MDReader/article.example.md';
//MDReader.toFile(MDReader.toArray(fs.readFileSync(filepath, 'utf-8')));
/* TESTING AREA */

module.exports = MDReader;