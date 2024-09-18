"use client";

import { useCallback, useState } from "react";

import { getTransactionsSummary } from "@/app/api/actions/getTransactionsSummary";
import { TransactionsSummary } from "@/app/api/types";
import { ClientData } from "@/app/types";

export const useTransactionsSummaryData =
  (): ClientData<TransactionsSummary> => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [summary, setSummary] = useState<TransactionsSummary>();

    const fetch = useCallback(async () => {
      setIsLoading(true);
      setSummary(await getTransactionsSummary());
      setIsLoading(false);
    }, []);

    return { data: summary, fetch, isLoading };
  };
