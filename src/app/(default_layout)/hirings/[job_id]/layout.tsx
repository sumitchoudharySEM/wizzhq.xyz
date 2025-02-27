import JobLayout from '@/components/jobs/jobs_layout';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <JobLayout isDashboard>{children}</JobLayout>;
}