import omit from 'lodash.omit';

const getMaxId = collection => {
    return collection.reduce(function(prev, current) {
        const prevId = prev.id ? +prev.id : 0;
        const currentId = current.id ? +current.id : 0;
        return prevId > currentId ? prev : current;
    });
};
export default (entityData = [], entityName) => (_, entity) => {
    const entityWithoutAttributes = entity.attributes
        ? omit(Object.assign(entity, entity.attributes), 'attributes')
        : entity;
    const newId = entityData.length + +getMaxId(entityData).id;
    const newEntity = Object.assign(entityWithoutAttributes, { id: newId });
    entityData.push(newEntity);
    return { [entityName]: newEntity };
};
