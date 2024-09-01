class Project {
    constructor(name) {
        this.name = name;
        this.todos = [];
    }
    addTodo(todo) {
        this.todos.push(todo);
    }
    removeTodo(index) {
        if (index >= 0 && index < this.todos.length) {
            this.todos.splice(index, 1);
        } else {
            console.log("Invalid index.");
        }
    }
    getTodos() {
        return this.todos;
      }
}
export default Project;