import taskData from '../mockData/tasks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let tasks = [...taskData];

const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.Id === parseInt(id, 10));
    if (!task) {
      throw new Error('Task not found');
    }
    return { ...task };
  },

  async create(taskData) {
    await delay(400);
    const newTask = {
      ...taskData,
      Id: Math.max(...tasks.map(t => t.Id), 0) + 1,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, updates) {
    await delay(300);
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    const updatedTask = {
      ...tasks[index],
      ...updates,
      completedAt: updates.completed ? new Date().toISOString() : null
    };
    
    // Don't allow Id modification
    delete updatedTask.Id;
    tasks[index] = { ...tasks[index], ...updatedTask };
    
    return { ...tasks[index] };
  },

  async delete(id) {
    await delay(250);
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Task not found');
    }
    const deletedTask = tasks[index];
    tasks.splice(index, 1);
    return { ...deletedTask };
  },

  async getByCategory(categoryId) {
    await delay(200);
    return tasks.filter(t => t.categoryId === categoryId).map(t => ({ ...t }));
  },

  async markComplete(id) {
    return this.update(id, { completed: true });
  },

  async markIncomplete(id) {
    return this.update(id, { completed: false });
  },

  async getCompletedToday() {
    await delay(200);
    const today = new Date().toDateString();
    return tasks.filter(t => 
      t.completed && 
      t.completedAt && 
      new Date(t.completedAt).toDateString() === today
    ).map(t => ({ ...t }));
  },

  async search(query) {
    await delay(300);
    const lowercaseQuery = query.toLowerCase();
    return tasks.filter(t => 
      t.title.toLowerCase().includes(lowercaseQuery) ||
      t.description.toLowerCase().includes(lowercaseQuery)
    ).map(t => ({ ...t }));
  }
};

export default taskService;