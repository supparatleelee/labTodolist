const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readFile, writeFile } = require('fs/promises'); // asychronous, not callback handling
const { readTodos, writeTodos } = require('./database/file');
const internal = require('stream');
const app = express();

app.listen(8000, () => console.log('Server is running'));

// Lab 2 - Body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Design todo object => {id: UNIQUE STRING, REQUIRED, title: STRING, REQUIRED, completed: BOOLEAN, REQUIRED, DEFAULT =false, dueDate: STRING}

// Design by using REST API
// 1. search all todos
// METHOD: GET, ENDPOINT URL: /todos
// INPUT: QUERY (title, completed, dueDate, offset, limit, sort)
// OUTPUT: ARRAY Todo Object, total
app.get('/todos', async (req, res) => {
  try {
    const oldTodos = await readTodos();
    res.status(200).json({ todos: oldTodos, total: oldTodos.length });
  } catch (err) {
    res.status(500).json({ message: err.message() });
  }
});

// 2. search by Id
// METHOD: GET, ENDPOINT URL: /todos/:id
// INPUT: - OR PARAMS (id)
// OUTPUT: Todo Object OR null
app.get('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const oldTodos = await readTodos();
    const todo = oldTodos.find((item) => item.id === id) ?? null;
    res.json({ todo });
  } catch (err) {
    res.status(500).json({ message: err.message() });
  }
});

// 3. add todo
// METHOD: POST, ENDPOINT URL: /todos
// INPUT: BODY (title: STRING, REQUIRED, completed: BOOLEAN, DEFAULT (FALSE), dueDate: OPTIONAL (STRING))
// OUTPUT: NEW Todo Object OR Error Message
app.post('/todos', (req, res) => {
  const { title, completed = false, dueDate } = req.body;

  //   if (
  //     title &&
  //     typeof completed === 'boolean' &&
  //     (dueDate === undefined || !isNan(new Date(dueDate).getTime()))
  //   ) {
  //   } else {
  //     res.status(400).json({ message: 'invalid input' });
  //   }

  if (!title || !title.trim()) {
    res.status(400).json({ message: 'title is required' });
  } else if (typeof completed !== 'boolean') {
    res.status(400).json({ message: 'compledted must be a boolean' });
  } else if (dueDate !== undefined && isNaN(new Date(dueDate).getTime())) {
    res.status(400).json({ message: 'Invalid due date' });
  } else {
    const newTodo = { title, completed, dueDate, id: uuidv4() };
    readFile('database/todolist.json', 'utf-8')
      .then((data) => {
        const oldTodos = JSON.parse(data);
        oldTodos.unshift(newTodo);
        return writeFile(
          'database/todolist.json',
          JSON.stringify(oldTodos),
          'utf-8'
        );
      })
      .then(() => {
        res.status(201).json({ todo: newTodo });
      })
      .catch((err) => res.status(500).json({ message: err.message }));
  }
});

// 4. Edit todo
// METHOD: PUT, ENDPOINT URL: /todos/:id
// INPUT: BODY (title: STRING, REQUIRED, completed: BOOLEAN, DEFAULT (FALSE), dueDate: -)
//          PARAMS (id)
// OUTPUT: NEW Todo Object OR Error Message
app.put('/todos/:id', async (req, res) => {
  try {
    const { title, completed = false, dueDate } = req.body;
    const { id } = req.params;
    // validate
    // end validate
    const oldTodos = await readTodos();
    const newTodo = { title, completed, dueDate, id };
    const newTodos = oldTodos.map((item) => (item.id === id ? newTodo : item));
    await writeTodos(newTodos);
    res.status(200).json({ todo: newTodo });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

// 5. Delete todo
// METHOD: DELETE, ENDPOINT URL: /todos/:id
// INPUT: PARAMS (id)
// OUTPUT: Success Message OR Error Message
app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const oldTodos = await readTodos();
    const newTodos = oldTodos.filter((item) => item.id !== id);
    await writeTodos(newTodos);
    res.status(200).json({ message: 'Success delete' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});
