"use client";

import Image from "next/image";
import { IntlProvider } from "react-intl";
import { useState } from "react";

import { DataTable, Greeting, SummaryCard } from "@/app/components";
import { AppContext } from "@/app/contexts/app";
import KaratLogo from "@/app/karat-logo.svg";

const CardDashboard = () => {
  const [tableDataLoaded, setTableDataLoaded] = useState(false)

  return (
    <div className="grid grid-rows-[20px_1fr_20px]  pl-8 pr-8 gap-16 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-4 row-start-2 items-center sm:items-start">
        <AppContext.Provider value={{ tableDataLoaded }}>
          <Image
            src={KaratLogo}
            alt="Karat Logo"
            width={180}
            height={38}
            priority
            color="#ffffff"
          />
          <div className="flex items-start gap-16 justify-items-center flex-row">
            <div className="sticky top-10 summary-container">
              <Greeting />
              <SummaryCard />
            </div>
            <DataTable onTableDataLoaded={() => setTableDataLoaded(true)} />
          </div>
        </AppContext.Provider>
      </main>
    </div>
  );
};

export default function CardDashboardWrapper() {
  return (
    <IntlProvider locale="en">
      <CardDashboard />
    </IntlProvider>
  );
}
