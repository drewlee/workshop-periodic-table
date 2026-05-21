let elements;

async function loadPeriodicTable() {
  elements = await (await fetch('periodic-table.json')).json();
}

await loadPeriodicTable();

function check(inputWord) {
  // TODO: determine if `inputWord` can be spelled
  // with periodic table symbols; return array with
  // them if so (empty array otherwise)

  return [];
}

function lookup(elementSymbol) {
  // TODO: return the element entry based on specified
  // symbol (case-insensitive)

  return {};
}

export default {
  check,
  lookup,
};
