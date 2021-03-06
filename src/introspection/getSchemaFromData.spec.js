import {
    GraphQLBoolean,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
} from 'graphql';
import getSchemaFromData from './getSchemaFromData';

const data = {
    posts: [
        {
            id: 1,
            title: 'Lorem Ipsum',
            views: 254,
            user_id: 123,
        },
        {
            id: 2,
            title: 'Sic Dolor amet',
            views: 65,
            user_id: 456,
        },
    ],
    users: [
        {
            id: 123,
            name: 'John Doe',
        },
        {
            id: 456,
            name: 'Jane Doe',
        },
    ],
};

const PostType = new GraphQLObjectType({
    name: 'post',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        views: { type: new GraphQLNonNull(GraphQLInt) },
        user_id: { type: new GraphQLNonNull(GraphQLID) },
        user: { type: UserType },
    }),
});

const UserType = new GraphQLObjectType({
    name: 'user',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        posts: { type: new GraphQLList(PostType) },
    }),
});

const PostPayloadType = new GraphQLObjectType({
    name: 'postPayload',
    fields: {
        post: { type: PostType },
    },
});
const UserPayloadType = new GraphQLObjectType({
    name: 'userPayload',
    fields: {
        user: { type: UserType },
    },
});

/*
const ListMetadataType = new GraphQLObjectType({
    name: 'ListMetadata',
    fields: {
        count: { type: GraphQLInt },
    },
});

const QueryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        getPost: {
            type: PostType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
            },
        },
        getPageOfPost: {
            type: new GraphQLList(PostType),
            args: {
                page: { type: GraphQLInt },
                perPage: { type: GraphQLInt },
                sort: { type: GraphQLString },
                filter: { type: GraphQLString },
            },
        },
        getUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
            },
        },
        getPageOfUser: {
            type: new GraphQLList(UserType),
            args: {
                page: { type: GraphQLInt },
                perPage: { type: GraphQLInt },
                sort: { type: GraphQLString },
                filter: { type: GraphQLString },
            },
        },
    },
});
*/

test('creates one type per data type', () => {
    const typeMap = getSchemaFromData(data).getTypeMap();
    expect(typeMap['post'].name).toEqual(PostType.name);
    expect(Object.keys(typeMap['post'].getFields())).toEqual(
        Object.keys(PostType.getFields())
    );
    expect(typeMap['user'].name).toEqual(UserType.name);
    expect(Object.keys(typeMap['user'].getFields())).toEqual(
        Object.keys(UserType.getFields())
    );
});

test('creates one field per relationship', () => {
    const typeMap = getSchemaFromData(data).getTypeMap();
    expect(Object.keys(typeMap['post'].getFields())).toContain('user');
});

test('creates one field per reverse relationship', () => {
    const typeMap = getSchemaFromData(data).getTypeMap();
    expect(Object.keys(typeMap['user'].getFields())).toContain('posts');
});

