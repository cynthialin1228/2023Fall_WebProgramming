/* global axios */
const itemTemplate = document.querySelector("#todo-item-template");
const todoList = document.querySelector("#todos");

const instance = axios.create({
  baseURL: "http://localhost:8000/api",
});
async function main() {
  setupEventListeners();
}

function setupEventListeners() {
  const addTodoButton = document.querySelector("#todo-add");
  const todoInput = document.querySelector("#todo-input");
  const todoDescriptionInput = document.querySelector(
    "#todo-description-input",
  );
  const todoTaggsInput = document.querySelector("#todo-taggs-input");
  addTodoButton.addEventListener("click", async () => {
    const title = todoInput.value;
    const description = todoDescriptionInput.value;
    const taggs = todoTaggsInput.value;

    if (!title) {
      alert("Please enter a todo title!");
      return;
    }
    if (!description) {
      alert("Please enter a todo description!");
      return;
    }
    if (!taggs){
      alert("Please enter todo tags!");
    }
    try {
      const todo = await createTodo({ title, description, taggs });
      renderTodo(todo);
    } catch (error) {
      alert("Failed to create todo!");
      return;
    }
    todoInput.value = "";
    todoDescriptionInput.value = "";
    todoTaggsInput.value = "";
  });
}

async function getTodos() {
  const response = await instance.get("/todos");
  return response.data;
}

async function createTodo(todo) {
  const response = await instance.post("/todos", todo);
  return response.data;
}

main();
