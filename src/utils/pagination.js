export const paginate = (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    
    return {
        skip: (page - 1) * limit,
        take: limit
    }
};