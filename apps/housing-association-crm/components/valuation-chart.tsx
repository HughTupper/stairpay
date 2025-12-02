"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ValuationChartProps = {
  data: {
    date: string;
    value: number;
  }[];
};

export function ValuationChart({ data }: ValuationChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`} />
        <Tooltip
          formatter={(value: number) =>
            `£${value.toLocaleString("en-GB", {
              maximumFractionDigits: 0,
            })}`
          }
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
