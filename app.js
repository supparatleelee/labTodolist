const express = require('express');
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

// 2. search by Id
// METHOD: GET, ENDPOINT URL: /todos/:id
// INPUT: - OR PARAMS (id)
// OUTPUT: Todo Object OR null

// 3. add todo
// METHOD: POST, ENDPOINT URL: /todos
// INPUT: BODY (title: STRING, REQUIRED, completed: BOOLEAN, DEFAULT (FALSE), dueDate: OPTIONAL (STRING))
// OUTPUT: NEW Todo Object OR Error Message

// 4. Edit todo
// METHOD: PUT, ENDPOINT URL: /todos/:id
// INPUT: BODY (title: STRING, REQUIRED, completed: BOOLEAN, DEFAULT (FALSE), dueDate: -)
//          PARAMS (id)
// OUTPUT: NEW Todo Object OR Error Message

// 5. Delete todo
// METHOD: DELETE, ENDPOINT URL: /todos/:id
// INPUT: PARAMS (id)
// OUTPUT: Success Message OR Error Message
