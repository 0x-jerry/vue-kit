/**
 * if target is a element node
 * @param target
 * @returns
 */
export function isElement(target: Node): target is Element {
  return target.nodeType === document.ELEMENT_NODE
}