test('creates three query fields per data type', () => {
    const queries = getSchemaFromData(data).getQueryType().getFields();
    expect(queries['post'].type.name).toEqual(PostType.name);
    expect(queries['post'].args).toEqual([
        {
            defaultValue: undefined,
            description: null,
            name: 'id',
            type: GraphQLID,
        },
    ]);
    expect(queries['allPosts'].type.toString()).toEqual('[post]');
    expect(queries['allPosts'].args[0].name).toEqual('page');
    expect(queries['allPosts'].args[0].type).toEqual(GraphQLInt);
    expect(queries['allPosts'].args[1].name).toEqual('perPage');
    expect(queries['allPosts'].args[1].type).toEqual(GraphQLInt);
    expect(queries['allPosts'].args[2].name).toEqual('sort');
    expect(queries['allPosts'].args[2].type.toString()).toEqual('postSort');
    expect(queries['allPosts'].args[3].name).toEqual('filter');
    expect(queries['allPosts'].args[3].type.toString()).toEqual('postFilter');
    expect(queries['_allPostsMeta'].type.toString()).toEqual('ListMetadata');

    expect(queries['user'].type.name).toEqual(UserType.name);
    expect(queries['user'].args).toEqual([
        {
            defaultValue: undefined,
            description: null,
            name: 'id',
            type: GraphQLID,
        },
    ]);
    expect(queries['allUsers'].type.toString()).toEqual('[user]');
    expect(queries['allUsers'].args[0].name).toEqual('page');
    expect(queries['allUsers'].args[0].type).toEqual(GraphQLInt);
    expect(queries['allUsers'].args[1].name).toEqual('perPage');
    expect(queries['allUsers'].args[1].type).toEqual(GraphQLInt);
    expect(queries['allUsers'].args[2].name).toEqual('sort');
    expect(queries['allUsers'].args[2].type.toString()).toEqual('userSort');
    expect(queries['allUsers'].args[3].name).toEqual('filter');
    expect(queries['allUsers'].args[3].type.toString()).toEqual('userFilter');
    expect(queries['_allPostsMeta'].type.toString()).toEqual('ListMetadata');
});

test('creates three mutation fields per data type', () => {
    const mutations = getSchemaFromData(data).getMutationType().getFields();
    expect(mutations['createPost'].type.name).toEqual(PostPayloadType.name);
    expect(mutations['createPost'].args[0].name).toEqual('attributes');
    expect(mutations['createPost'].args[0].type.toString()).toEqual(
        'postInput'
    );

    expect(mutations['updatePost'].type.name).toEqual(PostPayloadType.name);
    expect(mutations['updatePost'].args[0].name).toEqual('id');
    expect(mutations['updatePost'].args[0].type).toEqual(
        new GraphQLNonNull(GraphQLID)
    );
    expect(mutations['updatePost'].args[1].name).toEqual('attributes');
    expect(mutations['updatePost'].args[1].type.toString()).toEqual(
        'postInput'
    );

    expect(mutations['deletePost'].type.name).toEqual(GraphQLBoolean.name);
    expect(mutations['deletePost'].args).toEqual([
        {
            name: 'id',
            type: new GraphQLNonNull(GraphQLID),
            defaultValue: undefined,
            description: null,
        },
    ]);
    expect(mutations['createUser'].type.name).toEqual(UserPayloadType.name);
    expect(mutations['createUser'].args[0].name).toEqual('attributes');
    expect(mutations['createUser'].args[0].type.toString()).toEqual(
        'userInput'
    );

    expect(mutations['updateUser'].type.name).toEqual(UserPayloadType.name);
    expect(mutations['updateUser'].args[0].name).toEqual('id');
    expect(mutations['updateUser'].args[0].type).toEqual(
        new GraphQLNonNull(GraphQLID)
    );
    expect(mutations['updateUser'].args[1].name).toEqual('attributes');
    expect(mutations['updateUser'].args[1].type.toString()).toEqual(
        'userInput'
    );
    expect(mutations['deleteUser'].type.name).toEqual(GraphQLBoolean.name);
    expect(mutations['deleteUser'].args).toEqual([
        {
            defaultValue: undefined,
            description: null,
            name: 'id',
            type: new GraphQLNonNull(GraphQLID),
        },
    ]);
});

test('pluralizes and capitalizes correctly', () => {
    const data = {
        feet: [{ id: 1, size: 42 }, { id: 2, size: 39 }],
        categories: [{ id: 1, name: 'foo' }],
    };
    const queries = getSchemaFromData(data).getQueryType().getFields();
    expect(queries).toHaveProperty('foot');
    expect(queries).toHaveProperty('category');
    expect(queries).toHaveProperty('allFeet');
    expect(queries).toHaveProperty('allCategories');
    const types = getSchemaFromData(data).getTypeMap();
    expect(types).toHaveProperty('foot');
    expect(types).toHaveProperty('category');
});
