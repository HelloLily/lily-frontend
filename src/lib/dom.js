export function getClosestAncestorOfType(_node, type) {
  let node = _node;
  do {
    if (type === node.nodeName) {
      break;
    }
    node = node.parentNode;
  } while (node.parentNode && 1 === node.nodeType);

  if (node && 9 !== node.nodeType) {
    return node;
  }
}
