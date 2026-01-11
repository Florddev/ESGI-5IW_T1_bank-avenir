export type Dictionary = {
  common: {
    actions: Record<string, string>;
    labels: Record<string, string>;
    messages: Record<string, string>;
    time: Record<string, string>;
    placeholders: Record<string, string>;
  };
  entities: {
    user: Record<string, any>;
  };
  errors: {
    validation: Record<string, string>;
    network: Record<string, string>;
    http: Record<string, string>;
  };
  features: {
    auth: {
      actions: Record<string, string>;
      messages: Record<string, string>;
      validations: Record<string, string>;
    };
    accounts: {
      actions: Record<string, string>;
      labels: Record<string, string>;
      messages: Record<string, string>;
      validations: Record<string, string>;
      placeholders: Record<string, string>;
    };
    transactions: {
      actions: Record<string, string>;
      labels: Record<string, string>;
      messages: Record<string, string>;
      validations: Record<string, string>;
    };
    loans: {
      labels: Record<string, string>;
      messages: Record<string, string>;
      validations: Record<string, string>;
    };
    stocks: {
      labels: Record<string, string>;
      messages: Record<string, string>;
      validations: Record<string, string>;
    };
    conversations: {
      actions: Record<string, string>;
      labels: Record<string, string>;
      messages: Record<string, string>;
      validations: Record<string, string>;
    };
    dashboard: {
      labels: Record<string, string>;
    };
    savings: {
      labels: Record<string, string>;
    };
    admin: {
      labels: Record<string, string>;
      validations: Record<string, string>;
    };
    landing: {
      labels: Record<string, string>;
    };
    notifications: {
      labels: Record<string, string>;
    };
  };
  ui: {
    dialogs: Record<string, string>;
    forms: Record<string, string>;
    tables: Record<string, string>;
    navigation: Record<string, string>;
  };
};
