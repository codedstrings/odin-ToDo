import Project from './Project.js';
import TodoItem from './TodoItem';

class TodoApp {
  constructor() {
    this.projects = [];
  }

  async initialize() {
    await this.loadFromAPI();
    // Only create default project if no projects exist after loading
    if (this.projects.length === 0) {
      this.addProject("Default");
    }
  }

/**
 * @deprecated This method is depracated and no longer used. use updateDataToAPI() instead.
 */
  saveToLocalStorage() {
    localStorage.setItem('todoApp', JSON.stringify(this.projects));
  }
  async updateDataToAPI() {
    try {
      const response = await fetch(BASE_URL+'/api/Project/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.projects) //this should be sent as json
      });
      if (!response.ok) {
        throw new Error('Failed to update data');
      }
      console.log('Data updated successfully:', response);
    } catch (error) {
      console.error('Error updating data to API:', error);
    }
  }

  async loadFromAPI() {
    try {
      var base = BASE_URL;
      const response = await fetch(BASE_URL+'/api/Project/1');
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

  /**
 * @deprecated This method is depracated and no longer used. Use loadFromAPI() instead.
 */
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
    this.updateDataToAPI();
  }

  removeProject(name) {
    this.projects = this.projects.filter(project => project.name !== name);
    this.updateDataToAPI();
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
      this.updateDataToAPI();
    } else {
      console.log(`Project ${projectName} does not exist.`);
    }
  }

  removeTodoFromProject(projectName, todoIndex) {
    const project = this.getProject(projectName);
    if (project) {
      project.removeTodo(todoIndex);
      this.updateDataToAPI();
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
      this.updateDataToAPI();
    }
  }
}

export default TodoApp;
