const handlers = {
  INITIALIZE: (state: any, action: any) => {
    const { isAuthenticated, authenticatedData, allPermissions, subscriptions, companyData } = action.payload;

    return {
      ...state,
      isInitialized: true,
      isAuthenticated,
      authenticatedData,
      allPermissions,
      subscriptions,
      companyData
    };
  },
  LOGIN: (state: any, action: any) => {
    const { authenticatedData, allPermissions, subscriptions, companyData } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      authenticatedData,
      allPermissions,
      subscriptions,
      companyData,
    };
  },
  LOGOUT: (state: any) => ({
    ...state,
    isAuthenticated: false,
    authenticatedData: null,
  }),
  REGISTER: (state: any, action: any) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
};

const authReducer = (state: any, action: any) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export { authReducer };
