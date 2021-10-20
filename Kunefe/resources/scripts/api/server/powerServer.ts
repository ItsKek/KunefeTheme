import http from '@/api/http';

export default (uuid: string, signal: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        http.post(`/api/client/servers/${uuid}/power`, { signal })
            .then(() => resolve())
            .catch(reject);
    });
};
