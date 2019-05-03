import deleteMutation from './delete';

test('returns undefined by default', () => {
    expect(deleteMutation()(null, {})).toBeUndefined();
});

test('returns deleteMutationd record when found', () => {
    const data = [{ id: 1, value: 'foo' }, { id: 2, value: 'bar' }];
    expect(deleteMutation(data, 'post')(null, { id: 1 })).toEqual({
        post: {
            id: 1,
            value: 'foo',
        },
    });
    expect(data).toEqual([{ id: 2, value: 'bar' }]);
});

test('returns undefined when not found', () => {
    const data = [{ id: 1, value: 'foo' }, { id: 2, value: 'bar' }];
    expect(deleteMutation(data, 'post')(null, { id: 3 })).toBeUndefined();
});

test('leaves data unmodified when not found', () => {
    const data = [{ id: 1, value: 'foo' }, { id: 2, value: 'bar' }];
    const originalData = [...data];
    expect(deleteMutation(data, 'post')(null, { id: 3 })).toBeUndefined();
    expect(data).toEqual(originalData);
});

test('deleteMutations record when found', () => {
    const data = [{ id: 1, value: 'foo' }, { id: 2, value: 'bar' }];
    deleteMutation(data, 'post')(null, { id: 1 });
    expect(data).toEqual([{ id: 2, value: 'bar' }]);
});
