/**
 * @typedef {Object} Element
 * @property {string} name
 * @property {number} number
 * @property {string} symbol
 */

/** @type {Element[]} */
const elements = await loadPeriodicTable();

/** @type {Map<string, Element>} */
const elementMap = populateElementMap();

/** @type {() => Promise<Element[]>} */
async function loadPeriodicTable() {
  return await (await fetch('periodic-table.json')).json();
}

/** @type {() => Map<string, Element>} */
function populateElementMap() {
  const elementMap = new Map();

  for (const element of elements) {
    elementMap.set(element.symbol.toLowerCase(), element);
  }

  return elementMap;
}

/** @type {(index: number, word: string, path: string[]) => string[] | null} */
function findSymbols(index, word, path) {
  // Base case: index is out of bounds
  if (index >= word.length) {
    return [...path];
  }

  const currLetter = word[index];
  const hasCurrLetter = elementMap.has(currLetter);
  const letterPair = index < word.length - 1
    ? currLetter + word[index + 1]
    : null;
  const hasLetterPair = letterPair !== null && elementMap.has(letterPair);

  // Exit as no current matches found
  if (!hasCurrLetter && !hasLetterPair) {
    return null;
  }

  /** @type {string[] | null} */
  let singleRes = null;

  /** @type {string[] | null} */
  let pairRes = null;

  if (hasCurrLetter) {
    path.push(currLetter);
    singleRes = findSymbols(index + 1, word, path);
    path.pop();
  }

  if (hasLetterPair) {
    path.push(letterPair);
    pairRes = findSymbols(index + 2, word, path);
    path.pop();
  }

  return singleRes || pairRes;
}

/** @type {(inputWord: string) => string[]} */
function check(inputWord) {
  const result = findSymbols(0, inputWord, []);
  return result !== null ? result : [];
}

/** @type {(elementSymbol: string) => Element} */
function lookup(elementSymbol) {
  return elementMap.get(elementSymbol);
}

export default {
  check,
  lookup,
};
