import AppLayout from '@/components/layout/app-layout';
import TaskDashboard from '@/components/tasks/task-dashboard';

export default function Home() {
  return (
    <AppLayout>
      <TaskDashboard />
    </AppLayout>
  );
}
