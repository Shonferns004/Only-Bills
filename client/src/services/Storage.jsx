export const setLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
}

export const getLocalStorage = (key) => {
  const result = localStorage.getItem(key);
  return JSON.parse(result);
}

export const deleteLocalStorage = () => {
  localStorage.clear();
}
