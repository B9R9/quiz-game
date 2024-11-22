export const mockValidState = {
  session: {
    get: async (key) => {
      if (key === "authenticated") return true;
      if (key === "user")
        return {
          id: 6,
          username: "test",
          email: "test@test.test",
          admin: true,
        };
    },
  },
};

export const mockUnvalidState = {
  session: {
    get: async (key) => {
      if (key === "authenticated") return false;
      if (key === "user") return {};
    },
  },
};

export const validUser = 6;
export const validTId = 54;
export const validQId = 1;
export const optionIdTrue = 245;
export const optionIdFalse = 246;
export const unValidQId = 99;
