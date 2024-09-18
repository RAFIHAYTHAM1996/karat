"use client";

import { useCallback, useState } from "react";
import Stripe from "stripe";

import { getCardInfo } from "@/app/api/actions/getCardInfo";
import { ClientData } from "@/app/types";

export const useCardData = (): ClientData<Stripe.Issuing.Card | undefined> => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [card, setCard] = useState<Stripe.Issuing.Card>();

  const fetch = useCallback(async () => {
    setIsLoading(true);

    const res = await getCardInfo();
    setCard(JSON.parse(res));

    setIsLoading(false);
  }, []);

  return { data: card, fetch, isLoading };
};
