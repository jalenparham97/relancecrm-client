export const getFullName = (entity: {
  firstName?: string;
  lastName?: string;
}) => {
  return entity ? `${entity?.firstName} ${entity?.lastName}` : '';
};
