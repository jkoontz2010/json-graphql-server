export default (entityData = []) => (_, { id }) =>
    Array.isArray(entityData) ? entityData.find(d => d.id == id) : entityData;
