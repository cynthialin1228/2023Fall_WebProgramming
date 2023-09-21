/* global axios */
const itemTemplate = document.querySelector("#todo-item-template");
const todoList = document.querySelector("#todos");

const instance = axios.create({
  baseURL: "http://localhost:8000/api",
});

async function main() {
  // setupEventListeners();
  try {
    const todos = await getTodos();
    todos.forEach((todo) => renderTodo(todo));
  } catch (error) {
    alert("Failed to load todos!");
  }
}

function setupEventListeners() {
  // const addTodoButton = document.querySelector("#todo-add");
  // const todoInput = document.querySelector("#todo-input");
  // const todoDescriptionInput = document.querySelector(
  //   "#todo-description-input",
  // );
  // const todoTaggsInput = document.querySelector("#todo-taggs-input");
  // addTodoButton.addEventListener("click", async () => {
  //   const title = todoInput.value;
  //   const description = todoDescriptionInput.value;
  //   const taggs = todoTaggsInput.value;

  //   if (!title) {
  //     alert("Please enter a todo title!");
  //     return;
  //   }
  //   if (!description) {
  //     alert("Please enter a todo description!");
  //     return;
  //   }
  //   if (!taggs){
  //     alert("Please enter todo tags!");
  //   }
  //   try {
  //     const todo = await createTodo({ title, description, taggs });
  //     console.log("create Todo already")
  //     renderTodo(todo);
  //   } catch (error) {
  //     alert("Failed to create todo!");
  //     return;
  //   }
  //   todoInput.value = "";
  //   todoDescriptionInput.value = "";
  //   todoTaggsInput.value = "";
  // });
}

function renderTodo(todo) {
  const item = createTodoElement(todo);
  todoList.appendChild(item);
}

function createTodoElement(todo) {
  const item = itemTemplate.content.cloneNode(true);
  const container = item.querySelector(".todo-item");
  container.id = todo.id;
  console.log(todo);
  const title = item.querySelector("p.todo-title");
  title.innerText = todo.title;
  const description = item.querySelector("p.todo-description");
  description.innerText = todo.description;
  const taggs = item.querySelector("p.todo-taggs");
  taggs.innerText = todo.taggs;
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
