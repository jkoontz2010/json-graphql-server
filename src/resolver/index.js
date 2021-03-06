import { pluralize, camelize } from 'inflection';
import GraphQLJSON from 'graphql-type-json';

import all from './Query/all';
import meta from './Query/meta';
import single from './Query/single';
import create from './Mutation/create';
import update from './Mutation/update';
import deleteMutation from './Mutation/delete';
import entityResolver from './Entity';
import { getTypeFromKey } from '../nameConverter';
import DateType from '../introspection/DateType';
import hasType from '../introspection/hasType';

const getQueryResolvers = (entityName, data) => ({
    [`all${camelize(pluralize(entityName))}`]: all(data),
    [`_all${camelize(pluralize(entityName))}Meta`]: meta(data),
    [entityName]: single(data),
});

const getMutationResolvers = (entityName, data) => ({
    [`create${camelize(entityName)}`]: create(data, entityName),
    [`update${camelize(entityName)}`]: update(data, entityName),
    [`delete${camelize(entityName)}`]: deleteMutation(data, entityName),
});

export default data => {
    return Object.assign(
        {},
        {
            Query: Object.keys(data).reduce(
                (resolvers, key) =>
                    Object.assign(
                        {},
                        resolvers,
                        getQueryResolvers(getTypeFromKey(key), data[key])
                    ),
                {}
            ),
            Mutation: Object.keys(data).reduce(
                (resolvers, key) =>
                    Object.assign(
                        {},
                        resolvers,
                        getMutationResolvers(getTypeFromKey(key), data[key])
                    ),
                {}
            ),
        },
        Object.keys(data).reduce(
            (resolvers, key) =>
                Object.assign({}, resolvers, {
                    [getTypeFromKey(key)]: entityResolver(key, data),
                }),
            {}
        ),
        hasType('Date', data) ? { Date: DateType } : {}, // required because makeExecutableSchema strips resolvers from typeDefs
        hasType('JSON', data) ? { JSON: GraphQLJSON } : {} // required because makeExecutableSchema strips resolvers from typeDefs
    );
};
