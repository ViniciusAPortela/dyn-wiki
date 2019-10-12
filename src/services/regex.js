//REGEX
module.exports = regex = {
  config: /#!(.*):(?: )?(.*)/gm,
  tag: {
    open: /a/,
    close: /a/,
    openClose: /a/,
    attribute: /a/,
    content: /a/
  }
}