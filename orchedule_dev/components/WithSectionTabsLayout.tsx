'use client';

import { usePathname } from 'next/navigation';

interface WithSectionTabsLayoutProps {
  children: React.ReactNode;
  tabs: { name: string; href: string }[];
  hideCondition?: (pathname: string) => boolean;
}

export default function WithSectionTabsLayout({
    children,
    hideCondition,
  }: WithSectionTabsLayoutProps) {
    
    const pathname = usePathname();
    const hideTabs = hideCondition?.(pathname) ?? false;

    return (
      <div>
        <div
          className={`px-4 ${hideTabs ? 'pt-2' : 'mt-4 pt-1'} md:mt-8`}
        >
          {children}
        </div>
      </div>
    );
}
