import Task from "../models/model.js";

function View(ulElement, divLi, actions) {
    this.element = ulElement;
    this.divLi = divLi;
    this.deletingListener = actions.onDeleting;
    this.editingListener = actions.onEditing;
    this.returnForLable = actions.backForLabel;
    this.checkTask = actions.onChecking;
    this.checkAllTasks = actions.onCheckingAll;
    this.clearCompletedTasks = actions.onClrCompleted;
    this.activeTaskList = actions.onActive;
    this.completedTaskList = actions.showCompletedTaskList;
}

View.prototype.render = function (taskList = []) {

    this.divLi.replaceChildren();
    
    let lengthTaskList = taskList.length;

    const fragment = document.createDocumentFragment();

    let completed = 0;

    taskList.forEach(function (task) {

        let li = document.createElement('li');

        let divView = document.createElement('div');
        divView.classList.add('view');

        let divDescription = document.createElement('div');
        divDescription.classList.add('description');

        let inpCheck = document.createElement('input');
        inpCheck.classList.add('toggle');
        inpCheck.setAttribute('id', `${task.id + 'ch'}`);
        inpCheck.setAttribute('type', 'checkbox');
        inpCheck.addEventListener('click', function (e) {
            e.preventDefault();
            this.checkTask(task.id);
        }.bind(this));

        let label = document.createElement('label');
        label.classList.add('label-text');
        label.setAttribute('id', `${String(task.id)}`);
        label.setAttribute('for', `${task.id + 'ch'}`);
        label.insertAdjacentText('afterbegin', `${task.value}`);

        if (task.completed) {
            let onCheking = function () {
                label.setAttribute('style', 'text-decoration: line-through;');
                inpCheck.checked = true;
            }
            onCheking();
        }
        else if (label.hasAttribute('style')) {
            let delAttribute = function () {
                label.removeAttribute('style');
                inpCheck.checked = false;
            }
            delAttribute();
        }


        let inputTsk = document.createElement('input');
        inputTsk.classList.add('task-text');
        inputTsk.setAttribute('id', `${task.id + 'i'}`);
        inputTsk.setAttribute('style', 'border: none;');
        inputTsk.setAttribute('maxlength', '33');
        inputTsk.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                console.log(inputTsk.value);
                this.returnForLable(inputTsk.value, task.id);
            };
        }.bind(this));
        
    
        let divButton = document.createElement('div');
        divButton.classList.add('button-edit');

        let buttonEdit = document.createElement('button');
        buttonEdit.classList.add('edit-btn');
        let iconEdit = document.createElement('i');
        iconEdit.className = 'far fa-edit';
        buttonEdit.addEventListener('click', function () {
            this.editingListener(task.id);
        }.bind(this));

        let buttonDelete = document.createElement('button');
        buttonDelete.classList.add('delete-btn');
        let iconDelete = document.createElement('i');
        iconDelete.className = 'fas fa-times';
        buttonDelete.addEventListener('click', function () {
            const deleteTask = this.deletingListener;

            this.createModal().then(function () {
                deleteTask(task.id);
                document.querySelector('#popup').removeAttribute('style');
            }).catch(function(e) {
                document.querySelector('#popup').removeAttribute('style');
            });
        }.bind(this)); 
        
        buttonDelete.append(iconDelete);
        buttonEdit.append(iconEdit);
        divButton.append(buttonEdit, buttonDelete);
        divDescription.append(inpCheck, label, inputTsk);
        divView.append(divDescription, divButton);
        li.append(divView);
        fragment.appendChild(li);

        if (task.completed == true) {
            completed += 1;
        }

    }.bind(this));

    document.querySelector('.Li').appendChild(fragment);
    
    if (completed > 0) {
        document.querySelector('.counter').textContent  = lengthTaskList - completed;
    }
    else {
        document.querySelector('.counter').textContent = lengthTaskList;
    }

    let that = this;
    document.querySelector('.clear-completed').addEventListener('click', function () {
        if (completed > 0) {
            that.createModal().then(function () {
                that.clearCompletedTasks();
                document.querySelector('#popup').removeAttribute('style');
            }).catch(function(e) {
                document.querySelector('#popup').removeAttribute('style');
            });
        }
        
    });

    document.querySelector('#completeAll').addEventListener('click', function() {
        if (taskList != []) {
            this.checkAllTasks(completed);
        }
    }.bind(this)); 
};

View.prototype.createModal = function () {
    document.querySelector('#popup').setAttribute('style', 'visibility: visible;');
    const buttonDelete = document.querySelector('#buttonDelete');
    const buttonCancel = document.querySelector('#buttonCancel');

    return new Promise(function(resolve, reject) {
        buttonDelete.addEventListener("click", function() {
            resolve()
        })
        buttonCancel.addEventListener("click", function() {
            reject()
        })
    })

};


View.prototype.onEditing = function (val, id) {
    let label = document.querySelector(`[id=${CSS.escape(id)}]`);
    label.classList.remove('label-text');
    label.classList.add('hidden-label');
    let labelValue = val;
    let input = document.querySelector(`[id=${CSS.escape(id + 'i')}`);
    input.classList.remove('task-text');
    input.classList.add('label-text');
    input.value = labelValue;
    input.focus();
};


export default View;