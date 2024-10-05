import TodoApp from "./TodoApp";
import TodoItem from './TodoItem';

export default class UI {
  constructor() {
    this.app = new TodoApp();  // Store the TodoApp instance in the UI class
    this.newProjectPopup = document.querySelector(".add-project-popup");
    this.newProjectPopupAddBtn = document.querySelector(".button-add-project-popup");
    this.newProjectNameInput = document.querySelector(".input-add-project-popup");
    this.newProjectPopupCancelBtn = document.querySelector(".button-cancel-project-popup");
    
    //adding global event listeners  
    this.newProjectPopupAddBtn.addEventListener('click', (event) => this.handleAddNewProject(event));
    this.newProjectPopupCancelBtn.addEventListener('click', ()=> this.newProjectPopup.classList.remove("active"));
  }

  loadHomepage() {
    this.loadProjects();
  }

  loadProjects() {
    const ProjectsDiv = document.querySelector(".projects-list");
    ProjectsDiv.innerHTML = ''; //refresh Projects list

    let projectNames = this.app.listProjects();
    projectNames.forEach((projectName) => {
      UI.createProjectTab(projectName, ProjectsDiv);
    });
    this.initProjectButtons();
  }

  static createProjectTab(name, ProjectsDiv) {
    console.log(name);
    const userProject = document.createElement("div");
    userProject.classList.add("project-item");
    userProject.innerHTML = `
        <button class="button-project" data-project-name="${name}">
          <span class="left-project-panel">
            <i class="fas fa-tasks"></i>
            <span>${name}</span>
          </span>
          </button>
          <span class="right-project-panel">
            <i class="fas fa-times"></i>
          </span>
      `;   
    ProjectsDiv.appendChild(userProject);  // Append the project to the sidebar
  }

  initProjectButtons(){
    const projectBtns = document.querySelectorAll(".button-project");  // Select all project buttons
    projectBtns.forEach((btn) => {
      btn.addEventListener('click', (event) => this.onProjectButtonClick(event));//arrow function binds this context to button
    });

    const newProjectBtn = document.querySelector(".button-add-project");
    newProjectBtn.addEventListener('click', (event) => this.openAddProjectPopup(event));
  }

  openAddProjectPopup(event) {
    this.newProjectPopup.classList.add("active");
    this.newProjectNameInput.value = "";    // Clear the input field
  }

  handleAddNewProject(event) {
    const newProjectName = this.newProjectNameInput.value;
    const exisitingProjects = this.app.listProjects();
    if(newProjectName && !exisitingProjects.includes(newProjectName)){
      this.app.addProject(newProjectName);
      this.loadProjects();
    }
    else{
      alert("Project Name cannot be duplicate or null!")
    }    
    this.newProjectPopup.classList.remove("active");
  }

  onProjectButtonClick(event){
    const project = event.currentTarget;  // The clicked button
    let projectName = project.getAttribute("data-project-name");
    console.log(projectName);
    this.OpenProject(projectName);
  }

  OpenProject(projectName) {
    const taskviewSection = document.querySelector(".taskview");
    taskviewSection.innerHTML = ``;
    taskviewSection.innerHTML = `
        <h3 class="taskview-header">${projectName}</h3>
        <div class="tasks-wrapper></div>
      `;
    let todoItems = this.app.viewTodos(projectName)//load the projectTodos.
    if (todoItems) {
      todoItems.forEach(todoItem => {
        let todoElement = document.createElement("div");
        todoElement.innerHTML = `
          <div class=todo-item>
            <span>${todoItem.title}</span>
            <span>${todoItem.dueDate}</span>
            <span>${todoItem.priority}</span>
          </div>
        `;
        taskviewSection.appendChild(todoElement);
      });
    }
    // Create the "Create New ToDo" button
    let createNewTodoBtn = document.createElement("div");
    createNewTodoBtn.innerHTML = `<button class="new-todo-btn">Create New ToDo item</button>`;
    taskviewSection.appendChild(createNewTodoBtn);

    // Open the modal when "Create New ToDo" button is clicked
    createNewTodoBtn.addEventListener('click', () => this.onCreateNewTodo(projectName))
  }

  onCreateNewTodo(projectName) {
    const modal = document.getElementById('todoModal');
    modal.style.display = "block";

    if (this.todoFormSubmitHandler) {
      const todoForm = document.getElementById("todoForm");
      todoForm.removeEventListener('submit', this.todoFormSubmitHandler);
    }
    // Create a new submit handler and add submit listener
    this.todoFormSubmitHandler = (event) => this.onSubmitNewTodo(event, projectName);
    const todoForm = document.getElementById("todoForm");
    todoForm.addEventListener('submit', this.todoFormSubmitHandler);

    // Close the modal when clicking on <span> (x)
    const closeModal = document.querySelector('.close');
    closeModal.onclick = () => {
      modal.style.display = "none";
    };
  }

  onSubmitNewTodo(event, projectName) {
    event.preventDefault();

    const title = document.getElementById("todoTitle").value;
    const description = document.getElementById("todoDescription").value;
    const dueDate = document.getElementById("dueDate").value;
    const priority = document.querySelector('input[name="priority"]:checked').value;

    const newTodo = new TodoItem(title, description, dueDate, priority);
    this.app.addTodoToProject(projectName, newTodo);

    const modal = document.getElementById('todoModal');
    modal.style.display = "none";

    // Reset the form
    document.getElementById("todoForm").reset();
    // Refresh the task view
    this.OpenProject(projectName);
  }
} 