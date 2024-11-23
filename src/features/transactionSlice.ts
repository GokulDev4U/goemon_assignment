// transactionSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TransactionState {
  tokensInvolved: string[];
  amountBeforeFees: number;
  amountAfterFees: number;
  gasFees: number;
  slippage: number;
  status: 'pending' | 'success' | 'failed' | null;
}

const initialState: TransactionState = {
  tokensInvolved: [],
  amountBeforeFees: 0,
  amountAfterFees: 0,
  gasFees: 0,
  slippage: 0,
  status: null,
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setTransactionDetails: (
      state,
      action: PayloadAction<{
        tokensInvolved: string[];
        amountBeforeFees: number;
        amountAfterFees: number;
        gasFees: number;
        slippage: number;
      }>
    ) => {
      state.tokensInvolved = action.payload.tokensInvolved;
      state.amountBeforeFees = action.payload.amountBeforeFees;
      state.amountAfterFees = action.payload.amountAfterFees;
      state.gasFees = action.payload.gasFees;
      state.slippage = action.payload.slippage;
    },
    setTransactionStatus: (state, action: PayloadAction<'pending' | 'success' | 'failed'>) => {
      state.status = action.payload;
    },
  },
});

export const { setTransactionDetails, setTransactionStatus } = transactionSlice.actions;
export default transactionSlice.reducer;
