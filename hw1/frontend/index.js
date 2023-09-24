/* global axios */
const itemTemplate = document.querySelector("#todo-item-template");
const todoList = document.querySelector("#todos");
const tagFilter = document.querySelector("#tag-filter");
const instance = axios.create({
  baseURL: "http://localhost:8000/api",
});

async function main() {
  // setupEventListeners();
  try {
    const todos = await getTodos();
    todos.forEach((todo) => renderTodo(todo));
    setupEventListeners();
  } catch (error) {
    console.log(error)
    alert("Failed to load todos!");
  }
}
function setupEventListeners() {
  tagFilter.addEventListener("change", async () => {
    const selectedFilter = tagFilter.value;
    const todos = await getTodos();
    const filteredTodos = filterTodos(todos, selectedFilter);
    clearTodoList();
    filteredTodos.forEach((todo) => renderTodo(todo));
  });
}

function filterTodos(todos, filter) {
  if (!filter) {
    return todos;
  }
  return todos.filter((todo) => todo.taggs === filter || todo.tag2 === filter);
}

function clearTodoList() {
  while (todoList.firstChild) {
    todoList.removeChild(todoList.firstChild);
  }
}


function renderTodo(todo) {
  const item = createTodoElement(todo);
  todoList.appendChild(item);
}

function createTodoElement(todo) {
  const item = itemTemplate.content.cloneNode(true);
  const container = item.querySelector(".todo-item");
  container.id = todo.id;
  const title = item.querySelector("p.todo-title");
  title.innerText = todo.title;
  const description = item.querySelector("p.todo-description");
  description.innerText = todo.description;
  const taggs = item.querySelector("p.todo-taggs");
  taggs.innerText = todo.taggs;
  const tag2 = item.querySelector("p.todo-tag2");
  tag2.innerText = todo.tag2;
  const editDetails = item.querySelector("details.todo-item");
  editDetails.dataset.id = todo.id;
  editDetails.addEventListener("click", () => {
    window.location.href = `EditDiary.html?id=${todo.id}`;
  });
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

async function getTodos() {
  const response = await instance.get("/todos");
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
