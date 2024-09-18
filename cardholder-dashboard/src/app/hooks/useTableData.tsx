"use client";

import { useCallback, useState } from "react";
import Stripe from "stripe";

import { getAuthorizations } from "@/app/api/actions/getAuthorizations";
import { getTransactions } from "@/app/api/actions/getTransactions";
import { ClientData } from "@/app/types";

type TableRow =
  | Stripe.Issuing.Authorization
  | (Stripe.Issuing.Transaction & { approved?: boolean });

export const useTableData = (): ClientData<Array<TableRow>> & {
  hasMore?: boolean;
} => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMoreTransactions, setHasMoreTransactions] = useState(true);
  const [hasMoreAuthorizations, setHasMoreAuthorizations] = useState(true);
  const [tableData, setTableData] = useState<Array<TableRow>>([]);
  const [lastAuthorizationId, setLastAuthorizationId] = useState<string>();
  const [lastTransactionId, setLastTransactionId] = useState<string>();

  const fetch = useCallback(async () => {
    const promises = [];
    setIsLoading(true);

    if (hasMoreAuthorizations) {
      promises.push(
        getAuthorizations({ startingAfter: lastAuthorizationId }).then(
          (res) => {
            return { id: "authorizations", data: res };
          }
        )
      );
    }
    if (hasMoreTransactions) {
      promises.push(
        getTransactions({
          startingAfter: lastTransactionId,
        }).then((res) => {
          return { id: "transactions", data: res };
        })
      );
    }

    let newTableData: Array<TableRow> = [];

    const results = await Promise.allSettled(promises);

    results.forEach((result) => {
      if (result.status === "fulfilled") {
        const res = JSON.parse(result.value.data);
        newTableData = [...newTableData, ...res.data];

        switch (result.value.id) {
          case "authorizations": {
            setHasMoreAuthorizations(res.has_more);
            setLastAuthorizationId(res.data[res.data.length - 1]?.id);
            break;
          }
          case "transactions": {
            setHasMoreTransactions(res.has_more);
            setLastTransactionId(res.data[res.data.length - 1]?.id);
            break;
          }
          default:
            break;
        }
      }
    });

    if (newTableData.length)
      setTableData(
        [...tableData, ...newTableData].sort((a, b) => b.created - a.created)
      );

    setIsLoading(false);
  }, [
    hasMoreAuthorizations,
    hasMoreTransactions,
    lastAuthorizationId,
    lastTransactionId,
    tableData,
  ]);

  return {
    data: tableData,
    fetch,
    hasMore: hasMoreTransactions || hasMoreAuthorizations,
    isLoading,
  };
};
