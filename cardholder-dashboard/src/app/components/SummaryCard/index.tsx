import { Card, List, ListItem } from "@tremor/react";
import { useContext, useEffect, useMemo } from "react";

import { AppContext } from "@/app/contexts/app";
import { useTransactionsSummaryData } from "@/app/hooks";
import { currencyFormatter } from "@/app/utils";

import { Spinner } from "../Spinner";

import { ChartSection } from "./ChartSection";

export const SummaryCard = () => {
  const { tableDataLoaded } = useContext(AppContext)
  const {
    data: summaryData,
    fetch: fetchSummaryData,
    isLoading: isSummaryDataLoading,
  } = useTransactionsSummaryData();

  // Only runs once since `tableDataLoaded` is only switched from `false` to `true` once
  useEffect(() => {
    if (tableDataLoaded) fetchSummaryData();
  }, [tableDataLoaded]);

  const shouldShowSpinner = useMemo(() => !tableDataLoaded || isSummaryDataLoading, [tableDataLoaded, isSummaryDataLoading])

  const accountSummary = useMemo(
    () =>
      !shouldShowSpinner && summaryData
      && [
        { name: "Total Spend", amount: summaryData.sum },
        { name: "Average Spend", amount: summaryData.average },
      ],
    [summaryData, shouldShowSpinner]
  );

  return (
    <Card className="sm:mx-auto sm:max-w-lg summary-card">
      <h2 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
        Transactions Summary
      </h2>
      {shouldShowSpinner && <Spinner />}
      {accountSummary && summaryData && (
        <>
          <List className="mt-2">
            {accountSummary.map((item) => (
              <ListItem key={item.name} className="space-x-6">
                <div
                  className="flex items-center space-x-2.5 truncate"
                  title={item.name}
                >
                  <span className="truncate dark:text-dark-tremor-content-emphasis">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium tabular-nums text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    {currencyFormatter(item.amount)}
                  </span>
                </div>
              </ListItem>
            ))}
          </List>
          <br />
          <ChartSection summaryData={summaryData} />
        </>
      )}
    </Card>
  );
};
