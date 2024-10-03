// import mainMenu from "./Modules/consoleApp.js"
import '../assets/styles.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import UI from './Modules/UI'
import TodoApp from './Modules/TodoApp';
document.addEventListener('DOMContentLoaded', () => {
    // const app = new TodoApp();
    const ui = new UI();  // Pass the app instance to the UI constructor
    ui.loadHomepage();  // Call instance method
  });
// mainMenu(); //use to call the consoleApp(uncomment import statement).
