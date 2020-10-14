const queries = require('./queries');
const mutations = require('./mutations');
const inputs = require('./input');
const types = require('./types');
const enums = require('./enums');
const scalars = require('./scalar');

module.exports = `
  ${queries}
  ${mutations}
  ${inputs}
  ${types}
  ${enums}
  ${scalars}
`;
