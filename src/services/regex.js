//REGEX
module.exports = regex = {
  config: /#!(.*):(?: )?(.*)/gm,
  title: /# (.*)/gm,
  lines: /(.+)+/gm,
  tag: {
    open: /a/,
    close: /a/,
    openClose: /a/,
    attribute: /a/,
    content: /a/
  }
}