export default (entityData = []) => (_, entity) => {
    const entityWithoutAttributes = entity.attributes
        ? Object.assign({}, entity.attributes)
        : entity;
    const newId =
        entityData.length > 0 ? entityData[entityData.length - 1].id + 1 : 0;
    const newEntity = Object.assign({ id: newId }, entityWithoutAttributes);

    entityData.push(newEntity);
    return newEntity;
};
