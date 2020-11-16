export default function create(el, classNames, children, parent, ...dataAttr) {
  let element = null;
  try {
    element = document.createElement(el);
  } catch (error) {
    throw new Error('Unable to create HTMLElement!');
  }
  if (classNames) {
    element.classList.add(...classNames.split(' '));
  }

  if (children && Array.isArray(children)) {
    children.forEach(
      (childElement) => childElement && element.appendChild(childElement)
    );
  } else if (children && typeof children === 'object') {
    element.appendChild(children);
  } else if (children && typeof children === 'string') {
    element.innerHTML = children;
  }
  if (parent) {
    parent.appendChild(element);
  }
  if (dataAttr.length) {
    dataAttr.forEach(([attrName, attrValue]) => {
      if (attrValue === '') {
        element.setAttribute(attrName, '');
      }
      if (
        attrName.match(
          /value|placeholder|cols|rows|autocorrect|spellcheck|src|alt|draggable|id|selected|name/
        )
      ) {
        element.setAttribute(attrName, attrValue);
      } else {
        element.dataset[attrName] = attrValue;
      }
    });
  }
  return element;
}
