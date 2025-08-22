import TodoApp from "./TodoApp";
import TodoItem from './TodoItem';

export default class UI {
  constructor() {
    this.app = new TodoApp();  // Store the TodoApp instance in the UI class
    this.selectedProject = this.app.listProjects()[0] || 'Default';
    this.newProjectPopup = document.querySelector(".add-project-popup");
    this.newProjectPopupAddBtn = document.querySelector(".button-add-project-popup");
    this.newProjectNameInput = document.querySelector(".input-add-project-popup");
    this.newProjectPopupCancelBtn = document.querySelector(".button-cancel-project-popup");
    //adding global event listeners  
    this.newProjectPopupAddBtn.addEventListener('click', (event) => this.handleAddNewProject(event));
    this.newProjectPopupCancelBtn.addEventListener('click', ()=> this.newProjectPopup.classList.remove("active"));
    this.newProjectNameInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        this.handleAddNewProject(event);
      }
    });
  }

  async loadHomepage() {
    await this.app.loadFromAPI(); // Fetch projects from the server first
    this.loadProjects();
    this.OpenProject(this.selectedProject);
  }

  loadProjects() {
    const ProjectsDiv = document.querySelector(".projects-list");
    ProjectsDiv.innerHTML = ''; //refresh Projects list

    let projectNames = this.app.listProjects();
    projectNames.forEach((projectName) => {
      UI.createProjectTab(projectName, ProjectsDiv, projectName === this.selectedProject);
    });
    this.initProjectButtons();
  }

  static createProjectTab(name, ProjectsDiv, isSelected) {
    const userProject = document.createElement("div");
    userProject.classList.add("project-item");
    if (isSelected) {
      userProject.classList.add("selected-project");
    }
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
    this.newProjectNameInput.focus();
  }

  handleAddNewProject(event) {
    const newProjectName = this.newProjectNameInput.value.trim();
    const existingProjects = this.app.listProjects();
    if(newProjectName && !existingProjects.includes(newProjectName)){
      this.app.addProject(newProjectName);
      this.selectedProject = newProjectName; // Set the new project as selected and opens it
      this.loadProjects();
      this.OpenProject(newProjectName);
    }
    else{
      alert("Project Name cannot be duplicate or null!");
    }    
    this.newProjectPopup.classList.remove("active");
  }

  onProjectButtonClick(event){
    const project = event.currentTarget;  // The clicked button
    let projectName = project.getAttribute("data-project-name");
    console.log(projectName);
    this.OpenProject(projectName);
    
    // Update the selected project
    this.selectedProject = projectName; 
    this.loadProjects();
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
      todoItems.forEach((todoItem, index) => {
        let todoElement = document.createElement("div");
        todoElement.className = `todo-item priority-${todoItem.priority.toLowerCase()}`;
        todoElement.innerHTML = `
          <input type="checkbox" class="todo-checkbox" id="todo-${todoItem.title}" ${todoItem.completed ? 'checked' : ''}>
          <label for="todo-${todoItem.title}" class="todo-title">${todoItem.title}</label>
          <span class="todo-due-date">${todoItem.dueDate}</span>
          <button class="delete-todo-btn" data-index="${index}">
            <i class="fas fa-times"></i>
          </button>
        `;
        tasksWrapper.appendChild(todoElement);
        
        // Add event listener for checkbox
        const checkbox = todoElement.querySelector('.todo-checkbox');
        checkbox.addEventListener('change', () => {
          this.app.updateTodoCompletion(todoItem.title, projectName);
          this.OpenProject(projectName);  // Refresh the project view
        });
        
        // Add event listener for delete button
        const deleteBtn = todoElement.querySelector('.delete-todo-btn');
        deleteBtn.addEventListener('click', (event) => {
          this.onDeleteTodo(event, projectName);
        });
      });
    }
    // Create the "Create New ToDo" button
    let createNewTodoBtn = document.createElement("div");
    createNewTodoBtn.classList.add("new-todo-btn-wrapper");
    createNewTodoBtn.innerHTML = `<button class="new-todo-btn">Add New Task</button>`;
    taskviewSection.appendChild(createNewTodoBtn);

    // Open the modal when "Create New ToDo" button is clicked
    createNewTodoBtn.addEventListener('click', () => this.onCreateNewTodo(projectName));
  }
  // Add this new method to the UI class to handle task deletion
  onDeleteTodo(event, projectName) {
    const todoIndex = parseInt(event.currentTarget.getAttribute('data-index'));
    
    if (confirm('Are you sure you want to delete this task?')) {
      this.app.removeTodoFromProject(projectName, todoIndex);
      this.OpenProject(projectName); // Refresh the project view
    }
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
        // If the deleted project was the selected one, select the first available project
        if (this.selectedProject === projectName) {
          this.selectedProject = this.app.listProjects()[0] || 'Add a Project';
        }
        this.loadProjects(); // Refresh the project list
        this.OpenProject(this.selectedProject);
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