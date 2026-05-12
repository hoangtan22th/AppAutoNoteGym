import { LRUCache } from 'lru-cache';

export default function rateLimit(options: any) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 1000,
    ttl: options?.interval || 60000,
  });

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number) || 0;
        const nextCount = tokenCount + 1;
        
        tokenCache.set(token, nextCount);

        if (nextCount > limit) {
          return reject({
            status: 429,
            message: 'Phát hiện spam! Vui lòng tạm dừng thao tác trong 1 phút.',
          });
        }
        resolve();
      }),
  };
}
