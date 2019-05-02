import {
    GraphQLBoolean,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    parse,
    extendSchema,
} from 'graphql';
import { pluralize, camelize } from 'inflection';
import getTypesFromData from './getTypesFromData';
import getFilterTypesFromData from './getFilterTypesFromData';
import getInputObjectTypesFromData from './getInputObjectTypesFromData';
import getOutputTypesFromDataTypes from './getOutputTypesFromDataTypes';
import { isRelationshipField } from '../relationships';
import { getRelatedType } from '../nameConverter';

/**
 * Get a GraphQL schema from data
 * 
 * @example
 * const data = {
 *    "posts": [
 *        {
 *            "id": 1,
 *            "title": "Lorem Ipsum",
 *            "views": 254,
 *            "user_id": 123,
 *        },
 *        {
 *            "id": 2,
 *            "title": "Sic Dolor amet",
 *            "views": 65,
 *            "user_id": 456,
 *        },
 *    ],
 *    "users": [
 *        {
 *            "id": 123,
 *            "name": "John Doe"
 *        },
 *        {
 *            "id": 456,
 *            "name": "Jane Doe"
 *        }
 *    ],
 * };
 * const types = getTypesFromData(data);
 * // type Post {
 * //     id: ID
 * //     title: String
 * //     views: Int
 * //     user_id: ID
 * // }
 * //
 * // type User {
 * //     id: ID
 * //     name: String
 * // }
 * //
 * // type Query {
 * //     Post(id: ID!): Post
 * //     allPosts(page: Int, perPage: Int, sortField: String, sortOrder: String, filter: PostFilter): [Post]
 * //     User(id: ID!): User
 * //     allUsers(page: Int, perPage: Int, sortField: String, sortOrder: String, filter: UserFilter): [User]
 * // }
 * //
 * // type Mutation {
 * //     createPost(data: String): Post
 * //     updatePost(data: String): Post
 * //     deletePost(id: ID!): Boolean
 * //     createUser(data: String): User
 * //     updateUser(data: String): User
 * //     deleteUser(id: ID!): Boolean
 * // }
 */

const typesByNameReducer = (types, type) => {
    types[type.name] = type;
    return types;
};

export default data => {
    const types = getTypesFromData(data);
    const outputTypes = getOutputTypesFromDataTypes(types);
    const typesByName = types.reduce(typesByNameReducer, {});
    const outputTypesByName = outputTypes.reduce(typesByNameReducer, {});

    const filterTypesByName = getFilterTypesFromData(data);

    const listMetadataType = new GraphQLObjectType({
        name: 'ListMetadata',
        fields: {
            count: { type: GraphQLInt },
        },
    });

    const queryType = new GraphQLObjectType({
        name: 'Query',
        fields: types.reduce((fields, type) => {
            fields[type.name] = {
                type: typesByName[type.name],
                args: {
                    id: { type: GraphQLID },
                },
            };
            fields[`all${camelize(pluralize(type.name), false)}`] = {
                type: new GraphQLList(typesByName[type.name]),
                args: {
                    page: { type: GraphQLInt },
                    perPage: { type: GraphQLInt },
                    sortField: { type: GraphQLString },
                    sortOrder: { type: GraphQLString },
                    filter: { type: filterTypesByName[type.name] },
                },
            };
            fields[`_all${camelize(pluralize(type.name), false)}Meta`] = {
                type: listMetadataType,
                args: {
                    page: { type: GraphQLInt },
                    perPage: { type: GraphQLInt },
                    filter: { type: filterTypesByName[type.name] },
                },
            };
            return fields;
        }, {}),
    });

    const mutationType = new GraphQLObjectType({
        name: 'Mutation',
        fields: types.reduce((fields, type) => {
            const inputObjectTypesByName = getInputObjectTypesFromData(data);

            fields[`create${camelize(type.name)}`] = {
                type: outputTypesByName[type.name + 'Payload'],
                args: {
                    attributes: { type: inputObjectTypesByName[type.name] },
                },
            };
            fields[`update${camelize(type.name)}`] = {
                type: outputTypesByName[type.name + 'Payload'],
                args: {
                    id: { type: new GraphQLNonNull(GraphQLID) },
                    attributes: { type: inputObjectTypesByName[type.name] },
                },
            };
            fields[`delete${camelize(type.name)}`] = {
                type: GraphQLBoolean,
                args: {
                    id: { type: new GraphQLNonNull(GraphQLID) },
                },
            };

            return fields;
        }, {}),
    });

    const schema = new GraphQLSchema({
        query: queryType,
        mutation: mutationType,
    });

    /**
     * extend schema to add relationship fields
     * 
     * @example
     * If the `post` key contains a 'user_id' field, then
     * add one-to-many and many-to-one type extensions:
     *     extend type Post { User: User }
     *     extend type User { Posts: [Post] }
     */
    const schemaExtension = Object.values(typesByName).reduce((ext, type) => {
        Object.keys(type.getFields())
            .filter(isRelationshipField)
            .map(fieldName => {
                const relType = getRelatedType(fieldName);
                const rel = pluralize(type.toString());
                ext += `
extend type ${type} { ${relType}: ${relType} }
extend type ${relType} { ${rel}: [${type}] }`;
            });
        return ext;
    }, '');

    return schemaExtension
        ? extendSchema(schema, parse(schemaExtension))
        : schema;
};
