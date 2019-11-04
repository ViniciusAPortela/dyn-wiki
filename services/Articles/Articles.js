const reader = require('../MDReader/MDReader');
const fs = require('fs');

/**
 * @class Article
 * @author vinicius-portela
 * @version 0.2.0.alpha_1
 * 
 * Manipulate article info, directory, etc
 */
class Article {

    /**
     * Default Command Configurations
     * @returns Default Configuration
     */
    static defaultCmd(){
        return {
            verbose: false,
            // Default Configuration
            // This is my computer current config :) 
            defaultConfig: {
                arch: 'x64',
                os: 'linux',
                os_version: '5.0.0-31-generic',
                dist: 'kde_neon',
                dist_version: '5.16',
                swap: 10843,
                swap_type: 'partition',
            }
        }
    }

    /**
     * Get all versions available of a article
     * @param {String} folder - Path to Folder 
     * @return {Array} - List of Versions
     */
    static getVersions(folder){
        let res = [];

        let versions = fs.readdirSync(folder);
        
        //Remove Images Folder
        if(versions.indexOf('images') !== -1)
            versions.splice(versions.indexOf('images'), 1);

        //Remove Scripts Folder
        if(versions.indexOf('files') !== -1)
            versions.splice(versions.indexOf('files'), 1);

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
    static getLangs(folder){
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
     * @param {String} folder - folder name from get Articles
     * @param {Object} cmd - cmd configuration
     * @return Array with all Articles
     */
    static getArticles(folder, cmd=this.defaultCmd()){
        const { verbose } = cmd;
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

            //Remove Images Folder
            if(versions.indexOf('images') !== -1)
                versions.splice(versions.indexOf('images'), 1);

            //Remove Scripts Folder
            if(versions.indexOf('files') !== -1)
                versions.splice(versions.indexOf('files'), 1);

            versions.forEach((version, version_index) => {
                res[article_index].versions.push({version, langs: []});

                //Look for Languages inside Version
                let langs = fs.readdirSync(folder+article+'/'+version+'/');
                if(verbose) console.log(`[V] Found ${versions.length} languages inside ${version}`);

                //Separe Languages
                langs.forEach(lang => {
                    let curLang = /(?:[.])(.*?)(?:[.])/gm.exec(lang);

                    let title = reader.config(folder+article+'/'+version+'/'+lang, 'title');
                    let desc = reader.config(folder+article+'/'+version+'/'+lang, 'desc');

                    res[article_index].versions[version_index].langs.push({abr:curLang[1],title, desc});
                });
            });
        });

        return(res);
    }

    /**
     * Check if a article is saved in cache
     * @param {String} article - The Article ID
     * @param {String} version - The Article Version
     * @param {String} lang - The Article Language (PT, EN, ES, JP, DE ...)
     * @returns - True/False Result
     */
    static isInCache(article, version, lang){
        const inCache = fs.existsSync(`services/Articles/cache/${article}/${version}/${lang}.json`);

        if(inCache) return true; else return false;
    }

    /**
     * Save a file in cache
     * @param {Object} data - The Result Object with all Data
     */
    static toCache(data){
        //Get Article Metadata
        const { article, version, lang } = data.meta;

        const content = JSON.stringify(data);
        const baseDir = 'services/Articles/cache'

        //Create Dir if doesn't exists
        const hasArticleRoot = fs.existsSync(`${baseDir}`);
        const hasArticle = fs.existsSync(`${baseDir}/${article}`);
        const hasVersion = fs.existsSync(`${baseDir}/${article}/${version}`);
        
        if(!hasArticleRoot) fs.mkdirSync(`${baseDir}`)
        if(!hasArticle) fs.mkdirSync(`${baseDir}/${article}`)
        if(!hasVersion) fs.mkdirSync(`${baseDir}/${article}/${version}`)

        fs.writeFile(`${baseDir}/${article}/${version}/${lang}.json`, content, ()=>{
            console.log('💾 Saved to cache')
        });
    }

    /**
     * Loads a file from cache
     * @param {String} article - The Article ID
     * @param {String} version - The Article Version
     * @param {String} lang - The Article Language (PT, EN, ES, JP, DE ...)
     * @param {Object} config - The User Configuration
     * @returns {Object} Object prepared to PageRender
     */
    static loadFromCache(article, version, lang, config){
        let data = JSON.parse(fs.readFileSync(`./services/Articles/cache/${article}/${version}/${lang}.json`, 'utf-8'));
        
        return this.justUserConfig(data, config)
    }

