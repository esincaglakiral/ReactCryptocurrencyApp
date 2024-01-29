// const axios = require('axios');

// const options = {
//   method: 'GET',
//   url: 'https://coinranking1.p.rapidapi.com/exchanges',
//   params: {
//     referenceCurrencyUuid: 'yhjMzLPhuIDl',
//     limit: '50',
//     offset: '0',
//     orderBy: '24hVolume',
//     orderDirection: 'desc'
//   },
//   headers: {
//     'X-RapidAPI-Key': 'd17d5b9859mshea9940f0e8e8efbp1e25dfjsnf27a98b2bd65',
//     'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
//   }
// };

// try {
// 	const response = await axios.request(options);
// 	console.log(response.data);
// } catch (error) {
// 	console.error(error);
// }

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const cryptoApiHeaders = {
  "X-RapidAPI-Key": "d17d5b9859mshea9940f0e8e8efbp1e25dfjsnf27a98b2bd65",
  "X-RapidAPI-Host": "coinranking1.p.rapidapi.com",
};

const baseUrl = "https://coinranking1.p.rapidapi.com";

const createRequest = (url) => ({ url, headers: cryptoApiHeaders });

export const cryptoApi = createApi({
  reducerPath: "cryptoApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getCryptos: builder.query({
      query: (count) => createRequest(`/coins?limit=${count}`),
    }),
    getCryptoDetails: builder.query({
      query: (coinId) => createRequest(`/coin/${coinId}`),
    }),
    // Note: Change the coin price history endpoint from this - `coin/${coinId}/history/${timeperiod} to this - `coin/${coinId}/history?timeperiod=${timeperiod}`
    getCryptoHistory: builder.query({
      query: ({ coinId, timeperiod }) =>
        createRequest(`coin/${coinId}/history?timeperiod=${timeperiod}`),
    }),
  }),
});

export const {
  useGetCryptosQuery,
  useGetCryptoDetailsQuery,
  useGetCryptoHistoryQuery,
} = cryptoApi;
