import { Change } from 'ldapjs';
import { domain } from './config';
import { searchObject, updateObject } from './ldapHelpers';

export async function getNewGid(): Promise<string> {
    const ypserversDn = `CN=${domain.netbiosName},CN=ypservers,CN=ypServ30,CN=RpcServices,CN=System,
    ${domain.baseDN}`;

    const searchRes = await searchObject(ypserversDn, {});
    const currentUid = searchRes['msSFU30MaxGidNumber'];
    const nextGid = (Number(currentUid) + 1).toString();

    const change = new Change({
        operation: 'replace',
        modification: {
            msSFU30MaxGidNumber: nextGid,
        },
    });
    return new Promise((resolve, reject) => {
        updateObject(ypserversDn, change).then(() => resolve(nextGid))
            .catch(err => reject(err));
    });
}

export async function getNewUid(): Promise<string> {
    const ypserversDn = `CN=${domain.netbiosName},CN=ypservers,CN=ypServ30,CN=RpcServices,CN=System,
    ${domain.baseDN}`;

    const searchRes = await searchObject(ypserversDn, {});
    const currentUid = searchRes['msSFU30MaxUidNumber'];
    const nextUid = (Number(currentUid) + 1).toString();

    const change = new Change({
        operation: 'replace',
        modification: {
            msSFU30MaxUidNumber: nextUid,
        },
    });
    await updateObject(ypserversDn, change);
    return nextUid;
}
