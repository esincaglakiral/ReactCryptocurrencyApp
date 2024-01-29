import React, { useState, useEffect } from "react";
import {
  Input,
  Select,
  Button,
  Typography,
  List,
  Card,
  Row,
  Col,
  Space,
} from "antd";
import millify from "millify";
import {
  useGetCryptosQuery,
  useGetCryptoDetailsQuery,
} from "../services/cryptoApi";

const { Title } = Typography;
const { Option } = Select;

const CryptoConverter = () => {
  const { data: cryptosList } = useGetCryptosQuery(10);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [cryptoAmount, setCryptoAmount] = useState(1);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const { data: cryptoDetails } = useGetCryptoDetailsQuery(
    selectedCrypto || cryptosList?.data?.coins[0]?.uuid
  );
  const [conversionResult, setConversionResult] = useState(null);
  const [conversionHistory, setConversionHistory] = useState([]);
  const [selectedQuickAccessCrypto, setSelectedQuickAccessCrypto] = useState(
    cryptosList?.data?.coins[0]?.uuid
  );

  useEffect(() => {
    // localStorage'dan geçmiş dönüşümleri al
    const storedHistory = JSON.parse(
      localStorage.getItem("cryptoConverterHistory")
    );
    if (storedHistory) {
      setConversionHistory(storedHistory);
    }
  }, []);

  const handleConversion = () => {
    const conversionResult = cryptoAmount * cryptoDetails?.data?.coin?.price;
    setConversionResult(conversionResult);

    // Conversion history'e ekle
    const newConversion = {
      amount: cryptoAmount,
      cryptoName: cryptoDetails?.data?.coin?.name,
      convertedAmount: conversionResult,
      currency: selectedCurrency,
      date: new Date().toLocaleString(),
    };
    // localStorage'a geçmiş dönüşümü ekle
    const updatedHistory = [...conversionHistory, newConversion];
    setConversionHistory(updatedHistory);
    localStorage.setItem(
      "cryptoConverterHistory",
      JSON.stringify(updatedHistory)
    );
  };

  const handleQuickAccess = (cryptoId) => {
    setSelectedQuickAccessCrypto(cryptoId);
    setSelectedCrypto(cryptoId);
  };

  useEffect(() => {
    if (cryptosList?.data?.coins) {
      setSelectedCrypto(cryptosList.data.coins[0].uuid);
      setSelectedQuickAccessCrypto(cryptosList.data.coins[0].uuid);
    }
  }, [cryptosList]);

  return (
    <div className="crypto-converter">
      <Title level={2}>Crypto Conversion Calculator</Title>
      <Input
        type="number"
        placeholder="Amount"
        onChange={(e) => setCryptoAmount(e.target.value)}
        value={cryptoAmount}
      />
      <Select
        defaultValue={selectedCrypto}
        onChange={(value) => setSelectedCrypto(value)}
      >
        {cryptosList?.data?.coins.map((crypto) => (
          <Option key={crypto.uuid} value={crypto.uuid}>
            {crypto.name}
          </Option>
        ))}
      </Select>
      <Select
        defaultValue={selectedCurrency}
        onChange={(value) => setSelectedCurrency(value)}
      >
        <Option value="USD">USD</Option>
        <Option value="EUR">EUR</Option>
        <Option value="GBP">GBP</Option>
        {/* Diğer dönüştürülebilen para birimlerini buraya ekleyebilirsiniz */}
      </Select>
      <Button type="primary" onClick={handleConversion}>
        Convert
      </Button>
      {conversionResult && (
        <div style={{ marginTop: "10px" }}>
          {millify(conversionResult)} {selectedCurrency}
        </div>
      )}

      {/* Hızlı Erişim Butonları */}
      <Row gutter={16} style={{ marginTop: "20px" }}>
        <Col>
          <Space>
            {cryptosList?.data?.coins.slice(0, 5).map((crypto) => (
              <Button
                key={crypto.uuid}
                type={
                  selectedQuickAccessCrypto === crypto.uuid ? "primary" : ""
                }
                onClick={() => handleQuickAccess(crypto.uuid)}
              >
                {crypto.name}
              </Button>
            ))}
          </Space>
        </Col>
      </Row>

      {/* Geçmiş Dönüşümler */}
      <div style={{ marginTop: "20px" }}>
        <Title level={3}>Conversion History</Title>
        <List
          dataSource={conversionHistory}
          renderItem={(item) => (
            <List.Item>
              <Card>
                <div>
                  {item.amount} {item.cryptoName} ={" "}
                  {millify(item.convertedAmount)} {item.currency}
                </div>
                <div style={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.6)" }}>
                  {item.date}
                </div>
              </Card>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default CryptoConverter;
