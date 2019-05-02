import omit from 'lodash.omit';

const getMaxId = collection => {
    return collection.reduce(function(prev, current) {
        return prev.id > current.id ? prev : current;
    });
};
export default (entityData = [], entityName) => (_, entity) => {
    const entityWithoutAttributes = entity.attributes
        ? omit(Object.assign(entity, entity.attributes), 'attributes')
        : entity;
    const newId = entityData.length > 0 ? +getMaxId(entityData).id + 1 : 0;
    const newEntity = Object.assign(entityWithoutAttributes, { id: newId });
    entityData.push(newEntity);
    return { [entityName]: newEntity };
};
