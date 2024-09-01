// const TodoApp = require('../Modules/TodoApp');
import TodoApp from './TodoApp';
import TodoItem from './TodoItem';
// const TodoItem = require('../Modules/TodoItem');

const app = new TodoApp();

console.log("Welcome to the Todo App!");

// const prompt = require('prompt-sync')(); // If you are using Node.js, you may need a package like prompt-sync

const mainMenu = () => {
  console.log("\nMain Menu:");
  console.log("1. View all projects");
  console.log("2. View todos in a project");
  console.log("3. Add a new project");
  console.log("4. Add a new todo");
  console.log("5. Delete a todo");
  console.log("6. Exit");

  const choice = prompt("Enter your choice: ");

  switch (choice) {
    case "1":
      console.log("Projects:", app.listProjects());
      break;
    case "2":
      const projectToView = prompt("Enter the project name to view todos: ");
      app.viewTodos(projectToView);
      break;
    case "3":
      const newProject = prompt("Enter new project name: ");
      app.addProject(newProject);
      console.log(`Project "${newProject}" added.`);
      break;
    case "4":
      const projectNameForTodo = prompt("Enter the project name to add a todo: ");
      const title = prompt("Enter todo title: ");
      const description = prompt("Enter todo description: ");
      const dueDate = prompt("Enter due date: ");
      const priority = prompt("Enter priority (low, medium, high): ");
      const newTodo = new TodoItem(title, description, dueDate, priority);
      app.addTodoToProject(projectNameForTodo, newTodo);
      console.log(`Todo "${title}" added to project "${projectNameForTodo}".`);
      break;
    case "5":
      const projectNameForRemoval = prompt("Enter the project name to delete a todo: ");
      const todoIndex = prompt("Enter the todo index to delete: ") - 1;
      app.removeTodoFromProject(projectNameForRemoval, todoIndex);
      console.log(`Todo at index ${todoIndex + 1} removed from project "${projectNameForRemoval}".`);
      break;
    case "6":
      console.log("Exiting...");
      return;
    default:
      console.log("Invalid choice. Please try again.");
      break;
  }

  mainMenu(); // Recursively call the menu for further interaction
};

export default mainMenu;
