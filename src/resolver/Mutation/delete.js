export default (entityData = []) => (_, { id }) => {
    const parsedId = parseInt(id, 10); // FIXME fails for non-integer ids
    const indexOfEntity = entityData.findIndex(e => e.id === parsedId);
    let deletedEntity = undefined;

    if (indexOfEntity !== -1) {
        deletedEntity = entityData.splice(indexOfEntity, 1)[0];
    }
    return deletedEntity;
};
