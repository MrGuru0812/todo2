'use strict';
class Todo {

    constructor(form, input, todoList, todoCompleted) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.todoCompleted = document.querySelector(todoCompleted);
        this.todoData = new Map(JSON.parse(localStorage.getItem('todoList'))); //подгружаем из localStorage
    }

    addToStorage() {
        localStorage.setItem('todoList', JSON.stringify([...this.todoData])); // добавляем в localStorage
    }
    render() {
        this.todoCompleted.textContent = '';
        this.todoList.textContent = '';
        this.input.value = '';
        this.todoData.forEach(this.createItem, this);
        this.addToStorage();
    }
    createItem(todo)  {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.key = todo.key;
        li.insertAdjacentHTML('beforeend', `
            <span class="text-todo">${todo.value}</span>
		    <div class="todo-buttons">
			        <button class="todo-remove"></button>
				    <button class="todo-complete"></button>
            </div>
        `);
        if (todo.completed) {
            this.todoCompleted.append(li);
        } else {
            this.todoList.append(li);
        }
    }

    addTodo(e) { //создаем новое дело
        e.preventDefault();
        if (this.input.value.trim()) {
            const newTodo = {
                value: this.input.value,
                completed: false,
                key: this.generateKey(),
            };
            this.todoData.set(newTodo.key, newTodo);
            this.render();
        } else {
            alert('Введите дело в поле ввода!');
        }

    }

    generateKey() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    deleteItem(key) {
        this.todoData.delete(key);
        this.render();
    }

    completedItem(key) {
        this.todoData.forEach(item => {
            if (item.key === key) {
                item.completed = !item.completed;
                this.render();
            }
        });
    }

    handler() {
        const todoContainer = document.querySelector('.todo-container');
        todoContainer.addEventListener('click', e => {
            if (e.target.matches('.todo-complete')) {
                this.completedItem(e.target.parentNode.offsetParent.key);

            } else if (e.target.matches('.todo-remove')) {
                this.deleteItem(e.target.parentNode.offsetParent.key);
            }
        });
    }

    init() {
        this.form.addEventListener('submit', this.addTodo.bind(this));
        this.render();
    }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');

todo.init();
todo.handler();
