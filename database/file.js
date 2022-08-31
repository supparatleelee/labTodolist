const { readFile, writeFile } = require('fs/promises');

exports.readTodos = () =>
  readFile('database/todolist.json', 'utf-8').then((res) => JSON.parse(res));

exports.writeTodos = (data) =>
  writeFile('database/todolist.json', JSON.stringify(data), 'utf-8');
