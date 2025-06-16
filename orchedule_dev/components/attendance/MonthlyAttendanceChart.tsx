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
  const [isLoading, setIsLoading] = useState(true); // 🔹 로딩 상태 추가

  useEffect(() => {
    if (!seasonId || !userId) return;

    const fetchMonthlyData = async () => {
      setIsLoading(true); // 🔹 로딩 시작
      try {
        const res = await fetch(
          `/api/attendances/me/monthly?seasonId=${seasonId}`
        );
        if (!res.ok) throw new Error("월별 출석 데이터 요청 실패");

        const data: ChartData[] = await res.json();

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
      } finally {
        setIsLoading(false); // 🔹 로딩 끝
      }
    };

    fetchMonthlyData();
  }, [seasonId, userId]);

  // ✅ 로딩 중일 때 별도 메시지 출력
  if (isLoading) {
    return (
      <div className="text-[#a79c90] text-sm text-center py-6 w-full">
        ⏳ 출석 통계를 불러오는 중이에요...
      </div>
    );
  }

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
