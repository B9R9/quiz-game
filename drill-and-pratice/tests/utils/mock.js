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

export const mockValidUserState = {
  session: {
    get: async (key) => {
      if (key === "authenticated") return true;
      if (key === "user")
        return {
          id: 6,
          username: "test",
          email: "test@test.test",
          admin: false,
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
export const validTId = 1;
export const validQId = 1;
export const optionIdTrue = 800;
export const optionIdFalse = 801;
export const unValidQId = 999;
export const questionIdWithNoOptions = 800;
export const tIdWithOneQuestion = 800;
export const qIdForfindQuizTest = 801;
export const tidWithNoquestions = 801;
