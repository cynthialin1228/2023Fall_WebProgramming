/* global axios */

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
  
  addTodoButton.addEventListener("click", async () => {
    const title = todoInput.value;
    const description = todoDescriptionInput.value;
    const selectedTags = getSelectedTags(todoTaggsInput);
    const selectedTag2 = getSelectedTag2(todoTag2Input);

    if (!title) {
      alert("Please enter a todo title!");
      return;
    }
    const date = isValidDate(title)
    if (!date) {
      return;
    }
    if (!description) {
      alert("Please enter a todo description!");
      return;
    }
    if (selectedTags.length === 0) {
      alert("Please select or create at least one tag!");
      return;
    }
    try {
      const todo = await createTodo({ title, description, taggs: selectedTags[0] , tag2:selectedTag2[0] });
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

  const splitArray = dateString.split(/[\s.()]+/);
  const [year, month, day] = [splitArray[0],splitArray[1],splitArray[2]]
  console.log(`${month}/${day}/${year}`)
  const date = new Date(year, month-1, day)
  console.log({date})
  if(!moment(`${month}/${day}/${year}`, 'MM/DD/YYYY', true).isValid()){
    alert("Invalid date")
  }
  return date;
}

function getSelectedTags(taggsInput) {
  const selectedTags = [];
  const options = taggsInput.options;

  for (let i = 0; i < options.length; i++) {
    if (options[i].selected && options[i].value !== "create-new") {
      selectedTags.push(options[i].value);
    }
  }
  return selectedTags;
}
function getSelectedTag2(tag2Input) {
  const selectedTag2 = [];
  const options = tag2Input.options;

  for (let i = 0; i < options.length; i++) {
    if (options[i].selected && options[i].value !== "create-new") {
      selectedTag2.push(options[i].value);
    }
  }
  return selectedTag2;
}


async function createTodo(todo) {
  const response = await instance.post("/todos", todo);
  return response.data;
}

main();
