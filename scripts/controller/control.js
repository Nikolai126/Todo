import View from "../views/view.js";
import Task from "../models/model.js";


const ulElement = document.querySelector('.list');
const divLi = document.querySelector('.Li');
const input = document.querySelector('.newTask');


function App() {
    this.taskList = [...this.LocalStorageTasks()];
    this.renderList = this.LocalStorageRenderList();
    this.completedList = [...this.LocalStorageCompletedList()];
    this.activeList = [...this.LocalStorageActiveList()]
    this.view = new View (ulElement, divLi, {
        onDeleting: (function (id) {this.deleting(id)}).bind(this),
        onEditing: (function (id) {this.editing(id)}).bind(this),
        backForLabel: (function (valueInput, id) {this.returnForLabel(valueInput, id)}).bind(this),
        onChecking: (function (id) {this.checking(id)}).bind(this),
        onCheckingAll: (function () {this.checkAllTasks()}).bind(this),
        onClrCompleted: (function () {this.clearCompletedTasks()}).bind(this),
        onActive: (function () {this.showActive()}).bind(this),
        showCompletedTaskList: (function () {this.completedTaskList()}).bind(this),
    })
};

App.prototype.init = function () {
    this.LocalStorageSetRender();
    input.addEventListener('keydown', function (e) {
        if (e.key === "Enter" && !(/^ *$/.test(input.value))) {
            this.addTask(e.target.value);
            input.value = '';
        };
    }.bind(this));
    this.clickFilters();
};

App.prototype.addTask = function (inputVal) {
    inputVal = inputVal.replace(/ +/g, " ").trim();
    const task = new Task(Date.now(), inputVal);
    this.taskList.push(task);
    let lengthTaskList = this.taskList.length;
    this.LocalStorageSetRender();
};

App.prototype.deleting = function (id) {
    const task = this.taskList.findIndex(function (task) {
        return task.id === id;
    });
    this.taskList.splice(task, 1);
    this.LocalStorageSetRender();
};

App.prototype.editing = function (id) {
    const task = this.taskList.find(function (task) {
        return task.id === id;
    });
    let val = task.value;
    this.view.onEditing(val, task.id);
};

App.prototype.checking = function (id) {
    const index = this.taskList.findIndex(function (task) {
        return task.id === id;
    });
    this.taskList[index].completed = !this.taskList[index].completed;
    this.LocalStorageSetRender();
};

App.prototype.checkAllTasks = function () {
    if (this.taskList != []) {
        this.taskList.forEach(function (task) {
            task.completed = true;
        });
    }
    
    this.LocalStorageSetRender();
};


App.prototype.returnForLabel = function (valueInput, id) {
    const task = this.taskList.find(function (task) {
        return task.id === id;
    });
    task.value = valueInput;
    if (task.value == '') {
        this.deleting(id);
    }
    this.LocalStorageSetRender();
};

App.prototype.clearCompletedTasks = function () {
    this.taskList = this.taskList.filter(function (task) {
        if (task.completed === false) {
            return true;
        }
    });
    this.LocalStorageSetRender();
};


//  LOCAL STORAGE


App.prototype.LocalStorageCompletedList = function() { 
    return (JSON.parse(localStorage.getItem('completedList')))
}

App.prototype.LocalStorageActiveList = function() { 
    return (JSON.parse(localStorage.getItem('activeList'))) || []
}

App.prototype.LocalStorageTasks = function() { 
    return (JSON.parse(localStorage.getItem('taskList'))) || []
}

App.prototype.LocalStorageRenderList = function() {
    return (JSON.parse(localStorage.getItem('renderList'))) || 'All'
}

App.prototype.showActive = function() {
    return this.taskList.filter(function(task) {
        return !task.completed;
    })
}

App.prototype.showAll = function() {
    let allTasks = this.taskList;
    return allTasks;
}

App.prototype.showCompleted = function() {
    return this.taskList.filter(function(task) {
        return task.completed;
    })
}

App.prototype.LocalStorageSetRender = function() {
    document.querySelector('.footer').setAttribute('style', 'display: flex;');
    const liAll = document.querySelector('#liAll');
    const liActive = document.querySelector('#liActive');
    const liCompleted = document.querySelector('#liCompleted');
    let completedList = this.showCompleted();
    let activeList = this.showActive();
    let allTasks = this.showAll();
    let listRender = [];
    if(this.renderList === 'Active') {
        listRender = [...activeList];
        liAll.classList.remove('selected');
        liCompleted.classList.remove('selected');
        liActive.classList.add('selected');
    } else if (this.renderList === 'Completed') {
        listRender = [...completedList];
        liActive.classList.remove('selected');
        liAll.classList.remove('selected');
        liCompleted.classList.add('selected');
    } else {
        listRender = [...allTasks];
        liActive.classList.remove('selected');
        liCompleted.classList.remove('selected');
        liAll.classList.add('selected');
    }
    
    localStorage.setItem('activeList', JSON.stringify(activeList))
    localStorage.setItem('renderList', JSON.stringify(this.renderList))
    localStorage.setItem('taskList', JSON.stringify(allTasks))
    localStorage.setItem('completedList', JSON.stringify(completedList))
    
    if (allTasks < 1) {
        document.querySelector('.footer').removeAttribute('style', 'display: flex;');
    }

    this.view.render(listRender);
}

App.prototype.clickFilters = function() {
    const filtersButtons = document.querySelector('.filters');
    filtersButtons.addEventListener('click', function(e) {
        console.log(filtersButtons);
        if(e.target.id === 'aActive') {
            this.renderList = "Active"
            console.log('Active:', this.renderList);
        } else if(e.target.id === 'aAll') {
            this.renderList = 'All'
            console.log('All:', this.renderList);
        } else if (e.target.id === 'aCompleted') {
            this.renderList = "Completed"
            console.log('Сompleted:', this.renderList);
        }
        console.log(this.renderList);
        this.LocalStorageSetRender();

    }.bind(this))
}



export default App;