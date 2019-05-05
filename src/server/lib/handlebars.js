/**
 * Concatenate 2 values
 */
module.exports.concat = (str1, str2, separator) => {
  return `${str1 || ''}${separator || ''}${str2 || ''}`;
};
