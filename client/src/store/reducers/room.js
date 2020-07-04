const initialState = {
  loading: false,
  room: {},
  currentMessage: null,
  oldMessages: null,
  errors: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    default:
      return state;
  }
}
