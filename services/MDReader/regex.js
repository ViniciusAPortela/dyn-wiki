/**
 *  REGEX PATTERNS
 *  Used for the MDReader
 */

module.exports = {
  /**
   * Used for Getting Configurations from MD file
   */
  config: /#!(.*):(?: )?(.*)/gm,

  /**
   * Used for Getting Title -> ## Title Here
   * Note this doesn't make difference between ## or ### or ####
   */
  title: /# (.*)/gm,

  /**
   * Get all lines
   * To reading line, one by one
   */
  lines: /(.+)+/gm,

  /**
   * Getting all Content (Last Regex Used)
   * Get everything less 'ghost character' -> null character, \u0000
   */
  content: /([^\n\t \u0000].*)$/gm,

  /**
   * Tag Regex Patterns
   */
  tag: {
    /**
     * Get the name of a tag
     */
    name: /<(?:([^/].*?)\b.*?)>/gm,

    /**
     * Get all openning tags
     */
    open: /<[^/]+?>/gm,

    /**
     * Get all closing tags
     */
    close: /<\/.+?>/gm,

    /**
     * Get the Openning and Closing Tags
     */
    openClose: /<[^/]+?>|<\/.+?>/gm,

    /**
     * Get attributes from a tag
     */
    attribute: /(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/gm,

    /**
     * Get Content from all Tags
     */
    content: /(?:<.*?>)(?:\n*)?(.*)(?:\n*)?(?:<\/.*?>)/,

    /**
     * Get everything from tag (separated in groups)
     * Get open, name, atributtes, content, etc
     */
    all: /(?:(?:(?:<([^\/].*?)\b>)|(?:<(?:(.*?) .*?)>))(?:\n*)?([\s\S]*?)(?:\n*)?(?:<\/(?:\1|\2)>))|(?:<\/(.*?) (.*?)>)/gm,

    /**
     * Get selfClose tags
     * Used, for example, in <img/>
     */
    selfClose: /<\/(?:.*?) (.*?)>/gm,

    /**
     * Used to form other regex patterns
     */
    [0]: '<(?:(',
    [1]: ')|(?:(',
    [2]: ') (?:.*?)))>(?:\\n*)?([\\s\\S]*?)(?:\\n*)?(?:<\/(?:\\1|\\2)>)',

    /**
     * Used to form other regex patterns
     */
    [3]: '<(\/)?(',
    [4]: ')>',
  }
}