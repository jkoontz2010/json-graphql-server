import update from './update';

test('returns undefined by default', () => {
    expect(update()(null, {})).toBeUndefined();
});

test('returns updated record when found', () => {
    const data = [{ id: 1, value: 'foo', bar: 'baz' }];
    expect(update(data, 'post')(null, { id: 1, value: 'bar' })).toEqual({
        post: {
            id: 1,
            value: 'bar',
            bar: 'baz',
        },
    });
});

test('returns undefined when not found', () => {
    const data = [{ id: 1, value: 'foo' }, { id: 2, value: 'bar' }];
    expect(update(data, 'post')(null, { id: 3 })).toBeUndefined();
});

test('updates record when found', () => {
    const data = [{ id: 1, value: 'foo' }];
    update(data, 'post')(null, { id: 1, value: 'bar', bar: 'baz' });
    expect(data).toEqual([{ id: 1, value: 'bar', bar: 'baz' }]);
});

test('deletes property when setting the value to undefined', () => {
    const data = [{ id: 1, value: 'foo' }];
    update(data, 'post')(null, { id: 1, value: undefined });
    expect(data).toEqual([{ id: 1 }]);
});
