import View from "../views/view.js";
import Task from "../models/model.js";

const ulElement = document.querySelector('.list');
const divLi = document.querySelector('.Li');
const input = document.querySelector('.newTask');


function App() {
    this.taskList = [];
    this.view = new View (ulElement, divLi, {
        onDeleting: (function (id) {this.deleting(id)}).bind(this),
        onEditing: (function (id) {this.editing(id)}).bind(this),
        backForLabel: (function (valueInput, index) {this.returnForLabel(valueInput, index)}).bind(this),
        onChecking: (function (index) {this.checking(index)}).bind(this)
    })
};

App.prototype.init = function () {
    input.addEventListener('keydown', function (e) {
        if (e.key === "Enter" && !(/^ *$/.test(input.value))) {
            this.addTask(e.target.value);
            input.value = '';
        };
    }.bind(this));
};

App.prototype.addTask = function (inputVal) {
    inputVal = inputVal.replace(/ +/g, " ").trim();
    const task = new Task(Date.now(), inputVal);
    this.taskList.push(task);
    let lengthTaskList = this.taskList.length;
    this.view.render(this.taskList, task.id);
    if (lengthTaskList > 0 && lengthTaskList < 2) {
        this.view.createFooter(lengthTaskList);
    };
};

App.prototype.deleting = function (id) {
    const task = this.taskList.findIndex(function (task) {
        return task.id === id;
    });
    this.taskList.splice(task, 1);
    let lengthTaskList = this.taskList.length;
    if(lengthTaskList < 1) {
        this.view.delFooter();
    }
    this.view.render(this.taskList);
};

App.prototype.editing = function (index) {
    let val = this.taskList[index].value;
    this.view.onEditing(val, index);
};

App.prototype.checking = function (index) {
    this.taskList[index].comlited = !this.taskList.comlited;
    if (this.taskList[index].comlited === true) {
        console.log('true');
    }
};

App.prototype.returnForLabel = function (valueInput, index) {
    this.taskList[index].value = valueInput;
    this.view.render(this.taskList);
};


export default App;