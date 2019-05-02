import omit from 'lodash.omit';

export default (entityData = [], entityName) => (_, entity) => {
    const entityWithoutAttributes = entity.attributes
        ? omit(Object.assign(entity, entity.attributes), 'attributes')
        : entity;
    const newId = entityData.length ? entityData.length + 1 : 1;
    const newEntity = Object.assign(entityWithoutAttributes, { id: newId });
    entityData.push(newEntity);
    return { [entityName]: newEntity };
};
