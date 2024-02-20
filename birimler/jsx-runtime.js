
/**
 * @param {string} ad
 * @param {!Object<string, string>} nitelikler
 * @param {boolean} kapalı
 * @return {string}
 */
const tagYaz = (ad, nitelikler, kapalı) => {
  /** @type {string} */
  let html = "<" + ad;
  for (const /** string */ nitelik in nitelikler)
    html += nitelikler[nitelik]
      ? ` ${nitelik}="${nitelikler[nitelik]}"`
      : " " + nitelik;
  return html + (kapalı ? "/>" : ">");
}

export const jsx = (type, props = {}) => {
  // Extract children from props, if present
  const children = (props && props.children) || [];
  const childrenString = Array.isArray(children)
    ? children.map(child =>
      typeof child === "object" ? jsx(child) : child
    ).join('')
    : children;

  if (typeof type === "string") {
    // Remove children from props as it's already handled
    const { children, ...attributes } = props;
    return type.toLowerCase() == "br"
      ? "<br>"
      : tagYaz(type, attributes, false) + childrenString + `</${type}>`;
  } else
    return type(props);
}
