import { addObject } from './ldapHelpers';
import { user } from './config';

enum Group {
    'ACMPaid',
    'ACMNotPaid',
    'ACMAlumni',
    'ACMTemp',
    'ACMDefuntAccount',
}

export interface User {
    firstname: string;
    lastname: string;
    middlename?: string;
    displayname?: string;
    username: string;
    email: string;
    phone?: string;
    netid: string;
    title: string;
    uin: string;    // Store as string, not number; won't be doing math with it
    major: string;
    college: string; // TODO: enum?
    uid: string;
    gid: string;
    password: string;
    toLdapObject(): {};
    getNewUID(): Promise<void>;
    setNewUID(): Promise<void>;
    User(): void;
    encryptPassword(password: string): string;
    generatePassword(): string;
    authenticateUser(): Promise<void>;
}

export class User implements User {

    toLdapObj(): {} {
        return {
            givenName: this.firstname,
            sn: this.lastname,
            middleName: this.middlename,
            displayName: (this.displayname) ? this.displayname : `${this.firstname} ${this.lastname}`,
            cn: this.username,
            mail: this.email,
            uid: this.uid,
            title: this.title,
            telephone: this.phone,
            userPrincipalName: `${this.username}@${user.domain}`,
            sAMAccountName: this.username,
            objectClass: user.userObjectClass,
            userPassword: this.encryptPassword(this.password),
            msSFU30NisDomain: user.msSFU30NisDomain,
            uidNumber: this.getNewUID(),
            gidNumber: user.defaultGid,
            loginShell: user.loginShell,
            unixHomeDirectory: `${user.homeDirectory}/${this.username}`,
            primaryGroupID: user.primaryGroupID,
            employeeID: this.uin,
        };
    }
    encryptPassword(password: string): string { return password; }
    generatePassword(): string {
        const length = 14;
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let retVal = '';
        for (let i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }
    async getNewUID(): Promise<void> { }
    async setNewUID(): Promise<void> { }
    async authenticateUser(): Promise<void> { }

    User(): void {
        const now = new Date();
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
            'September', 'October', 'November', 'December'];
        const ou = `OU=${months[now.getMonth()]},OU=${now.getFullYear()},${user.baseOU}`;
        addObject(this.username, ou, this.toLdapObj());
    }

}
