// js/script.js

document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const noTaskMessage = document.getElementById('noTaskMessage');
    const filterAllBtn = document.getElementById('filterAllBtn');
    const filterActiveBtn = document.getElementById('filterActiveBtn');
    const filterCompletedBtn = document.getElementById('filterCompletedBtn');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');
    const deleteAllBtn = document.getElementById('deleteAllBtn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';

    // Fungsi untuk menampilkan/menyembunyikan pesan "Tidak ada tugas"
    function toggleNoTaskMessage() {
        if (tasks.length === 0) {
            noTaskMessage.style.display = 'block';
        } else {
            noTaskMessage.style.display = 'none';
        }
    }

    // Fungsi untuk menyimpan tugas ke Local Storage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        toggleNoTaskMessage(); 
    }

    // Fungsi untuk render (menampilkan) daftar tugas
    function renderTasks() {
        taskList.innerHTML = ''; 

        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'active') {
                return !task.completed;
            } else if (currentFilter === 'completed') {
                return task.completed;
            }
            return true; 
        });

        if (filteredTasks.length === 0 && tasks.length > 0) {
            noTaskMessage.style.display = 'none';
        } else if (tasks.length === 0) {
             noTaskMessage.style.display = 'block';
        } else {
             noTaskMessage.style.display = 'none';
        }


        filteredTasks.forEach((task, index) => {
            const listItem = document.createElement('li');
            listItem.setAttribute('data-id', task.id);
            if (task.completed) {
                listItem.classList.add('completed');
            }

            const taskTextSpan = document.createElement('span');
            taskTextSpan.textContent = task.text;
            listItem.appendChild(taskTextSpan);

            if (task.dueDate) {
                const dueDateSpan = document.createElement('span');
                dueDateSpan.classList.add('task-due-date');
                const date = new Date(task.dueDate + 'T00:00:00'); 
                dueDateSpan.textContent = date.toLocaleDateString('id-ID');
                listItem.appendChild(dueDateSpan);
            }

            const actionsDiv = document.createElement('div');
            actionsDiv.classList.add('task-actions');

            const completeBtn = document.createElement('button');
            completeBtn.innerHTML = task.completed ? '&#10003;' : '&#x25CB;'; 
            completeBtn.title = task.completed ? 'Batalkan Selesai' : 'Tandai Selesai';
            completeBtn.addEventListener('click', () => toggleComplete(task.id));
            actionsDiv.appendChild(completeBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '&#128465;'; 
            deleteBtn.title = 'Hapus Tugas';
            deleteBtn.addEventListener('click', () => deleteTask(task.id));
            actionsDiv.appendChild(deleteBtn);

            listItem.appendChild(actionsDiv);
            taskList.appendChild(listItem);
        });
        saveTasks(); 
    }

    // Fungsi untuk menambah tugas baru
    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        const dueDate = dueDateInput.value; 

        // Validasi input
        if (taskText === '') {
            alert('Tugas tidak boleh kosong!');
            return;
        }

        const newTask = {
            id: Date.now(), 
            text: taskText,
            dueDate: dueDate,
            completed: false
        };

        tasks.push(newTask);
        taskInput.value = '';
        dueDateInput.value = ''; 
        renderTasks();
    });

    // Fungsi untuk menandai tugas selesai/belum selesai
    function toggleComplete(id) {
        const taskIndex = tasks.findIndex(task => task.id === id);
        if (taskIndex > -1) {
            tasks[taskIndex].completed = !tasks[taskIndex].completed;
            saveTasks();
            renderTasks();
        }
    }

    // Fungsi untuk menghapus tugas individual
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }

    // Fungsi untuk filter tugas
    function setFilter(filterType) {
        currentFilter = filterType;
        filterAllBtn.classList.remove('active');
        filterActiveBtn.classList.remove('active');
        filterCompletedBtn.classList.remove('active');

        // Tambahkan kelas 'active' ke tombol yang dipilih
        if (filterType === 'all') {
            filterAllBtn.classList.add('active');
        } else if (filterType === 'active') {
            filterActiveBtn.classList.add('active');
        } else if (filterType === 'completed') {
            filterCompletedBtn.classList.add('active');
        }
        renderTasks();
    }

    filterAllBtn.addEventListener('click', () => setFilter('all'));
    filterActiveBtn.addEventListener('click', () => setFilter('active'));
    filterCompletedBtn.addEventListener('click', () => setFilter('completed'));

    // Fungsi untuk menghapus tugas yang sudah selesai
    clearCompletedBtn.addEventListener('click', () => {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
    });

    // Fungsi untuk menghapus semua tugas
    deleteAllBtn.addEventListener('click', () => {
        if (confirm('Apakah Anda yakin ingin menghapus semua tugas?')) {
            tasks = [];
            saveTasks();
            renderTasks();
        }
    });

    // Render tugas saat halaman pertama kali dimuat
    renderTasks();
});