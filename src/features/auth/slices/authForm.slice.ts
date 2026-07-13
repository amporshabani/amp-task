import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthFormState {
  email: string;
  otp: string;
  step: "IDENTIFICATION" | "VERIFICATION";
  lastSentEmail: string;
  otpDeadline: number;
}

const initialState: AuthFormState = {
  email: "",
  otp: "",
  step: "IDENTIFICATION",
  lastSentEmail: "",
  otpDeadline: 0,
};

export const authFormSlice = createSlice({
  name: "authForm",
  initialState,
  reducers: {
    updateField: (state, action: PayloadAction<Partial<AuthFormState>>) => {
      return { ...state, ...action.payload };
    },
    setStep: (state, action: PayloadAction<AuthFormState["step"]>) => {
      state.step = action.payload;
    },
    resetForm: () => initialState,
  },
});

export const { updateField, setStep, resetForm } = authFormSlice.actions;
export default authFormSlice.reducer;