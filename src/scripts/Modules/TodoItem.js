export default class TodoItem {
    constructor(title, description, dueDate, priority) {
      this.title = title;
      this.description = description;
      this.dueDate = dueDate;
      this.priority = priority;
      this.completed = false; // This can be toggled later
    }
  
    toggleComplete() {
      this.completed = !this.completed;
    }
  
    updateDetails(newTitle, newDescription, newDueDate, newPriority) {
      this.title = newTitle || this.title;
      this.description = newDescription || this.description;
      this.dueDate = newDueDate || this.dueDate;
      this.priority = newPriority || this.priority;
    }
  }
  