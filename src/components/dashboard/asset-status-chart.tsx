"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import type { Asset, AssetStatus } from "@/types";
import { useTheme } from "next-themes";
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "../ui/chart";

const chartConfig = {
  value: {
    label: "Assets",
  },
  "In Use": {
    label: "In Use",
    color: "hsl(var(--chart-1))",
  },
  "In Stock": {
    label: "In Stock",
    color: "hsl(var(--chart-2))",
  },
  "Maintenance": {
    label: "Maintenance",
    color: "hsl(var(--chart-3))",
  },
  "Retired": {
    label: "Retired",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

interface AssetStatusChartProps {
    assets: Asset[];
}

export function AssetStatusChart({ assets }: AssetStatusChartProps) {
  const { theme } = useTheme();
  const HSL_VARS = {
    light: {
      primary: "hsl(225 78% 66%)",
      secondary: "hsl(30 78% 66%)",
      foreground: "hsl(225 10% 10%)",
      muted_foreground: "hsl(225 10% 45%)",
    },
    dark: {
      primary: "hsl(225 78% 76%)",
      secondary: "hsl(30 78% 70%)",
      foreground: "hsl(210 40% 98%)",
      muted_foreground: "hsl(215 20% 65%)",
    },
  };
  const colors = theme === 'dark' ? HSL_VARS.dark : HSL_VARS.light;

  const statusCounts = assets.reduce(
    (acc, asset) => {
      const status = asset.status as AssetStatus;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<AssetStatus, number>
  );

  const chartData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="h-[300px] w-full">
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.5} />
            <XAxis 
              dataKey="name" 
              tickLine={false} 
              axisLine={false} 
              tick={{ fill: colors.muted_foreground, fontSize: 12 }} 
            />
            <YAxis 
              tickLine={false} 
              axisLine={false} 
              tick={{ fill: colors.muted_foreground, fontSize: 12 }} 
              width={30}
            />
            <Tooltip 
              cursor={{ fill: 'hsla(var(--accent) / 0.2)' }}
              content={<ChartTooltipContent />}
            />
            <Bar dataKey="value" fill={colors.primary} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
