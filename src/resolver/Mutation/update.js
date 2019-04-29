export default (entityData = []) => (_, params) => {
    const parsedId = parseInt(params.id, 10); // FIXME fails for non-integer ids
    const indexOfEntity = entityData.findIndex(
        e => parseInt(e.id, 10) === parsedId
    );
    const paramsWithoutAttributes = params.attributes
        ? Object.assign({}, { id: params.id }, params.attributes)
        : params;
    if(params.attributes) console.log('has attributes')
    console.log('UPDATE MUTATION', paramsWithoutAttributes, 'DATA', entityData[indexOfEntity]);
    if (indexOfEntity !== -1) {
        entityData[indexOfEntity] = Object.assign(
            {},
            entityData[indexOfEntity],
            paramsWithoutAttributes
        );
        return entityData[indexOfEntity];
    }
};
