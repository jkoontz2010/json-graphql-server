import omit from 'lodash.omit';

export default (entityData = [], entityName) => (_, entity) => {
    const entityWithoutAttributes = entity.attributes
        ? omit(Object.assign(entity, entity.attributes), 'attributes')
        : entity;
    const newId =
        entityData.length > 0 ? entityData[entityData.length - 1].id + 1 : 0;
    const newEntity = Object.assign(entityWithoutAttributes, { id: newId });

    entityData.push(newEntity);
    return { [entityName]: newEntity };
};
