import HomePageChart from "@/components/dashboard/charts/HomePageChart";
import ProductOverviewChart from "@/components/dashboard/charts/ProductOverviewChart";
import BagianPesananTerbaru from "@/components/dashboard/order/RecentOrders"; // Pastikan juga file ini sudah diterjemahkan
import StatisticsCard from "@/components/dashboard/statistics/StatisticsCard";
import { Activity, ShoppingBag, Users, Coins } from "lucide-react";
import React from "react";

const HalamanDashboardSatu = () => {
  return (
    <section className="max-w-screen-xl mx-auto py-4">
      <div className="grid gap-2 lg:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatisticsCard
          iconColor="bg-rose-500"
          title="Pendapatan"
          value="Rp10.000.000"
          icon={Coins}
        />
        <StatisticsCard
          iconColor="bg-lime-500"
          title="Penjualan"
          value="Rp1.000.000"
          icon={ShoppingBag}
        />

        <StatisticsCard
          iconColor="bg-rose-500"
          title="Pesanan"
          value="Rp4.000.000"
          icon={Activity}
        />
        <StatisticsCard
          iconColor="bg-violet-500"
          title="Pelanggan"
          value="500"
          icon={Users}
        />
      </div>
      <HomePageChart />
      <BagianPesananTerbaru />
      <ProductOverviewChart />
    </section>
  );
};

export default HalamanDashboardSatu;
