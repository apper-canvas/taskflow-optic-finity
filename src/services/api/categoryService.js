import categoryData from '../mockData/categories.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let categories = [...categoryData];

const categoryService = {
  async getAll() {
    await delay(200);
    return [...categories];
  },

  async getById(id) {
    await delay(150);
    const category = categories.find(c => c.Id === parseInt(id, 10));
    if (!category) {
      throw new Error('Category not found');
    }
    return { ...category };
  },

  async create(categoryData) {
    await delay(300);
    const newCategory = {
      ...categoryData,
      Id: Math.max(...categories.map(c => c.Id), 0) + 1,
      taskCount: 0
    };
    categories.push(newCategory);
    return { ...newCategory };
  },

  async update(id, updates) {
    await delay(250);
    const index = categories.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Category not found');
    }
    
    // Don't allow Id modification
    delete updates.Id;
    categories[index] = { ...categories[index], ...updates };
    
    return { ...categories[index] };
  },

  async delete(id) {
    await delay(200);
    const index = categories.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Category not found');
    }
    const deletedCategory = categories[index];
    categories.splice(index, 1);
    return { ...deletedCategory };
  },

  async updateTaskCount(categoryId, count) {
    return this.update(categoryId, { taskCount: count });
  }
};

export default categoryService;