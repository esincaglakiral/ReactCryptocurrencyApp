import React, { useEffect, useState } from "react";
import { Spin, Skeleton } from "antd";

const Loader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    // Temizleme işlemi: bileşen unmount olduğunda timer'ı temizle
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`loader ${loading ? "" : "hide-loader"}`}>
      {loading ? <Skeleton active /> : <Spin />}
    </div>
  );
};

export default Loader;