    /**
     * It's part of process of get(), it's more internal service than get()
     * @param {String} article - The Article ID
     * @param {String} version - The Article Version
     * @param {String} lang - The Article Language (PT, EN, ES, JP, DE ...)
     * @param {Object} config - The user Configuration
     * @returns Object with all data for PageRender
     * @internal
     */
    static convert(article, version, lang, config){
        let file = `articles/${article}/${version}/article.${lang}.md`
        //let userConfig = require('../UserConfig/userConfig.example');

        //First Load File (With MDReader)
        let data = reader.convert(file, config);

        //Add Metadata
        data.meta = {
            article,
            version,
            lang
        }

        //Then Add Article Variations
        data.versions = this.getVersions(`articles/${article}/`);
        data.langs = this.getLangs(`articles/${article}/${version}/`);

        //Finally Add to Cache for Next Searchs
        this.toCache(data);

        return this.justUserConfig(data, config);
    }

    /**
     * Get a specific Article
     * @param {String} article - The Article ID
     * @param {String} version - The Article Version
     * @param {String} lang - The Article Language (PT, EN, ES, JP, DE ...)
     * @param {String} config - The User System Configuration
     * @returns - The Article in JSON
     */
    static get(article, version, lang, config = this.defaultCmd().defaultConfig){
        const hasInCache = this.isInCache(article, version, lang);

        //Check if file already in cache
        if(hasInCache){
            //In cache
            let data = this.loadFromCache(article, version, lang, config);
            console.log('📀 Already in Cache, Loading...');

            return data;
        }else{
            //Not in Cache
            let data = this.convert(article, version, lang, config);

            return data;
        }
    }

    /**
     * Update list of articles
     * Used by the Express Node Server
     */
    static update(){
        console.log('🔄 Updating Article List...');
        let updated_data = this.getArticles('./articles/');
        let updated_content = JSON.stringify(updated_data);
        fs.writeFile('./services/Articles/article-list.js', updated_content, {flag: 'w'}, (err)=>{
        if(err) throw error;
        });
    }

    /**
     * Check if a tag is compatible with user configuration
     * @param {String} tag 
     * @param {Object} tagsConfig 
     */
    static checkCompatibility(tag, tagsConfig, userConfig=this.defaultCmd().defaultConfig){
        //Check if tag exists in tagsConfig
        if(tagsConfig.hasOwnProperty(tag)){
            //For each needed configuration in tagsConfig
            let keys =  Object.keys(tagsConfig[tag])
            
            for(let i=0; i<keys.length ; i++){
                let item = keys[i]
                let user = userConfig[item]
                if (!tagsConfig[tag][item].includes(user))
                    return false
            }

            return true
        }
    }

    /**
     * Convert files that aren't in articles/ file structure
     * @param {Array} arr - Array with all Article Content
     * @param {Object} config - Configuration of User
     */
    static justUserConfig(arr, config=this.defaultCmd().defaultConfig){
        //Get configurations of tags
        const tags = require('../../tags.config')

        let array = arr.data

        //Get all unique scopes from array
        let scopes = []

        array.map(item => {
            if(item.hasOwnProperty('scope'))
                if(scopes.indexOf(item.scope) === -1)
                    scopes.push(item.scope)
        })

        //Check for compatibility
        scopes.forEach(tag => {
            let comp = this.checkCompatibility(tag, tags, config)

            if(comp){
                //Remove from scope and insert

                //Remove from scope
                for(let i=0 ;  i<array.length ; i++){
                    let item = array[i]
                    if(item.hasOwnProperty('scope')){
                        if(item.scope === tag){
                            let content = []
                            item.data.forEach(item => content.push(item))
                            
                            array = array.slice(0, i).concat(content, array.slice(i+1))
                        }
                    }
                }
                
            }else{
                //Just Remove
                array = array.filter(item => {
                    if(!item.hasOwnProperty('scope')){
                        return true
                    }else{
                        if(item.scope !== tag)
                            return true
                    } 
                })
            }
        })

        arr.data = array

        return arr;

        //let content = 'module.exports = ' + JSON.stringify(arr)
        //fs.writeFileSync('./data.js', content)
    }
}

/* FOR DEBUG */
//Article.justUserConfig(require('../MDReader/data'))
/* FOR DEBUG */

module.exports = Article;