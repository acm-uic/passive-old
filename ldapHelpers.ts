import * as ldap from 'ldapjs';
import * as  config from './config';

async function getBind(): Promise<[ldap.Error, ldap.Client]> {
    return new Promise(async (resolve, reject) => {
        const client = ldap.createClient({
            url: config.domain.host,
            tlsOptions: {
                rejectUnauthorized: false,
            },
        });
        client.bind(config.domain.bindUsername, config.domain.bindPassword, (err, data) => {
            resolve([err, client]);
        });
    });
}


export async function addObject(name: string, ou: string, newObject: any): Promise<void> {
    return new Promise(async (resolve, reject) => {
        const dn = String(`${name},${ou}${config.domain.baseDN}`);
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
    });
}

export async function updateObject(): Promise<void> { }
export async function searchObject(): Promise<void> { }

export async function getGroupMembers(): Promise<void> { }