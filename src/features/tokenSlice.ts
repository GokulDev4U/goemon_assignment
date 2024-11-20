// // src/features/tokenSlice.ts
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// interface Token {
//   symbol: string;
//   name: string;
//   address?: string;
//   price: string; // Price in USD (for simplicity)
// }

// interface TokenState {
//   tokens: Token[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: TokenState = {
//   tokens: [],
//   loading: false,
//   error: null,
// };

// interface AsyncThunkConfig {
//   rejectValue: string;
// }

// // Fetch token metadata from CoinGecko
// // export const fetchTokenMetadata = createAsyncThunk<Token, string, AsyncThunkConfig>(
// //   'tokens/fetchTokenMetadata',
// //   async (address, { rejectWithValue }) => {
// //     try {
// //       // Example URL from CoinGecko for token metadata
// //       const response = await axios.get(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${address}`);
// //       return {
// //         symbol: response.data.symbol,
// //         name: response.data.name,
// //         price: response.data.market_data.current_price.usd.toString(),
// //       };
// //     } catch (error: any) {
// //       return rejectWithValue(error.message);
// //     }
// //   }
// // );

// export const fetchTokenMetadata = createAsyncThunk<Token, string, AsyncThunkConfig>(
//   'tokens/fetchTokenMetadata',
//   async (address, { rejectWithValue }) => {
//     try {
//       // Fetch token metadata
//       const response = await axios.get(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${address}`);
//       const data = response.data;

//       // Validate response structure
//       if (!data || !data.symbol || !data.name || !data.market_data?.current_price?.usd) {
//         throw new Error('Invalid response structure from CoinGecko');
//       }

//       // Return token details, including the `address`
//       return {
//         symbol: data.symbol,
//         name: data.name,
//         address, // Include the address
//         price: data.market_data.current_price.usd.toString(),
//       };
//     } catch (error: any) {
//       return rejectWithValue(error.message || 'Failed to fetch token metadata');
//     }
//   }
// );


// const tokenSlice = createSlice({
//   name: 'token',
//   initialState,
//   reducers: {
//     addToken: (state, action) => {
//       state.tokens.push(action.payload);
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchTokenMetadata.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchTokenMetadata.fulfilled, (state, action) => {
//         state.tokens.push(action.payload);
//         state.loading = false;
//       })
//       .addCase(fetchTokenMetadata.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { addToken } = tokenSlice.actions;

// export default tokenSlice.reducer;


// src/features/tokenSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Token {
  symbol: string;
  name: string;
  address: string;
  price: string; // Price in USD (optional if available)
}

interface TokenState {
  tokens: Token[];
  loading: boolean;
  error: string | null;
}

const initialState: TokenState = {
  tokens: [],
  loading: false,
  error: null,
};

interface AsyncThunkConfig {
  rejectValue: string;
}

// GraphQL query for Uniswap's The Graph API to fetch token metadata
const UNISWAP_GRAPHQL_URL = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2';

const TOKEN_QUERY = `
  query Token($address: String!) {
    token(id: $address) {
      id
      symbol
      name
      derivedETH
    }
  }
`;

// Fetch token metadata using Uniswap's The Graph API
export const fetchTokenMetadata = createAsyncThunk<Token, string, AsyncThunkConfig>(
  'tokens/fetchTokenMetadata',
  async (address, { rejectWithValue }) => {
    try {
      // Make a GraphQL request to fetch token details
      const response = await axios.post(UNISWAP_GRAPHQL_URL, {
        query: TOKEN_QUERY,
        variables: { address: address.toLowerCase() },
      });

      const tokenData = response.data?.data?.token;

      // Validate response structure
      if (!tokenData || !tokenData.symbol || !tokenData.name) {
        throw new Error('Token metadata not found in Uniswap API');
      }

      // Fetch ETH price (you can replace this with a reliable ETH price service)
      const ethPriceResponse = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
      );
      const ethPriceInUsd = ethPriceResponse.data.ethereum.usd;

      // Calculate token price in USD if derivedETH is available
      const priceInUsd = tokenData.derivedETH
        ? (parseFloat(tokenData.derivedETH) * ethPriceInUsd).toFixed(2)
        : 'N/A';

      // Return token details
      return {
        symbol: tokenData.symbol,
        name: tokenData.name,
        address,
        price: priceInUsd,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch token metadata');
    }
  }
);

const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    addToken: (state, action) => {
      state.tokens.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTokenMetadata.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTokenMetadata.fulfilled, (state, action) => {
        state.tokens.push(action.payload);
        state.loading = false;
      })
      .addCase(fetchTokenMetadata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addToken } = tokenSlice.actions;

export default tokenSlice.reducer;
