import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLBoolean,
} from 'graphql';
import getTypesFromData from './getTypesFromData';
import getOutputTypesFromDataTypes from './getOutputTypesFromDataTypes';
test.only('Integration test', () => {
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
                isFlaggable: true,
            },
            {
                id: 456,
                name: 'Jane Doe',
                isFlaggable: false,
            },
        ],
        currentUser: {
            id: 123,
            name: 'Jay',
            isFlag: true,
            count: 44,
        },
    };
    const PostType = new GraphQLObjectType({
        name: 'post',
        fields: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            title: { type: new GraphQLNonNull(GraphQLString) },
            views: { type: new GraphQLNonNull(GraphQLInt) },
            user_id: { type: new GraphQLNonNull(GraphQLID) },
        },
    });
    const UsersType = new GraphQLObjectType({
        name: 'user',
        fields: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            name: { type: new GraphQLNonNull(GraphQLString) },
            isFlaggable: { type: new GraphQLNonNull(GraphQLBoolean) },
        },
    });

    const CurrentUserType = new GraphQLObjectType({
        name: 'currentUser',
        fields: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            name: { type: GraphQLString },
            isFlag: { type: new GraphQLNonNull(GraphQLBoolean) },
            count: { type: new GraphQLNonNull(GraphQLInt) },
        },
    });

    const PostPayloadType = new GraphQLObjectType({
        name: 'postPayload',
        fields: {
            post: { type: PostType },
        },
    });
    const UsersPayloadType = new GraphQLObjectType({
        name: 'userPayload',
        fields: {
            user: { type: UsersType },
        },
    });

    const CurrentUserPayloadType = new GraphQLObjectType({
        name: 'currentUserPayload',
        fields: {
            currentUser: { type: CurrentUserType },
        },
    });

    const dataTypes = getTypesFromData(data);

    expect(getOutputTypesFromDataTypes(dataTypes)).toEqual([
        PostPayloadType,
        UsersPayloadType,
        CurrentUserPayloadType,
    ]);
});
