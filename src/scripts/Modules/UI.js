import TodoApp from "./TodoApp";
import TodoItem from './TodoItem';

export default class UI{
  constructor() {
    this.app = new TodoApp();  // Store the TodoApp instance in the UI class
  }
   loadHomepage(){
    // const app = new TodoApp();
    this.loadProjects();
  }

   loadProjects(){
    const ProjectsDiv = document.querySelector(".projects-wrapper");
    let projectNames = this.app.listProjects();
    projectNames.forEach((projectName) => {
      UI.createProjectTab(projectName, ProjectsDiv);
    });
    this.initProjectButtons(); 
  }

  static createProjectTab(name, ProjectsDiv) {
    console.log(name) 
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
      btn.addEventListener('click',  (event) => this.onProjectButtonClick(event));//arrow function binds this context to button
    });
  }
  
  onProjectButtonClick(event){
    const project = event.currentTarget;  // The clicked button
    let projectName = project.getAttribute("data-project-name");
    console.log(projectName);
    this.OpenProjectTodos(projectName);
  }
  
  OpenProjectTodos(projectName){
    this.app.viewTodos(projectName)//doesn't work.
  }
}