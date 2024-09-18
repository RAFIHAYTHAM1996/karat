import { DonutChart, List, ListItem } from "@tremor/react";
import { useMemo } from "react";

import { TransactionsSummary } from "@/app/api/types";
import {
    CHART_COLORS,
    CHART_MIN_SHARE,
    MERCHANT_CATEGORIES,
} from "@/app/config/constants";
import { classNames } from "@/app/utils";


export const ChartSection = ({ summaryData }: { summaryData: TransactionsSummary }) => {
    const chartData = useMemo(() => {
        // Generate data for categories with a share higher than threshold
        const data = summaryData.categories
            .filter(({ percentage }) => percentage >= CHART_MIN_SHARE)
            .slice(0, CHART_COLORS.length)
            .map(({ category, count, percentage }, index) => {
                return {
                    name: MERCHANT_CATEGORIES[category],
                    amount: percentage,
                    count,
                    color: `bg-${CHART_COLORS[index] ?? "cyan"}-500`,
                };
            });

        // Group the rest into one item
        const otherCategories = summaryData.categories
            .filter(({ percentage }) => percentage < CHART_MIN_SHARE)
            .reduce(
                (prev, curr) => ({
                    count: prev.count + curr.count,
                    percentage: prev.percentage + curr.percentage,
                }),
                { count: 0, percentage: 0 }
            );

        if (otherCategories.count > 0) {
            data.push({
                amount: otherCategories.percentage,
                color: `bg-${CHART_COLORS[data.length] ?? "cyan"}-500`,
                count: otherCategories.count,
                name: "...others",
            });
        }

        return data;
    }, [summaryData]);

    return (
        <>
            <h2 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                Transaction frequency by category
            </h2>
            <DonutChart
                className="mt-8"
                data={chartData}
                category="amount"
                index="name"
                valueFormatter={(val) => `${Number(val).toFixed(1)}%`}
                showLabel={false}
                colors={CHART_COLORS}
            />
            <p className="mt-8 flex items-center justify-between text-tremor-label text-tremor-content dark:text-dark-tremor-content">
                <span>Category</span>
                <span>Count / Percentage</span>
            </p>
            <List className="mt-2">
                {chartData.map((item) => (
                    <ListItem key={item.name} className="space-x-6">
                        <div
                            className="flex items-center space-x-2.5 truncate"
                            title={item.name}
                        >
                            <span
                                className={classNames(
                                    item.color,
                                    "size-2.5 shrink-0 rounded-sm"
                                )}
                                aria-hidden={true}
                            />
                            <span className="truncate dark:text-dark-tremor-content-emphasis">
                                {item.name}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="font-medium tabular-nums text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                {item.count}
                            </span>
                            <span className="rounded-tremor-small bg-tremor-background-subtle px-1.5 py-0.5 text-tremor-label font-medium tabular-nums text-tremor-content-emphasis dark:bg-dark-tremor-background-subtle dark:text-dark-tremor-content-emphasis">
                                {Number(item.amount).toFixed(1)}%
                            </span>
                        </div>
                    </ListItem>
                ))}
            </List></>
    )
}