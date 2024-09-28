import TodoApp from "./TodoApp"

export default class UI{
  static loadHomepage(){
    const app = new TodoApp();
    UI.loadProjects(app);
  }

  static loadProjects(app){
    const ProjectsDiv = document.querySelector(".projects-wrapper");
    let projectNames = app.listProjects();
    projectNames.forEach((projectName) => {
      this.createProjectTab(projectName, ProjectsDiv);
    });
  }

  static createProjectTab(name, ProjectsDiv) {
    console.log(name) 
    const userProject = document.createElement("div");
    userProject.classList.add("project-item");
    userProject.innerHTML = `
      <button class="button-project" data-project-button>
        <span class="left-project-panel">
          <i class="fas fa-tasks"></i>
          <span>${name}</span>
        </span>
        <span class="right-project-panel">
          <i class="fas fa-times"></i>
        </span>
      </button>`;

    ProjectsDiv.appendChild(userProject);  // Append the project to the sidebar
  }

  initProjectButtons(){
    const projectBtn = document.querySelector(".button-project")
  }
}