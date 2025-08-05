class TodoApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.taskIdCounter = parseInt(localStorage.getItem('taskIdCounter')) || 1;
        
        this.initializeElements();
        this.bindEvents();
        this.render();
    }
    
    initializeElements() {
        this.taskInput = document.getElementById('taskInput');
        this.addButton = document.getElementById('addButton');
        this.taskList = document.getElementById('taskList');
        this.emptyState = document.getElementById('emptyState');
        this.totalTasks = document.getElementById('totalTasks');
        this.completedTasks = document.getElementById('completedTasks');
        this.pendingTasks = document.getElementById('pendingTasks');
        this.clearCompleted = document.getElementById('clearCompleted');
    }
    
    bindEvents() {
        this.addButton.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });
        this.clearCompleted.addEventListener('click', () => this.clearCompletedTasks());
        
        // Auto-focus on input
        this.taskInput.focus();
    }
    
    addTask() {
        const taskText = this.taskInput.value.trim();
        
        if (taskText === '') {
            this.shakeInput();
            return;
        }
        
        const newTask = {
            id: this.taskIdCounter++,
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        this.tasks.unshift(newTask); // Add to beginning for newest first
        this.taskInput.value = '';
        this.saveToStorage();
        this.render();
        
        // Add success animation to add button
        this.addButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.addButton.style.transform = 'scale(1)';
        }, 150);
    }
    
    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveToStorage();
            this.render();
        }
    }
    
    deleteTask(taskId) {
        const taskElement = document.querySelector(`[data-id="${taskId}"]`);
        if (taskElement) {
            taskElement.style.animation = 'taskSlideOut 0.3s ease-in-out';
            taskElement.addEventListener('animationend', () => {
                this.tasks = this.tasks.filter(t => t.id !== taskId);
                this.saveToStorage();
                this.render();
            });
        }
    }
    
    clearCompletedTasks() {
        const completedCount = this.tasks.filter(t => t.completed).length;
        if (completedCount === 0) return;
        
        if (confirm(`Are you sure you want to delete ${completedCount} completed task(s)?`)) {
            this.tasks = this.tasks.filter(t => !t.completed);
            this.saveToStorage();
            this.render();
        }
    }
    
    shakeInput() {
        this.taskInput.style.animation = 'shake 0.5s ease-in-out';
        this.taskInput.addEventListener('animationend', () => {
            this.taskInput.style.animation = '';
        });
    }
    
    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;
        
        this.totalTasks.textContent = total;
        this.completedTasks.textContent = completed;
        this.pendingTasks.textContent = pending;
        
        // Update clear button state
        this.clearCompleted.disabled = completed === 0;
    }
    
    render() {
        this.updateStats();
        
        if (this.tasks.length === 0) {
            this.taskList.style.display = 'none';
            this.emptyState.style.display = 'block';
            return;
        }
        
        this.taskList.style.display = 'block';
        this.emptyState.style.display = 'none';
        
        this.taskList.innerHTML = '';
        
        this.tasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            this.taskList.appendChild(taskElement);
        });
    }
    
    createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.setAttribute('data-id', task.id);
        
        li.innerHTML = `
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="todoApp.toggleTask(${task.id})">
                ${task.completed ? '<i class="fas fa-check"></i>' : ''}
            </div>
            <span class="task-text">${this.escapeHtml(task.text)}</span>
            <button class="delete-btn" onclick="todoApp.deleteTask(${task.id})" title="Delete task">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        return li;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    saveToStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        localStorage.setItem('taskIdCounter', this.taskIdCounter.toString());
    }
}

// Add CSS animation for shake effect
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 20%, 40%, 60%, 80%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    }
    
    @keyframes taskSlideOut {
        from {
            opacity: 1;
            transform: translateX(0);
            max-height: 100px;
            margin-bottom: 15px;
        }
        to {
            opacity: 0;
            transform: translateX(100px);
            max-height: 0;
            margin-bottom: 0;
            padding-top: 0;
            padding-bottom: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the app
const todoApp = new TodoApp();