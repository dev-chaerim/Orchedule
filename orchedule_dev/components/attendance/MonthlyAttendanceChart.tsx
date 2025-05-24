"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";

interface ChartData {
  month: string;
  value: number;
}

interface Props {
  seasonId: string;
  userId: string;
}

export default function MonthlyAttendanceChart({ seasonId, userId }: Props) {
  const [monthlyData, setMonthlyData] = useState<ChartData[]>([]);

  useEffect(() => {
    if (!seasonId || !userId) return;

    const fetchMonthlyData = async () => {
      try {
        const res = await fetch(
          `/api/attendances/me/monthly?seasonId=${seasonId}`
        );
        if (!res.ok) throw new Error("월별 출석 데이터 요청 실패");

        const data: ChartData[] = await res.json();

        // ✅ 현재 월 기준 최근 5개월 구성
        const now = new Date();
        const currentMonth = now.getMonth() + 1;

        const recentMonths = Array.from({ length: 5 }, (_, i) => {
          const month = currentMonth - (4 - i);
          return month > 0 ? { month: `${month}월`, value: 0 } : null;
        }).filter(Boolean) as ChartData[];

        const finalChartData = recentMonths.map((m) => {
          const match = data.find((d) => d.month === m.month);
          return match || m;
        });

        setMonthlyData(finalChartData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMonthlyData();
  }, [seasonId, userId]);

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart
        data={monthlyData}
        barCategoryGap={25}
        margin={{ top: 30, bottom: 10 }}
      >
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: "#7e6a5c" }}
          axisLine={false}
          tickLine={false}
          interval={0}
          height={30}
          textAnchor="middle"
        />
        <YAxis hide />
        <Bar dataKey="value" fill="#a88f7d" radius={[4, 4, 0, 0]} barSize={16}>
          <LabelList
            dataKey="value"
            position="top"
            fill="#3e3232"
            fontSize={12}
            dy={-2}
            formatter={(v: number) => (v > 0 ? v : "")}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
