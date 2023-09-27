/* global axios */
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
  const goBrowseTodoButton = document.querySelector("#todo-item");
  const todoInput = document.querySelector("#todo-input");
  const todoDescriptionInput = document.querySelector("#todo-description-input");
  const todoTaggsInput = document.querySelector("#todo-taggs-input");
  const todoTag2Input = document.querySelector("#todo-tag2-input");
  
  const newTaggsInput = document.getElementById("new-taggs");
  const addTaggsButton = document.getElementById("add-taggs");
  const savedOptionsTaggs = JSON.parse(localStorage.getItem("customOptionsTaggs")) || [];
  savedOptionsTaggs.forEach((optionText)=>{
    const option = document.createElement("option");
    option.value = optionText;
    option.text = optionText;
    todoTaggsInput.appendChild(option);
  })
  addTaggsButton.addEventListener("click", function () {
    const newTaggs = newTaggsInput.value.trim();

    if (newTaggs) {
      const existingOption = Array.from(todoTaggsInput.options).find(
        (option) => option.value === newTaggs
      );
      if (!existingOption) {
        const option = document.createElement("option");
        option.value = newTaggs;
        option.text = newTaggs;
        todoTaggsInput.appendChild(option);
        savedOptionsTaggs.push(newTaggs);
        localStorage.setItem("customOptionsTaggs", JSON.stringify(savedOptionsTaggs))
        newTaggsInput.value = "";
      } else {
        alert("Option already exists!");
      }
    }
  });
  
  const newTag2Input = document.getElementById("new-tag2");
  const addTag2Button = document.getElementById("add-tag2");
  const savedOptionsTag2 = JSON.parse(localStorage.getItem("customOptionsTag2")) || [];
  savedOptionsTag2.forEach((optionText)=>{
    const option = document.createElement("option");
    option.value = optionText;
    option.text = optionText;
    todoTag2Input.appendChild(option);
  })
  addTag2Button.addEventListener("click", function () {
    const newTag2 = newTag2Input.value.trim();
    
    if (newTag2) {
      const existingOption = Array.from(todoTag2Input.options).find(
        (option) => option.value === newTag2
      );
      if (!existingOption) {
        const option = document.createElement("option");
        option.value = newTag2;
        option.text = newTag2;
        todoTag2Input.appendChild(option);
        savedOptionsTag2.push(newTag2);
        localStorage.setItem("customOptionsTag2", JSON.stringify(savedOptionsTag2))
        newTag2Input.value = "";
      } else {
        alert("Option already exists!");
      }
    }
  });
  // Array.from(todoTaggsInput.options).forEach((option) => {
  //   if (!savedOptionsTaggs.includes(option.value)) {
  //     todoTaggsInput.removeChild(option);
  //   }
  // });
  // Array.from(todoTag2Input.options).forEach((option) => {
  //   if (!savedOptionsTag2.includes(option.value)) {
  //     todoTag2Input.removeChild(option);
  //   }
  // });
  
  editTodoButton.addEventListener("click", async () => {
  const title = todoInput.value;
  const description = todoDescriptionInput.value;
  const taggs = todoTaggsInput.value;
  const tag2 = todoTag2Input.value;

    if (!title) {
      alert("Please enter a todo title!");
      return;
    }
    console.log(title)
    const date = isValidDate(title)
    if (!date) {
      return;
    }
    if (!description) {
      alert("Please enter a todo description!");
      return;
    }
    if (!taggs){
      alert("Please enter todo taggs!");
    }
    if (!tag2){
      alert("Please enter todo tag2!");
    }
    try {
      const todo = await updateTodoStatus(todoId, { title, description, taggs, tag2 });
      console.log(todoId)
      console.log(todo.id)
      window.location.href = `BrowseDiary.html?id=${todo.id}`;
    } catch (error) {
      alert("Failed to edit todo!");
      return;
    }
  });
  goBrowseTodoButton.addEventListener("click", async () => {
    try{
      window.location.href = `BrowseDiary.html?id=${todoId}`;
    }catch(error){
      alert("Failed to go to browse mode!");
      return;
    }
  })
}

function isValidDate(dateString) {
  const datePattern = /^\d{4}\.\d{2}\.\d{2}\s\([\u4e00-\u9fa5]+\)$/;
  if (!datePattern.test(dateString)) {
    alert("Wrong date format. Use yyyy.mm.dd (day) format.");
    return false;
  }
  const splitArray = dateString.split(/[\s.()]+/);
  const [year, month, day] = [splitArray[0],splitArray[1],splitArray[2]]
  console.log(`${month}/${day}/${year}`)
  const date = new Date(year, month-1, day)
  console.log({date})
  if(!(`${month}/${day}/${year}`, 'MM/DD/YYYY', true).isValid()){
    alert("Invalid date")
  }
  return date;
}

function populateTodoData(todo) {
  const todoInput = document.querySelector("#todo-input");
  const todoDescriptionInput = document.querySelector("#todo-description-input");
  const todoTaggsInput = document.querySelector("#todo-taggs-input");
  const todoTag2Input = document.querySelector("#todo-tag2-input");
  todoInput.value = todo.title;
  todoDescriptionInput.value = todo.description;
  todoTaggsInput.value = todo.taggs;
  todoTag2Input.value = todo.tag2;
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
