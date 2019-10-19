import reader from '../MDReader/MDReader';
const fs = require('fs');

/**
 * @class Article
 * Manipulate article info, directory, etc
 */
class Article {
    cmd = {
        verbose: true,
    }

    /**
     * Get all versions available of a article
     * @param {String} folder - Path to Folder 
     * @return {Array} - List of Versions
     */
    getVersions(folder){
        let res = [];

        let versions = fs.readdirSync(folder);
        versions.forEach((version)=>{
            res.push(version);
        });
        
        return res;
    }

    /**
     * Get all languages of a specific article version
     * @param {String} folder - Path to Folder
     * @return {Array} - List of Languages
     */
    getLangs(folder){
        let res = [];

        let langs = fs.readdirSync(folder);
        langs.forEach((lang)=>{
            let curLang = /(?:[.])(.*?)(?:[.])/gm.exec(lang);
            res.push(curLang[1]);
        });
        
        return res;
    }

    /**
     * Get all articles inside a folder
     * @return Array with all Articles
     */
    getArticles(folder){
        const { verbose } = this.cmd;
        if(verbose) console.log(`[V] Getting Articles of folder '${folder}'`);
        
        let res = [];

        let articles = fs.readdirSync(folder);
        if(verbose) console.log(`[V] Found ${articles.length} Articles`);

        //For each Folder
        articles.forEach((article, article_index) => {
            res.push({article, versions: []});

            //Look for Versions inside Article
            let versions = fs.readdirSync(folder+article+'/');
            if(verbose) console.log(`[V] Found ${versions.length} Versions inside ${article}`);

            versions.forEach((version, version_index) => {
                res[article_index].versions.push({version, langs: []});

                //Look for Languages inside Version
                let langs = fs.readdirSync(folder+article+'/'+version+'/');
                if(verbose) console.log(`[V] Found ${versions.length} languages inside ${version}`);

                //Separe Languages
                langs.forEach(lang => {
                    let curLang = /(?:[.])(.*?)(?:[.])/gm.exec(lang);

                    //res[article_index].versions[version_index].langs.push(curLang[1]);
                    let title = reader.config(folder+article+'/'+version+'/'+lang, 'title');
                    let desc = reader.config(folder+article+'/'+version+'/'+lang, 'desc');
                    console.log(title, desc);
                    res[article_index].versions[version_index].langs.push({abr:curLang[1],title, desc});
                });
            });
        });

        console.log(JSON.stringify(res));
        return(res);
    }
}

module.exports = new Article;