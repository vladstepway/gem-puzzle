export function set(name, value) {
  localStorage.setItem(name, JSON.stringify(value));
}

export function get(name, replace = null) {
  return JSON.parse(localStorage.getItem(name) || replace);
}

export function remove(name) {
  return localStorage.removeItem(name);
}
