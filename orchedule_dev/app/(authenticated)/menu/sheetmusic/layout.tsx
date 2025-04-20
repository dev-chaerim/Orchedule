'use client';

import { scoreTabs } from '@/constants/sectionTabs';
import WithSectionTabsLayout from '@/components/WithSectionTabsLayout';

export default function SheetmusicLayout({ children }: { children: React.ReactNode }) {
  return (
    <WithSectionTabsLayout tabs={scoreTabs}>
      {children}
    </WithSectionTabsLayout>
  );
}
