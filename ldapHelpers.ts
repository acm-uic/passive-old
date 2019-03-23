import { createClient, Error, Client, Change } from 'ldapjs';
import { domain } from './config';

async function getBind(): Promise<[Error, Client]> {
    return new Promise(async (resolve, reject) => {
        const client = createClient({
            url: domain.host,
            tlsOptions: {
                rejectUnauthorized: false,
            },
        });
        client.bind(domain.bindUsername, domain.bindPassword, (err, data) => {
            resolve([err, client]);
        });
    });
}

export async function addObject(name: string, ou: string, newObject: any): Promise<void> {
    return new Promise(async (resolve, reject) => {
        const dn = String(`${name},${ou}${domain.baseDN}`);
        const [error, client] = await getBind();
        if (error) {
            return reject(error);
        }
        for (const key in newObject) {
            if (newObject[key] === undefined) {
                delete newObject[key];
            }
        }
        client.add(dn, newObject, (err: Error) => {
            if (error) {
                return reject(error);
            }
            delete newObject.userPassword;
            resolve(newObject);
        });
        client.unbind(e => reject(e));
    });
}

export async function removeObject(dn: string): Promise<{}> {
    return new Promise(async (resolve, reject) => {
        const [error, client] = await getBind();
        if (error) {
            return reject(error);
        }
        client.del(dn, async (err: Error) => {
            if (err) {
                return reject(err);
            }
            resolve({ success: true });
        });
        client.unbind(e => reject(e));
    });
}

export async function modifyDN(oldDN: string, newDN: string): Promise<{}> {
    return new Promise(async (resolve, reject) => {
        const [error, client] = await getBind();
        if (error) {
            return reject(error);
        }
        try {
            client.modifyDN(oldDN, newDN, (err: Error) => {
                if (err) {
                    return reject({ message: err.message });
                }
                return resolve({ success: true });
            });
        } catch (e) {
            return reject({ message: e.message });
        }
        client.unbind(e => reject(e));
    });
}

export async function updateObject(dn: string, change: Change): Promise<void> {
    return new Promise(async (resolve, reject) => {
        const [error, client] = await getBind();
        if (error) {
            return reject(error);
        }
        try {
            client.modify(dn, change, (error) => {
                if (error) {
                    return reject(error);
                }
                resolve();
            });
        } catch (e) {
            return reject({ message: e.message });
        }
        client.unbind(e => reject(e));
    });
}

export async function searchObject(searchDN: string, opts: {}): Promise<{ [attribute: string]: any }> {
    return new Promise(async (resolve, reject) => {
        const [error, client] = await getBind();
        if (error) {
            return reject(error);
        }
        try {
            client.search(searchDN, opts, (error, res) => {
                if (error) {
                    return reject(error);
                }
                res.on('searchEntry', (entry) => {
                    return resolve(entry.object);
                });
                res.on('error', (error) => {
                    return reject({ message: error.message });
                });
            });
        } catch (e) {
            return reject({ message: e.message });
        }
        client.unbind(e => reject(e));
    });
}
