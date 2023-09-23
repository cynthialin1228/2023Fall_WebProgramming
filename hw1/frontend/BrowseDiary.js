/* global axios */
const itemTemplate = document.querySelector("#todo-item-template");
const todoList = document.querySelector("#todos");
const instance = axios.create({
  baseURL: "http://localhost:8000/api",
});
async function main() {
  const urlParams = new URLSearchParams(window.location.search);
  const todoId = urlParams.get("id");
  try {
    const todo = await getOneTodo(todoId);
    renderTodo(todo);
  } catch (error) {
    alert("Failed to load todo details!");
  }
  setupEventListeners(todoId);
}
function setupEventListeners(todoId) {
  const goEditTodoButton = document.querySelector("#todo-goedit");
  goEditTodoButton.addEventListener("click", () => {
    try {
      window.location.href = `EditDiary.html?id=${todoId}`;
    } catch (error) {
      alert("Failed to go to edit todo!");
      return;
    }
  });
}
function renderTodo(todo) {
  const item = createTodoElement(todo);
  todoList.appendChild(item);
}

function createTodoElement(todo) {
  const item = itemTemplate.content.cloneNode(true);
  const title = item.querySelector("p.todo-title");
  title.innerText = todo.title;
  const description = item.querySelector("p.todo-description");
  description.innerText = todo.description;
  const taggs = item.querySelector("p.todo-taggs");
  taggs.innerText = todo.taggs;
  return item;
}

async function deleteTodoElement(id) {
  try {
    await deleteTodoById(id);
  } catch (error) {
    alert("Failed to delete todo!");
  } finally {
    const todo = document.getElementById(id);
    todo.remove();
  }
}
async function getOneTodo(id){
  const response = await instance.get(`/todos/${id}`);
  return response.data;
}

async function getTodos() {
  const response = await instance.get(`/todos`);
  return response.data;
}

async function updateTodoStatus(id, todo) {
  const response = await instance.put(`/todos/${id}`, todo);
  return response.data;
}

async function deleteTodoById(id) {
  const response = await instance.delete(`/todos/${id}`);
  return response.data;
}

main();