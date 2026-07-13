import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ModalType = "DELETE_TASK" | "DELETE_SUBTASK" | null;

interface ModalState {
  isOpen: boolean;
  view: ModalType;
  payload: any;
}

const initialState: ModalState = {
  isOpen: false,
  view: null,
  payload: null,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    onOpen: (state, action: PayloadAction<{ view: ModalType; payload?: any }>) => {
      state.isOpen = true;
      state.view = action.payload.view;
      state.payload = action.payload.payload || null;
    },
    onClose: (state) => {
      state.isOpen = false;
      state.view = null;
      state.payload = null;
    },
  },
});

export const { onOpen, onClose } = modalSlice.actions;
export default modalSlice.reducer;
