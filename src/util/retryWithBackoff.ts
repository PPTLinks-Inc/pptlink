export default async function<T>(promise: Promise<T>, retries: number = 5, delay: number = 1000): Promise<T> {
    for (let i = 0; i < retries; i++) {
        try {
            return await promise;
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(res => setTimeout(res, delay * Math.pow(2, i)));
        }
    }
    throw new Error("Unreachable");
}
