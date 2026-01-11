export class ElementBag {
    constructor() {
        this.elements = new Map();
    }

    add(element) {
        console.log("CV E ADD", element)
        this.elements.set(element.name, element);
    }

    get(name) {
        return this.elements.get(name);
    }

    concat(elementBag) {
        if (!(elementBag instanceof ElementBag)) {
            throw new TypeError("Argument must be an instance of ElementBag");
        }

        for (const [key, value] of elementBag.elements) {
            this.elements.set(key, value);
        }
    }

    getAllButtonElements() {
        return [...this.elements.values()]
            .map(element => element.buttonElement) // Extract buttonElement
            .filter(button => button !== undefined && button !== null); // Filter out any null/undefined values
    }

getButtonMap() {
  const map = new Map();
  for (const [key, element] of this.elements.entries()) {
    if (element.buttonElement !== undefined && element.buttonElement !== null) {
      const Button =element.buttonElement
        map.set(key, Button
         );
    }
  }
  return map;
}

}
