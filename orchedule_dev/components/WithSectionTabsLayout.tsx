'use client';

import { usePathname } from 'next/navigation';
import SectionTabs from '@/components/SectionTabs';

interface WithSectionTabsLayoutProps {
  children: React.ReactNode;
  tabs: { name: string; href: string }[];
  hideCondition?: (pathname: string) => boolean;
}

export default function WithSectionTabsLayout({
  children,
  tabs,
  hideCondition,
}: WithSectionTabsLayoutProps) {
  const pathname = usePathname();
  const hideTabs = hideCondition?.(pathname) ?? false;

  return (
    <div>
      {!hideTabs && (
        <div className="hidden md:block px-4 pt-4">
          <SectionTabs tabs={tabs} />
        </div>
      )}
      <div
        className={`px-4 ${hideTabs ? 'pt-2' : 'mt-4 pt-1'} md:mt-8 min-h-[calc(100vh-200px)]`}
      >
        {children}
      </div>
    </div>
  );
}
