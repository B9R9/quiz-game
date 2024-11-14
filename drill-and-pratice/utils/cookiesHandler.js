export const getCookies = async (state) => {
  const authenticated = await state.session.get("authenticated");
  if (!authenticated) {
    return { authenticated: false, user: {} };
  }
  const user = await state.session.get("user");
  return { authenticated, user };
};
