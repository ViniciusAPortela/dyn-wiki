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
  read(file){
    const data = fs.createReadStream(file);

    const readInterface = readline.createInterface({
      input: data,
      console: false,
    });

    readInterface.on('line', function(line) {
      console.log(line);
    });
  }

  //TODO: Create the MD to Array Converter
  toArray(){}

}

/* TESTING AREA */
const reader = new MDReader;
reader.read('article.md');
/* TESTING AREA */

module.exports = MDReader;