/*
    MARKDOWN READER
    Reads and Render the MD files of Wiki Pages, also reads the additional stuff 
    that isn't in default markdown language
*/

export default new class MDReader{

  /*
    Reads the page
  */
  read(page){
    let file = (process.env.PUBLIC_URL + `./pages/${page}/ukuu.png`);
    // ... Code
  }

  /*
    Generate The JSX Structure that will be read by the PageRender
  */
  render(page){
    if(typeof page === undefined) throw `${page} not exists`;

    this.read(page);

    return(null);
  }

}