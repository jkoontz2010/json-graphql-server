import omit from 'lodash.omit';

export default (entityData = [], entityName) => (_, params) => {
    const parsedId = parseInt(params.id, 10); // FIXME fails for non-integer ids
    const indexOfEntity = entityData.findIndex(
        e => parseInt(e.id, 10) === parsedId
    );
    const paramsWithoutAttributes = params.attributes
        ? omit(Object.assign({}, params, params.attributes), 'attributes')
        : params;
    if (indexOfEntity !== -1) {
        entityData[indexOfEntity] = Object.assign(
            {},
            entityData[indexOfEntity],
            paramsWithoutAttributes
        );
        return { [entityName]: entityData[indexOfEntity] };
    }
};
