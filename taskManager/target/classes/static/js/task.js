document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();


    const form = document.getElementById('task-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const description = document.getElementById('description').value;
        const dueDate = document.getElementById('dueDate').value;
        const priority = document.getElementById('priority').value;


        if (!description || !dueDate || !priority) {
            showToast('Por favor, completa todos los campos.', 'danger');
            return;
        }

        const newTask = {
            description,
            completed: false,
            date: new Date().toISOString(),
            dueDate,
            priority
        };

        try {
            await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTask)
            });
            showToast('Tarea agregada con éxito', 'success');
            fetchTasks();
            form.reset();
        } catch (error) {
            showToast('Error al agregar tarea. Inténtalo nuevamente.', 'danger');
        }
    });
});


async function fetchTasks() {
    const response = await fetch('/api/tasks');
    const tasks = await response.json();
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        taskItem.id = `task-${task.id}`;


        const priorityClass = getPriorityClass(task.priority);
        const completedClass = task.completed ? 'badge-success' : 'badge-warning';
        const completedText = task.completed ? 'Completada' : 'Pendiente';

        taskItem.innerHTML = `
            <span class="${priorityClass}">${task.description}</span>
            <span>${formatDate(task.dueDate)}</span>
            <span class="badge badge-pill ${completedClass}">
                ${completedText}
            </span>
            <button class="btn btn-success btn-sm float-right ml-2" onclick="completeTask(${task.id})" ${task.completed ? 'disabled' : ''}>
                <i class="fa fa-check"></i> Completar
            </button>
            <button class="btn btn-danger btn-sm float-right" onclick="deleteTask(${task.id})">
                <i class="fa fa-trash"></i> Eliminar
            </button>
        `;
        taskList.appendChild(taskItem);
    });
}


function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}


function getPriorityClass(priority) {
    switch (priority) {
        case 'Alta': return 'text-danger';
        case 'Media': return 'text-warning';
        case 'Baja': return 'text-success';
        default: return '';
    }
}


async function completeTask(id) {

    const response = await fetch(`/api/tasks/${id}`);


    if (!response.ok) {
        showToast('Error al obtener la tarea. Inténtalo nuevamente.', 'danger');
        return;
    }


    const task = await response.json();
    task.completed = !task.completed;


    try {
        const updateResponse = await fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task) // Enviamos la tarea con el nuevo estado
        });


        if (!updateResponse.ok) {
            const errorText = await updateResponse.text();
            showToast(`Error al actualizar la tarea: ${errorText}`, 'danger');
            return;
        }


        updateTaskInUI(id, task.completed);
        showToast('Tarea actualizada correctamente', 'success');
    } catch (error) {

        showToast('Error al completar tarea. Inténtalo nuevamente.', 'danger');
    }
}



function updateTaskInUI(id, completed) {
    const taskItem = document.querySelector(`#task-${id}`);
    const badge = taskItem.querySelector('.badge');
    const button = taskItem.querySelector('.btn-success');
    const taskDescription = taskItem.querySelector('.task-description');


    if (completed) {
        badge.classList.remove('badge-warning');
        badge.classList.add('badge-success');
        badge.textContent = 'Completada';
        taskDescription.classList.add('task-completed');
        taskItem.classList.add('completed-task');
        button.disabled = true;
    } else {
        badge.classList.remove('badge-success');
        badge.classList.add('badge-warning');
        badge.textContent = 'Pendiente';
        taskDescription.classList.remove('task-completed');
        taskItem.classList.remove('completed-task');
        button.disabled = false;
    }
}
async function deleteTask(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta tarea?')) return;

    try {
        await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
        showToast('Tarea eliminada', 'success');
        fetchTasks();
    } catch (error) {
        showToast('Error al eliminar tarea. Inténtalo nuevamente.', 'danger');
    }
}


function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white ${type === 'success' ? 'bg-success' : 'bg-danger'}`;
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    toastContainer.appendChild(toast);
    const toastElement = new bootstrap.Toast(toast);
    toastElement.show();
}


document.getElementById('dark-mode-toggle').addEventListener('click', () => {
    const body = document.body;
    const isDarkMode = body.getAttribute('data-theme') === 'dark';
    if (isDarkMode) {
        body.removeAttribute('data-theme');
        document.getElementById('dark-mode-toggle').textContent = 'Cambiar a Modo Oscuro';
    } else {
        body.setAttribute('data-theme', 'dark');
        document.getElementById('dark-mode-toggle').textContent = 'Cambiar a Modo Claro';
    }
});

