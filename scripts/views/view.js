import Task from "../models/model.js";

function View(ulElement, divLi, actions) {
    this.element = ulElement;
    this.divLi = divLi;
    this.deletingListener = actions.onDeleting;
    this.editingListener = actions.onEditing;
    this.returnForLable = actions.backForLabel;
    this.checkTask = actions.onChecking
}

View.prototype.render = function (taskList = []) {
    this.clear();

    const fragment = document.createDocumentFragment();

    taskList.forEach(function (task) {
        let id = task.id;
        let index = taskList.findIndex(function (task) {
            return task.id === id;
        });

        let li = document.createElement('li');

        let divView = document.createElement('div');
        divView.classList.add('view');

        let divDescription = document.createElement('div');
        divDescription.classList.add('description');

        let inpCheck = document.createElement('input');
        inpCheck.classList.add('toggle');
        inpCheck.setAttribute('id', `${index + 'ch'}`);
        inpCheck.setAttribute('type', 'checkbox');
        inpCheck.addEventListener('click', function () {
            this.checkTask(index);
        }.bind(this));

        let label = document.createElement('label');
        label.classList.add('label-text');
        label.setAttribute('id', `${index}`);
        label.setAttribute('for', `${index + 'ch'}`);
        label.insertAdjacentText('afterbegin', `${task.value}`);

        let inputTsk = document.createElement('input');
        inputTsk.classList.add('task-text');
        inputTsk.setAttribute('id', `${index + 'i'}`);
        inputTsk.setAttribute('style', 'border: none;');
        inputTsk.setAttribute('maxlength', '33');
        inputTsk.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                this.returnForLable(inputTsk.value, index);
            };
        }.bind(this));


        let divButton = document.createElement('div');
        divButton.classList.add('button-edit');

        let buttonEdit = document.createElement('button');
        buttonEdit.classList.add('edit-btn');
        let iconEdit = document.createElement('i');
        iconEdit.className = 'far fa-edit';
        buttonEdit.addEventListener('click', function () {
            this.editingListener(index);
        }.bind(this));

        let buttonDelete = document.createElement('button');
        buttonDelete.classList.add('delete-btn');
        let iconDelete = document.createElement('i');
        iconDelete.className = 'fas fa-times';
        buttonDelete.addEventListener('click', function () {
            this.deletingListener(task.id);
        }.bind(this)); 
        

        buttonDelete.append(iconDelete);
        buttonEdit.append(iconEdit);
        divButton.append(buttonEdit, buttonDelete);
        divDescription.append(inpCheck, label, inputTsk);
        divView.append(divDescription, divButton);
        li.append(divView);
        fragment.appendChild(li);
    }.bind(this));

    this.divLi.appendChild(fragment);
};

View.prototype.createFooter = function (lengthTaskList) {
    let divFooter = document.createElement('div');
    divFooter.classList.add('footer');

    let spanDescript = document.createElement('span');
    spanDescript.classList.add('todo-count');
    spanDescript.insertAdjacentText('afterbegin', 'items left');
    let spanCount = document.createElement('span');
    spanCount.classList.add('counter');
    spanCount.insertAdjacentText('afterbegin', `${lengthTaskList}`);

    let ulFilters = document.createElement('ul');
    ulFilters.classList.add('filters');

    let liSelected = document.createElement('li');
    liSelected.classList.add('filter');
    let aSelected = document.createElement('a');
    aSelected.classList.add('selected');
    aSelected.setAttribute('href', '#');
    aSelected.insertAdjacentText('beforeend', 'All');
    liSelected.append(aSelected);

    let liActive = document.createElement('li');
    liActive.classList.add('filter');
    let aActive = document.createElement('a');
    aActive.setAttribute('href', '#');
    aActive.insertAdjacentText('beforeend', 'Active');
    liActive.append(aActive);

    let liCompleted = document.createElement('li');
    liCompleted.classList.add('filter');
    let aCompleted = document.createElement('a');
    aCompleted.setAttribute('href', '#');
    aCompleted.insertAdjacentText('beforeend', 'Completed');
    liCompleted.append(aCompleted);

    let buttonClrCompleted = document.createElement('button');
    buttonClrCompleted.classList.add('clear-completed');
    buttonClrCompleted.insertAdjacentText('beforeend', 'Clear completed');

    spanDescript.append(spanCount);
    ulFilters.append(liSelected);
    ulFilters.append(liActive);
    ulFilters.append(liCompleted);
    divFooter.append(spanDescript);
    divFooter.append(ulFilters);
    divFooter.append(buttonClrCompleted);


    this.element.append(divFooter);
    return divFooter;
};

View.prototype.onEditing = function (val, index) {
    const strTask = String(index);
    let label = document.querySelector(`[id=${CSS.escape(strTask)}]`);
    label.classList.remove('label-text');
    label.classList.add('hidden-label');
    let labelValue = val;
    let input = document.querySelector(`[id=${CSS.escape(strTask + 'i')}`);
    input.classList.remove('task-text');
    input.classList.add('label-text');
    input.value = labelValue;
    input.focus();
};

View.prototype.onChecking

View.prototype.clear = function() {
    this.divLi.replaceChildren();
};

View.prototype.delFooter = function() {
    const footer = document.querySelector('.footer');
    this.element.removeChild(footer);
};

export default View;