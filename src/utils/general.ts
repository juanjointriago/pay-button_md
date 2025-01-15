/*************  ✨ Codeium Command ⭐  *************/
/**
 * This method is like `difference` except that it accepts `iteratee` which is
 * invoked for each element of `arr1` and `arr2` to generate the criterion by
 * which they're compared. The order of result values is determined by the order
 * they occur in the array. The iteratee is invoked with one argument: (value).
 *
 * @param {Array} arr1 The array to inspect.
 * @param {Array} arr2 The values to exclude.

 * @returns {Array} Returns the new filtered array.
 */
export const differenceBy = (arr1, arr2, iteratee) => {
  if (typeof iteratee === 'string') {
    const prop = iteratee
    iteratee = item => item[prop]
  }
  return arr1.filter(c => !arr2.map(iteratee).includes(iteratee(c)))
}

export function syntaxHighlight(json) {
  if (!json) return ""; //no JSON from response

  json = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      var cls = "number";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "key";
        } else {
          cls = "string";
        }
      } else if (/true|false/.test(match)) {
        cls = "boolean";
      } else if (/null/.test(match)) {
        cls = "null";
      }
      return '<span class="' + cls + '">' + match + "</span>";
    }
  );
}
