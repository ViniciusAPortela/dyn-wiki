/**
 * A simple function for copying strings to clipboard
 * @param {String} text - The text to copy to clipboard
 * @param {Function} changeOpen - Change the Open for Snackbar
 */
export default function copyToClip(text, changeOpen) {
  let textEl = document.createElement("textarea");
  textEl.value = text;
  document.body.appendChild(textEl);
  textEl.select();

  try{
    document.execCommand('copy');
    changeOpen(true);
  }catch(e){console.error(e)}

  document.body.removeChild(textEl);
}