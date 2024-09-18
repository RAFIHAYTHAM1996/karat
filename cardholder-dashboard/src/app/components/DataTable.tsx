"use client";

import { useContext, useEffect, useMemo } from "react";
import { useIntl } from "react-intl";
import Stripe from "stripe";

import { AppContext } from "@/app/contexts/app";
import { LoadMore, Spinner } from "@/app/components";
import { MERCHANT_CATEGORIES } from "@/app/config/constants";
import { useTableData } from "@/app/hooks";
import { currencyFormatter } from "@/app/utils";

const getStatusValue = (status?: boolean) => {
  if (typeof status === "boolean") return status ? "Approved" : "Declined";
  return "";
};

export const DataTable = ({
  onTableDataLoaded,
}: {
  onTableDataLoaded: () => any;
}) => {
  const { tableDataLoaded } = useContext(AppContext);
  const currentDate = useMemo(() => new Date(), []);
  const intl = useIntl();

  const {
    data: tableData,
    fetch: fetchTableData,
    hasMore,
    isLoading: isTableDataLoading,
  } = useTableData();

  useEffect(() => {
    fetchTableData().finally(onTableDataLoaded);
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">
        Authorizations (A) & Transactions (T)
      </h1>
      <table>
        <thead>
          <tr>
            <td>Type</td>
            <td className="date">Date</td>
            <td>Merchant</td>
            <td>Category</td>
            <td>Status</td>
            <td colSpan={2}>Amount</td>
          </tr>
        </thead>
        <tbody>
          {tableData &&
            tableData.map((row) => {
              const txDate = new Date(row.created * 1000);
              return (
                <tr key={`tx-${row.id}`}>
                  <td>{row.object === "issuing.authorization" ? "A" : "T"}</td>
                  <td className="date">
                    {intl.formatDate(txDate, {
                      month: "short",
                      day: "numeric",
                      year:
                        txDate.getFullYear() === currentDate.getFullYear()
                          ? undefined
                          : "numeric",
                    })}
                  </td>
                  <td>{row.merchant_data.name}</td>
                  <td>
                    {(
                      MERCHANT_CATEGORIES[row.merchant_data.category] ?? ""
                    ).slice(0, 30)}
                  </td>
                  <td>{getStatusValue(row.approved)}</td>
                  <td>{currencyFormatter(Math.abs(row.amount) / 100)}</td>
                  <td>{row.currency.toUpperCase()}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
      {isTableDataLoading ? (
        <Spinner />
      ) : (
        <LoadMore
          action={fetchTableData}
          disabled={!hasMore || !tableDataLoaded}
        />
      )}
    </div>
  );
};
