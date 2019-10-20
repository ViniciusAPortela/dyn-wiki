/**
 * A simple function for copying strings to clipboard
 * @param {String} text - The text to copy to clipboard
 */
export default function copyToClip(text) {
  let textEl = document.createElement("textarea");
  textEl.value = text;
  document.body.appendChild(textEl);
  textEl.select();

  try{
    document.execCommand('copy');
    console.log('copied to clipboard');
  }catch(e){console.error(e)}

  document.body.removeChild(textEl);
}