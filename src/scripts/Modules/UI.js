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
        <span class="left-project-panel">
          <button class="button-project" data-project-name="${name}">
            <i class="fas fa-tasks"></i>
            <span class="project-name">${name}</span>
          </button>
        </span>
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

    const deleteBtns = document.querySelectorAll('.right-project-panel');
    deleteBtns.forEach((btn) => {
      btn.addEventListener('click', (event) => this.onProjectDelete(event));//arrow function binds this context to button
    });
  }

  openAddProjectPopup(event) {
    this.newProjectPopup.classList.add("active");
    this.newProjectNameInput.value = "";    // Clear the input field
  }

  handleAddNewProject(event) {
    const newProjectName = this.newProjectNameInput.value;
    const exisitingProjects = this.app.listProjects();
    const selectedprojectItem = document.querySelector('.selected-project');
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
    const allprojectItems = document.querySelectorAll('.project-item');
    allprojectItems.forEach(item=>item.classList.remove("selected-project"));
    const selectedprojectItem = project.closest('.project-item');
    selectedprojectItem.classList.add("selected-project");
    let projectName = project.getAttribute("data-project-name");
    console.log(projectName);
    this.OpenProject(projectName);
  }

  OpenProject(projectName) {
    const taskviewSection = document.querySelector(".taskview");
    taskviewSection.innerHTML = `
      <h3 class="taskview-header">${projectName}</h3>
      <div class="tasks-wrapper"></div>
    `;
  
    let todoItems = this.app.viewTodos(projectName); // load the projectTodos
    if (todoItems) {
      const tasksWrapper = taskviewSection.querySelector('.tasks-wrapper');
      todoItems.forEach(todoItem => {
        let todoElement = document.createElement("div");
        todoElement.className = `todo-item priority-${todoItem.priority.toLowerCase()}`;
        todoElement.innerHTML = `
          <input type="checkbox" class="todo-checkbox" id="todo-${todoItem.title}" ${todoItem.completed ? 'checked' : ''}>
          <label for="todo-${todoItem.title}" class="todo-title">${todoItem.title}</label>
          <span class="todo-due-date">${todoItem.dueDate}</span>
        `;
        tasksWrapper.appendChild(todoElement);
        
        // Add event listener for checkbox
        const checkbox = todoElement.querySelector('.todo-checkbox');
        // checkbox.addEventListener('change', (event) => this.handleTodoCompletion(event, todoItem.title, projectName));
        checkbox.addEventListener('change', (event) => this.app.updateTodoCompletion(todoItem.title, projectName));
      });
    }
  
    // Create the "Create New ToDo" button
    let createNewTodoBtn = document.createElement("div");
    createNewTodoBtn.innerHTML = `<button class="new-todo-btn">Create New ToDo item</button>`;
    taskviewSection.appendChild(createNewTodoBtn);
  
    // Open the modal when "Create New ToDo" button is clicked
    createNewTodoBtn.addEventListener('click', () => this.onCreateNewTodo(projectName));
  }
  
  onProjectDelete(event) {
    try {
      const projectItem = event.currentTarget.closest('.project-item');
      const projectButton = projectItem.querySelector('.button-project');
      const projectName = projectButton.getAttribute('data-project-name');
  
      if (!projectName) {
        throw new Error('Could not find project name');
      }
  
      // Confirm before deleting
      if (confirm(`Are you sure you want to delete the project "${projectName}"?`)) {
        this.app.removeProject(projectName);
        console.log(`${projectName} deleted`);
        this.loadProjects(); // Refresh the project list
      }
    } catch (error) {
      console.error('Error deleting project:', error.message);
    }
  }

  handleTodoCompletion(event, todotitle, projectName) {
    this.app.updateTodoCompletion(todotitle, projectName);
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