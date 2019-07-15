import { GraphQLInputObjectType, GraphQLString } from 'graphql';
import { getTypeFromKey } from '../nameConverter';

/**
* Get a list of GraphQLObjectType for filtering data
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
* const types = getFilterTypesFromData(data);
* // {
* //     posts: new GraphQLInputObjectType({
* //         name: "PostFilter",
* //         fields: {
* //             q: { type: GraphQLString },
* //             id: { type: GraphQLString },
* //             title: { type: GraphQLString },
* //             views: { type: GraphQLInt },
* //             views_lt: { type: GraphQLInt },
* //             views_lte: { type: GraphQLInt },
* //             views_gt: { type: GraphQLInt },
* //             views_gte: { type: GraphQLInt },
* //             user_id: { type: GraphQLString },
* //         }
* //     }),
* //     users: new GraphQLObjectType({
* //         name: "UserFilter",
* //         fields: {
* //             q: { type: GraphQLString },
* //             id: { type: GraphQLString },
* //             name: { type: GraphQLString },
* //         }
* //     }),
* // }
*/
export default data =>
    Object.keys(data).reduce(
        (types, key) =>
            Object.assign({}, types, {
                [getTypeFromKey(key)]: new GraphQLInputObjectType({
                    name: `${getTypeFromKey(key)}Sort`,
                    fields: Object.assign(
                        {
                            field: { type: GraphQLString },
                        },
                        {
                            order: { type: GraphQLString },
                        }
                    ),
                }),
            }),
        {}
    );
