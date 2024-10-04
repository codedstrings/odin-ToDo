import Project from './Project.js';
import TodoItem from './TodoItem';

class TodoApp {
  constructor() {
    this.projects = [];
    this.addProject("Default"); // Add a default project
  }

  addProject(name) {
    const project = new Project(name);
    this.projects.push(project);
  }

  removeProject(name) {
    this.projects = this.projects.filter(project => project.name !== name);
  }

  getProject(name) {
    return this.projects.find(project => project.name === name);
  }

  listProjects() {
    return this.projects.map(project => project.name);
  }

  addTodoToProject(projectName, todo) {
    const project = this.getProject(projectName);
    if (project) {
      project.addTodo(todo);
    } else {
      console.log(`Project ${projectName} does not exist.`);
    }
  }

  removeTodoFromProject(projectName, todoIndex) {
    const project = this.getProject(projectName);
    if (project) {
      project.removeTodo(todoIndex);
    } else {
      console.log(`Project ${projectName} does not exist.`);
    }
  }

  viewTodos(projectName) {
    const project = this.getProject(projectName);
    const todos = project.getTodos();
    if (project) {
      todos.forEach((todo, index) => {
        console.log(`${index + 1}. ${todo.title} - Due: ${todo.dueDate} - Priority: ${todo.priority} - Completed: ${todo.completed}`);
      });
      return todos;
    } else {
      console.log(`Project ${projectName} does not exist.`);
    }
  }
}

export default TodoApp;
