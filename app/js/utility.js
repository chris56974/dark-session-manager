export function addClickHandler(eventHandler, ...args) {
  return async (event) => {
    event.preventDefault();
    await eventHandler(...args);
  };
}

// in case I use this somehow later
export const tabGroupColors = {
  grey: "#dadce0",
  blue: "#8ab4f8",
  red: "#f28b82",
  yellow: "#fdd663",
  green: "#81c995",
  pink: "#ff8bcb",
  purple: "#c58af9",
  cyan: "#78d9ec",
  orange: "#fcad70",
}