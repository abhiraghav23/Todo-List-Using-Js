// Helper function to retrieve tasks from local storage
function getTasks() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

// Helper function to save tasks to local storage
function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to render tasks based on their status (Today, Future, Completed)
function renderTasks() {
  const tasks = getTasks();
  const today = new Date().toISOString().split('T')[0];  // Get today's date in 'YYYY-MM-DD' format

  const todayTasks = tasks.filter(task => task.date === today && !task.completed);
  const futureTasks = tasks.filter(task => task.date > today && !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  // Clear previous task lists
  document.getElementById('today-tasks-list').innerHTML = '';
  document.getElementById('future-tasks-list').innerHTML = '';
  document.getElementById('completed-tasks-list').innerHTML = '';

  // Render Today's Tasks
  todayTasks.forEach(task => {
      const li = createTaskListItem(task);
      document.getElementById('today-tasks-list').appendChild(li);
  });

  // Render Future Tasks
  futureTasks.forEach(task => {
      const li = createTaskListItem(task);
      document.getElementById('future-tasks-list').appendChild(li);
  });

  // Render Completed Tasks
  completedTasks.forEach(task => {
      const li = createTaskListItem(task, true);
      document.getElementById('completed-tasks-list').appendChild(li);
  });
}

// Function to create a task list item
function createTaskListItem(task, completed = false) {
  const li = document.createElement('li');
  li.classList.add(completed ? 'completed' : 'pending');
  
  const taskText = document.createTextNode(`${task.name} - ${task.date} - Priority: ${task.priority}`);
  const completeButton = document.createElement('button');
  completeButton.textContent = completed ? 'Undo' : 'Complete';
  completeButton.onclick = () => toggleComplete(task);

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.onclick = () => deleteTask(task);

  li.appendChild(taskText);
  li.appendChild(completeButton);
  li.appendChild(deleteButton);

  return li;
}

// Function to add a new task
function addTask() {
  const name = document.getElementById('task-name').value;
  const date = document.getElementById('task-date').value;
  const priority = document.getElementById('task-priority').value;

  if (name && date) {
      const newTask = {
          name,
          date,
          priority,
          completed: false,
      };

      const tasks = getTasks();
      tasks.push(newTask);
      saveTasks(tasks);

      renderTasks();
      clearInputs();
  }
}

// Function to toggle the completion status of a task
function toggleComplete(task) {
  const tasks = getTasks();
  const taskToUpdate = tasks.find(t => t.name === task.name && t.date === task.date);

  if (taskToUpdate) {
      taskToUpdate.completed = !taskToUpdate.completed;
      saveTasks(tasks);
      renderTasks();
  }
}

// Function to delete a task
function deleteTask(task) {
  const tasks = getTasks();
  const updatedTasks = tasks.filter(t => t.name !== task.name || t.date !== task.date);

  saveTasks(updatedTasks);
  renderTasks();
}

// Function to clear the input fields after adding a task
function clearInputs() {
  document.getElementById('task-name').value = '';
  document.getElementById('task-date').value = '';
  document.getElementById('task-priority').value = 'high';
}

// Event listener for the "Add Item" button
document.getElementById('add-item-btn').addEventListener('click', addTask);

// Initial render of tasks when the page loads
renderTasks();
