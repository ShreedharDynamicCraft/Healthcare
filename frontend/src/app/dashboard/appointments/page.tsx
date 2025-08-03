'use client';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import AppointmentManagement from '@/components/dashboard/AppointmentManagement';

export default function AppointmentsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <AppointmentManagement />
      </div>
    </DashboardLayout>
  );
}
