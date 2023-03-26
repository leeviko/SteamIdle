export type TSettings = {
  Auth: {
    steamLoginSecure: string | null;
    sessionid: string | null;
    steamid: string | null;
  };
};

export const Settings: TSettings = {
  Auth: {
    steamLoginSecure: null,
    sessionid: null,
    steamid: null,
  },
};
