const replaceVariables = (
  template: string,
  values: { [key: string]: string }
): string => {
  for (const key in values) {
    // Escape special characters in the key for RegExp, especially $ signs
    const escapedKey = key.replace(/\$/g, '\\$');
    const regex = new RegExp(`${escapedKey}\\b`, 'g'); // Match the variable
    template = template.replace(regex, values[key]); // Replace with value
  }
  return template;
};

export default replaceVariables;
