'use client';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import QueueManagement from '@/components/dashboard/QueueManagement';

export default function QueuePage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <QueueManagement />
      </div>
    </DashboardLayout>
  );
}
