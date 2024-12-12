export const hasPermission = (session, requiredLevel) => {
  return session?.user?.permission >= requiredLevel;
};
