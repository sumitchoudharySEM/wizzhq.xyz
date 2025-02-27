import BountyLayout from '@/components/bounties/bounties_layout';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <BountyLayout isDashboard>{children}</BountyLayout>;
}