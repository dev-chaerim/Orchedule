'use client';

import { noticeTabs } from '@/constants/sectionTabs';
import WithSectionTabsLayout from '@/components/WithSectionTabsLayout';

export default function NoticeLayout({ children }: { children: React.ReactNode }) {
  return (
    <WithSectionTabsLayout
      tabs={noticeTabs}
      hideCondition={(pathname) =>
        pathname?.startsWith('/menu/notice/announcement/') &&
        pathname.split('/').length > 4
      }
    >
      {children}
    </WithSectionTabsLayout>
  );
}
