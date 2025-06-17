// import mainMenu from "./Modules/consoleApp.js"
import '../assets/styles.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import UI from './Modules/UI'
import TodoApp from './Modules/TodoApp';
document.addEventListener('DOMContentLoaded', async () => {
  const ui = new UI();
  await ui.loadHomepage();
  
  // Setup mobile sidebar functionality
  setupMobileSidebar();
  
  // Update date display
  const dateTimeEle = document.getElementById("currentDatetime");
  const currDate = new Date();
  dateTimeEle.innerText = currDate.toLocaleDateString();
});

function setupMobileSidebar() {
  // Create hamburger menu element
  const hamburgerMenu = document.createElement('i');
  hamburgerMenu.className = 'fas fa-bars hamburger-menu';
  
  // Add hamburger to header's left section
  const headerLeftSection = document.querySelector('.header-left-section');
  headerLeftSection.insertBefore(hamburgerMenu, headerLeftSection.firstChild);
  
  // Create overlay element
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  document.body.appendChild(overlay);
  
  // Add click event for hamburger menu
  hamburgerMenu.addEventListener('click', toggleSidebar);
  
  // Add click event for overlay to close sidebar
  overlay.addEventListener('click', closeSidebar);
  
  // Function to toggle sidebar
  function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
    
    // Toggle hamburger icon between bars and X
    if (sidebar.classList.contains('open')) {
      hamburgerMenu.className = 'fas fa-times hamburger-menu';
    } else {
      hamburgerMenu.className = 'fas fa-bars hamburger-menu';
    }
  }
  
  // Function to close sidebar
  function closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    hamburgerMenu.className = 'fas fa-bars hamburger-menu';
  }
  
  // Close sidebar when clicking on a project (better UX on mobile)
  const projectsList = document.querySelector('.projects-list');
  projectsList.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
      // Check if clicked element is a project button or part of it
      if (e.target.closest('.button-project')) {
        closeSidebar();
      }
    }
  });
  
  // Close sidebar when window resizes above mobile breakpoint
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      closeSidebar();
    }
  });
}