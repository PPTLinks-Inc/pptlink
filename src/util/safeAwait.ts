async function safeAwait<T, E = Error>(promise: Promise<T>): Promise<[null, T] | [E, null]> {
    try {
        const result = await promise;
        return [null, result];
    } catch(err) {
        return [err as E, null];
    }
}

export default safeAwait;