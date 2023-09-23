/* global axios */
const urlParams = new URLSearchParams(window.location.search);
const todoId = urlParams.get("id");
const itemTemplate = document.querySelector("#todo-item-template");
const instance = axios.create({
  baseURL: "http://localhost:8000/api",
});

async function main() {
  const urlParams = new URLSearchParams(window.location.search);
  const todoId = urlParams.get("id");
  try {
    const todo = await getOneTodo(todoId);
    populateTodoData(todo);
  } catch (error) {
    alert("Failed to load todo details!");
  }
  setupEventListeners(todoId);
}

function setupEventListeners(todoId) {
  const editTodoButton = document.querySelector("#todo-edit");
  const todoInput = document.querySelector("#todo-input");
  const todoDescriptionInput = document.querySelector("#todo-description-input");
  const todoTaggsInput = document.querySelector("#todo-taggs-input");
  editTodoButton.addEventListener("click", async () => {
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
      const todo = await updateTodoStatus(todoId, { title, description, taggs });
      console.log(todoId)
      console.log(todo.id)
      window.location.href = `BrowseDiary.html?id=${todo.id}`;
    } catch (error) {
      alert("Failed to edit todo!");
      return;
    }
  });
}

function populateTodoData(todo) {
  const todoInput = document.querySelector("#todo-input");
  const todoDescriptionInput = document.querySelector("#todo-description-input");
  const todoTaggsInput = document.querySelector("#todo-taggs-input");

  todoInput.value = todo.title;
  todoDescriptionInput.value = todo.description;
  todoTaggsInput.value = todo.taggs;
}

async function getOneTodo(id){
  const response = await instance.get(`/todos/${id}`);
  return response.data;
}

async function updateTodoStatus(id, todo) {
  const response = await instance.put(`/todos/${id}`, todo);
  return response.data;
}

main();
