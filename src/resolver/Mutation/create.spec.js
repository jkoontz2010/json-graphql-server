import create from './create';

test('returns a new object with id 0 on empty datastore', () => {
    expect(create([], 'post')(null, {})).toEqual({ post: { id: 0 } });
});

test('returns a new object with incremental id', () => {
    const data = [{ id: 0 }, { id: 1 }];
    expect(create(data, 'post')(null, {})).toEqual({
        post: { id: 2 },
    });
});

test('returns a new object using create data', () => {
    const data = [{ id: 1, value: 'foo' }];
    expect(create(data, 'post')(null, { value: 'toto' })).toEqual({
        post: {
            id: 2,
            value: 'toto',
        },
    });
});

test('creates a new record', () => {
    const data = [{ id: 1 }, { id: 2 }];
    create(data)(null, { value: 'foo' });
    expect(data).toEqual([{ id: 1 }, { id: 2 }, { id: 3, value: 'foo' }]);
});
