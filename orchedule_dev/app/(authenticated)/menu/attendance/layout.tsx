"use client";

import { attendanceTabs } from "@/constants/sectionTabs";
import WithSectionTabsLayout from "@/components/layout/WithSectionTabsLayout";

export default function AttendanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WithSectionTabsLayout tabs={attendanceTabs}>
      {children}
    </WithSectionTabsLayout>
  );
}
