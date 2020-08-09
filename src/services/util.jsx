export function construirObjeto(form) {
  let object = {};
  const div = document.getElementById(form);
  const elements = Object.values(div.elements);
  elements.forEach((input) => {
    const split = input.id.split(".");
    if (split.length === 1) {
      if (input.id.split("_").length === 1) object[input.id] = input.value;
    } else {
      if (typeof object[split[0]] === "undefined") {
        object[split[0]] = {};
      }
      object[split[0]][split[1]] = input.value;
    }
  });
  delete object[""];
  return object;
}
