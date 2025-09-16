import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { CodeData, CodeGroupData } from '@/common/types/code';
import api from '@/common/utils/api';

const initialState: CodeGroupData = {};

export const fetchCommonCodes = createAsyncThunk(
  'code/fetchCommonCodes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/codes');
      if (response.data.resultCode === '200') {
        const codeList = response.data.data ? response.data.data : [];
        const codeGroup = codeList.reduce(
          (acc: CodeGroupData, { category, code, codeName }: CodeData) => {
            if (!acc[category]) {
              acc[category] = [];
            }
            const id = `${category}_${code}`;
            acc[category].push({ id, code, codeName });
            return acc;
          },
          {},
        );

        return codeGroup;
      }
    } catch (error) {
      console.error(error);
      return rejectWithValue('fetchCommonCodes Error!!');
    }

    return rejectWithValue('fetchCommonCodes Error!!');
  },
);

const commonCodeSlice = createSlice({
  name: 'commonCode',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchCommonCodes.fulfilled,
        (state, action: PayloadAction<CodeGroupData>) => {
          return action.payload;
        },
      )
      .addCase(fetchCommonCodes.rejected, (_, action) => {
        console.error(action.payload);
      });
  },
});

export default commonCodeSlice.reducer;
