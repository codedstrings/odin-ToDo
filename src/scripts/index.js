// import mainMenu from "./Modules/consoleApp.js"
import '../assets/styles.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import UI from './Modules/UI'
import TodoApp from './Modules/TodoApp';
document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();
    ui.loadHomepage();
  });
// mainMenu(); //use to call the consoleApp(uncomment import statement).
