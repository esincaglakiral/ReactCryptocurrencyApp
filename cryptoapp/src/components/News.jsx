import React, { useState, useEffect } from "react";
import { List, Avatar, Button, Select } from "antd";
import millify from "millify";
import { useGetCryptosQuery } from "../services/cryptoApi";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import Loader from "./Loader";

const { Option } = Select;

const calculateChangeFor7Days = (sparkline) => {
  if (!sparkline || sparkline.length < 8) return 0;

  const firstDayPrice = sparkline[0];
  const lastDayPrice = sparkline[7];

  return ((lastDayPrice - firstDayPrice) / Math.abs(firstDayPrice)) * 100;
};

const Link = ({ href, children }) => {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
};

const TopPerformers = ({ simplified }) => {
  const { data: cryptosList, isFetching } = useGetCryptosQuery(100);
  const [topPerformers, setTopPerformers] = useState([]);
  const [timePeriod, setTimePeriod] = useState("24h");
  const [type, setType] = useState("gainers");

  useEffect(() => {
    const filteredData =
      cryptosList?.data?.coins?.filter((coin) => {
        const change =
          timePeriod === "7d"
            ? calculateChangeFor7Days(coin.sparkline)
            : coin.change;

        return type === "gainers" ? change > 0 : change < 0;
      }) || [];

    const sortedData = [...filteredData].sort((a, b) =>
      type === "gainers" ? b.change - a.change : a.change - b.change
    );

    // Eğer "losers" ise ve 7 gün verisi varsa, 7 günlük değişime göre sırala
    if (type === "losers" && timePeriod === "7d") {
      sortedData.sort(
        (a, b) =>
          calculateChangeFor7Days(a.sparkline) -
          calculateChangeFor7Days(b.sparkline)
      );
    }

    const topPerformers = simplified
      ? sortedData.slice(0, 12)
      : sortedData.slice(0, 100);

    setTopPerformers(topPerformers);
  }, [cryptosList, type, timePeriod, simplified]);

  if (isFetching) return <Loader />;

  // Günün ve haftanın en iyi performans gösteren coin
  const bestPerformance =
    topPerformers.length > 0 &&
    type === "gainers" &&
    ((timePeriod === "24h" && topPerformers[0]) ||
      (timePeriod === "7d" &&
        topPerformers.find((coin) => coin.sparkline.length >= 8)));

  // Günün ve haftanın en kötü performans gösteren coin
  const worstPerformance =
    topPerformers.length > 0 &&
    type === "losers" &&
    ((timePeriod === "24h" && topPerformers[topPerformers.length - 1]) ||
      (timePeriod === "7d" &&
        topPerformers.reverse().find((coin) => coin.sparkline.length >= 8)));

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Select
          defaultValue={timePeriod}
          style={{ width: 120, marginRight: 16 }}
          onChange={(value) => setTimePeriod(value)}
        >
          <Option value="24h">24 Hours</Option>
          <Option value="7d">7 Days</Option>
        </Select>

        <Select
          defaultValue={type}
          style={{ width: 120 }}
          onChange={(value) => setType(value)}
        >
          <Option value="gainers">Gainers</Option>
          <Option value="losers">Losers</Option>
        </Select>
      </div>

      <List
        itemLayout="horizontal"
        dataSource={topPerformers}
        renderItem={(currency) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={currency.iconUrl} />}
              title={`${currency.rank}. ${currency.name}`}
              description={`Market Cap: ${millify(
                currency.marketCap
              )}, Daily Change: ${millify(currency.change)}%`}
            />
            {simplified &&
              currency.change === topPerformers[0].change &&
              type === "gainers" &&
              timePeriod === "24h" && (
                <div
                  style={{
                    marginLeft: "auto",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ArrowUpOutlined
                    style={{ fontSize: 18, marginRight: 8, color: "#52c41a" }}
                  />
                  <span>Best performance of the day</span>
                </div>
              )}
            {simplified &&
              currency.change === topPerformers[0].change &&
              type === "losers" &&
              timePeriod === "24h" && (
                <div
                  style={{
                    marginLeft: "auto",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ArrowDownOutlined
                    style={{ fontSize: 18, marginRight: 8, color: "#eb2f96" }}
                  />
                  <span>Worst performance of the day</span>
                </div>
              )}
            {simplified &&
              currency.change === topPerformers[0].change &&
              type === "gainers" &&
              timePeriod === "7d" && (
                <div
                  style={{
                    marginLeft: "auto",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ArrowUpOutlined
                    style={{ fontSize: 18, marginRight: 8, color: "#52c41a" }}
                  />
                  <span>Best performance of the week</span>
                </div>
              )}

            {simplified &&
              currency.change === topPerformers[0].change &&
              type === "losers" &&
              timePeriod === "7d" && (
                <div
                  style={{
                    marginLeft: "auto",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ArrowDownOutlined
                    style={{ fontSize: 18, marginRight: 8, color: "#eb2f96" }}
                  />
                  <span>Worst performance of the week</span>
                </div>
              )}
            <Button type="primary" style={{ marginLeft: "20px" }}>
              <a
                href={currency.coinrankingUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View
              </a>
            </Button>
          </List.Item>
        )}
      />
    </div>
  );
};

export default TopPerformers;
