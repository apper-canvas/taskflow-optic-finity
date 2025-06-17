import TaskList from '@/components/pages/TaskList';

export const routes = {
  tasks: {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
    component: TaskList
  }
};

export const routeArray = Object.values(routes);
export default routes;