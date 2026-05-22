/**
 * @typedef {Object} Element
 * @property {string} name
 * @property {number} number
 * @property {string} symbol
 */

/** @type {Element[]} */
const elements = await loadPeriodicTable();

/** @type {Map<string, Element>} */
const symbols = populateSymbols();

/** @type {() => Promise<Element[]>} */
async function loadPeriodicTable() {
  return await (await fetch('periodic-table.json')).json();
}

/** @type {() => Map<string, Element>} */
function populateSymbols() {
  const symbols = new Map();

  for (const element of elements) {
    symbols.set(element.symbol.toLowerCase(), element);
  }

  return symbols;
}

/** @type {(index: number, word: string, path: string[]) => string[]} */
function findSymbols(index, word, path) {
  // Base case: index is out of bounds
  if (index >= word.length) {
    return [...path];
  }

  const currLetter = word[index];
  const hasCurrLetter = symbols.has(currLetter);
  const letterPair = index < word.length - 1
    ? currLetter + word[index + 1]
    : '';
  const hasLetterPair = letterPair.length && symbols.has(letterPair);

  // Exit as no current matches found
  if (!hasCurrLetter && !hasLetterPair) {
    return [];
  }

  // Match letter pairs to symbols
  if (hasLetterPair) {
    path.push(letterPair);
    const result = findSymbols(index + 2, word, path);
    path.pop();

    if (result.length) {
      return result;
    }
  }

  // Match single letters to symbols
  if (hasCurrLetter) {
    path.push(currLetter);
    const result = findSymbols(index + 1, word, path);
    path.pop();

    if (result.length) {
      return result;
    }
  }

  return [];
}

/** @type {(inputWord: string) => string[]} */
function check(inputWord) {
  return findSymbols(0, inputWord, []);
}

/** @type {(elementSymbol: string) => Element} */
function lookup(elementSymbol) {
  return symbols.get(elementSymbol);
}

export default {
  check,
  lookup,
};
