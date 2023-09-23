/* global axios */
const itemTemplate = document.querySelector("#todo-item-template");
const todoList = document.querySelector("#todos");

const instance = axios.create({
  baseURL: "http://localhost:8000/api",
});
async function main() {
  const todoInput = document.querySelector("#todo-input");
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const dayOfWeek = ['日', '一', '二', '三', '四', '五', '六'][currentDate.getDay()];
  const formattedDate = `${year}.${month}.${day} (${dayOfWeek})`;
  todoInput.value = formattedDate;
  setupEventListeners(todoInput);
}

function setupEventListeners(todoInput) {
  const addTodoButton = document.querySelector("#todo-add");
  // const todoInput = document.querySelector("#todo-input");
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
    if (!isValidDate(title)) {
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
      window.location.href = `BrowseDiary.html?id=${todo.id}`;
    } catch (error) {
      console.log(error)
      alert("Failed to create todo!");
      return;
    }
  });
}

function isValidDate(dateString) {
  const datePattern = /^\d{4}\.\d{2}\.\d{2}\s\([\u4e00-\u9fa5]+\)$/;
  if (!datePattern.test(dateString)) {
    alert("Wrong date format. Use yyyy.mm.dd (day) format.");
    return false;
  }
  const [year, month, day] = dateString.split('.')[0].split(' ');
  const date = new Date(`${month} ${day}, ${year}`);
   
  if (!isNaN(date) && date.getFullYear() == year && date.getMonth() + 1 == month && date.getDate() == day){
    return true;
  }
  alert("Wrong date");
  return false;
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
