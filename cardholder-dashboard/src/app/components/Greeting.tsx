import { useEffect } from "react";

import { useCardData } from "@/app/hooks";

import { Spinner } from "./Spinner";

export const Greeting = () => {
  const {
    data: card,
    fetch: fetchCardInfo,
    isLoading: isCardDataLoading,
  } = useCardData();

  useEffect(() => {
    fetchCardInfo();
  }, []);

  return (
    <h1 className="greeting">
      {isCardDataLoading && <Spinner />}
      {card && (
        <>
          {card.cardholder.individual?.first_name ?? "Unknown"}'s&nbsp;
          {card.brand}&nbsp;
          <span className="small">
            <code>{card.last4}</code>
            &nbsp;exp.&nbsp;
            <code>
              {card.exp_month}/{card.exp_year}
            </code>
          </span>
        </>
      )}
    </h1>
  );
};
