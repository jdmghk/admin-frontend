"use client";

import * as React from "react";
import {
  Label,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const ticketSalesChartConfig = {
  mobile: {
    label: "Remaining",
    color: "#4D44B51A",
  },
  desktop: {
    label: "Sold",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function TicketSales({
  total_sold,
  total_remaining,
}: {
  total_sold: number;
  total_remaining: number;
}) {
  const total = total_sold + total_remaining;

  return (
    <Card className='flex flex-col shadow-none border-none'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Total Ticket sales</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className='flex flex-1 items-center pb-0'>
        <ChartContainer
          config={ticketSalesChartConfig}
          className='mx-auto aspect-square w-full max-w-[250px]'
        >
          <RadialBarChart
            data={[
              { name: "type", sold: total_sold, remaining: total_remaining },
            ]}
            startAngle={0}
            endAngle={360}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor='middle'>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className='fill-foreground text-2xl font-bold'
                        >
                          {total.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground'
                        >
                          Tickets
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey='sold'
              stackId='a'
              cornerRadius={5}
              fill='var(--color-desktop)'
              className='stroke-transparent stroke-2'
            />
            <RadialBar
              dataKey='remaining'
              fill='var(--color-mobile)'
              stackId='a'
              cornerRadius={5}
              className='stroke-transparent stroke-2'
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='leading-none text-muted-foreground'>
          Showing total tickets sales
        </div>
      </CardFooter>
    </Card>
  );
}

const chartConfig = {
  qty: {
    label: "Quantity",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function MonthlySales({
  data,
}: {
  data: { month: string; qty: number }[];
}) {
  return (
    <Card className='shadow-none border-none'>
      <CardHeader>
        <CardTitle>Monthly sales</CardTitle>
        <CardDescription>
          {data[0]?.month} - {data[data.length - 1]?.month} 2024
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='month'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey='qty' fill='var(--color-qty)' radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
