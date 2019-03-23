import { Change } from 'ldapjs';
import { domain } from './config';
import { searchObject, updateObject } from './ldapHelpers';

export async function incrementUid() {
    const ypserversDn = `CN=${domain.netbiosName},CN=ypservers,CN=ypServ30,CN=RpcServices,CN=System,
    ${domain.baseDN}`;

    const searchRes = await searchObject(ypserversDn, {});
    const currentUid = searchRes['msSFU30MaxGidNumber'];
    const nextUid = (Number(currentUid) + 1).toString();

    const change = new Change({
        operation: 'replace',
        modification: {
            msSFU30MaxGidNumber: nextUid,
        },
    });

    await updateObject(ypserversDn, change);
}

export async function incrementGid() {
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
}
