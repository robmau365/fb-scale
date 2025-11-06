function validateStrategy(params) {
    if (!params) {
        throw new Error('Strategy parameters are required');
    }

    const { type, audience } = params;

    if (type && !['ads', 'content', 'marketplace', 'subscriptions'].includes(type)) {
        throw new Error('Invalid strategy type');
    }

    if (audience && typeof audience !== 'object') {
        throw new Error('Audience must be an object');
    }

    return true;
}

module.exports = {
    validateStrategy
};