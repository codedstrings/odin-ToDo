import Project from './Project.js';
import TodoItem from './TodoItem';

class TodoApp {
  constructor() {
    this.projects = [];
    if (this.projects.length === 0) {
      this.addProject("Default");
    }
  }

  saveToLocalStorage() {
    localStorage.setItem('todoApp', JSON.stringify(this.projects));
  }

  async loadFromAPI() {
    try {
      const response = await fetch('https://dummyjson.com/c/5542-d5f6-4d55-a1da');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      // Convert the raw data back to Project and TodoItem instances
      this.projects = data.map(projectData => {
        const project = new Project(projectData.name);
        project.todos = projectData.todos.map(todoData => {
          const todo = new TodoItem(todoData.title, todoData.description, todoData.dueDate, todoData.priority);
          todo.completed = todoData.completed;
          return todo;
        });
        return project;
      });
    } catch (error) {
      console.error('Error loading data from API:', error);
      // Fallback to empty state or show error message
      this.projects = [];
    }
  }

  
  loadFromLocalStorage() {
    const data = localStorage.getItem('todoApp');
    if (data) {
      const parsedData = JSON.parse(data);
      this.projects = parsedData.map(projectData => {
        const project = new Project(projectData.name);
        project.todos = projectData.todos.map(todoData => {
          const todo = new TodoItem(todoData.title, todoData.description, todoData.dueDate, todoData.priority);
          todo.completed = todoData.completed;
          return todo;
        });
        return project;
      });
    }
  }

  addProject(name) {
    const project = new Project(name);
    this.projects.push(project);
    this.saveToLocalStorage();
  }

  removeProject(name) {
    this.projects = this.projects.filter(project => project.name !== name);
    this.saveToLocalStorage();
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
      this.saveToLocalStorage();
    } else {
      console.log(`Project ${projectName} does not exist.`);
    }
  }

  removeTodoFromProject(projectName, todoIndex) {
    const project = this.getProject(projectName);
    if (project) {
      project.removeTodo(todoIndex);
      this.saveToLocalStorage();
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
      return[];
    }
  }

  updateTodoCompletion(todotitle, projectName) {
    const project = this.getProject(projectName);
    if (project) {
      project.getTodos().forEach((item) => {
        if (item.title === todotitle) {
          item.toggleComplete();
        }
      });
      this.saveToLocalStorage();
    }
  }
}

export default TodoApp;
