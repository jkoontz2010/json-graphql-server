export default (entityData = []) => (_, { page, perPage = 25 }) => {
    let items = [...entityData];
    /* !!! removing sort. works differently from BE, just not going to mock it now
    if (sortField) {
        const direction = sortOrder.toLowerCase() == 'asc' ? 1 : -1;
        items = items.sort((a, b) => {
            if (a[sortField] > b[sortField]) {
                return direction;
            }
            if (a[sortField] < b[sortField]) {
                return -1 * direction;
            }
            return 0;
        });
    }
*/
    // REMOVING FILTERING so we can allow for the search param inside the query
    // items = applyFilters(items, filter);

    if (page !== undefined && perPage) {
        items = items.slice(page * perPage, page * perPage + perPage);
    }

    return items;
};
