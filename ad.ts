import * as ldap from 'ldapjs';

enum Group {
    'ACMPaid',
    'ACMNotPaid',
    'ACMAlumni',
}

interface User {
    firstname: string;
    lastname: string;
    displayname: string;
    username: string;
    email: string;
    netid: string;
    uin: string;    // Store as string, not number; won't be doing math with it
    major: string;
    college: string; // TODO: enum?
    uid: string;
    gid: string;
}

// interface ACMUser extends User {}

function getLastUID(): Promise<string> {}
function setLastUID(): Promise<void> {}

function createUser(u: User): Promise<void> {}

