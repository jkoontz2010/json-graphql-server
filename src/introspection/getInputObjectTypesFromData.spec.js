import getInputObjectTypesFromData from './getInputObjectTypesFromData';

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

/*
const PostType = new GraphQLObjectType({
    name: 'PostInput',
    fields: {
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        views: { type: GraphQLInt },
        user_id: { type: GraphQLID },
    },
});
const UsersType = new GraphQLObjectType({
    name: 'UserInput',
    fields: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
    },
});
*/

test('creates one input type per entity', () => {
    const inputTypes = getInputObjectTypesFromData(data);
    expect(Object.values(inputTypes).map(type => type.toString())).toEqual([
        'postInput',
        'userInput',
    ]);
});

test('creates one input field per entity field', () => {
    const inputTypes = getInputObjectTypesFromData(data);
    const PostInputFields = inputTypes.post.getFields();
    expect(PostInputFields.id.type.toString()).toEqual('ID');
    expect(PostInputFields.title.type.toString()).toEqual('String');
    expect(PostInputFields.views.type.toString()).toEqual('Int');
    expect(PostInputFields.user_id.type.toString()).toEqual('ID');
    const CommentInputFields = inputTypes.user.getFields();
    expect(CommentInputFields.id.type.toString()).toEqual('ID');
    expect(CommentInputFields.name.type.toString()).toEqual('String');
});
