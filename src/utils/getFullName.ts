export const getFullName = (entity: { firstName?: string; lastName?: string }) => {
  return `${entity.firstName} ${entity.lastName}`;
};
