# Passive
Active Directory managemen in wirtten in Typescript :sunglasses:.

## Dependencies
- `ldapjs`
- `nodemailer`

## Setup
- Add secrets to `secrets.json`. Refer to `secrets.json.example`.
- `npm install`
- `npm run start`

## Functions
### Add ACM Member
- Add new User (with custom attributes. Refer appendix)
- Move user to  month and year OU
- Add user to `ACMPaid` Group
- Set random password
- Send email with account details

### Remove ACM Member
- Remove user from directory

### Find Member
Find member by
- first name (`givenName`)
- last name (`sn`)
- username (`sAMAccountName`)
- uin (`UICUIN`)
- netID (`UICnetid`)
- majow (`UICMajor`)
- custom LDAP search

### Reset Password
- Reset user password with a random string.
- Send email with details

### Change status to Paid
- Add user to `ACMPaid`
- Remove user from `ACMNotPaid`

### Change status to Alumni
- Add user to `ACMAlumni`.


## Appendix
### Custom attributes
- UICnetid
- UICUIN
- UICClassLevel
- UICMajor
- UICCollege
### Defining the next UID/GID number to use
Every time a UID/GID number is assigned using Active Directory Users and Computers (ADUC), the next UID/GID number is stored inside the Active Directory. By default, ADUC starts assigning UID and GID numbers at 10000.

If you setup a new Samba AD and want to use a different start value, you will need to add the counting attributes before using ADUC for the first time:

```
# ldbedit -H /usr/local/samba/private/sam.ldb -b \
  CN=samdom,CN=ypservers,CN=ypServ30,CN=RpcServices,CN=System,DC=samdom,DC=example,DC=com
```
```
msSFU30MaxUidNumber: 10000
msSFU30MaxGidNumber: 10000
```
With the same command you can change the values. E. g. if you require to start UID numbers at 20000 and GIDs at 50000, adapt the values to your requirements:
```
msSFU30MaxUidNumber: 20000
msSFU30MaxGidNumber: 50000
```

Source (https://wiki.samba.org/index.php/Maintaining_Unix_Attributes_in_AD_using_ADUC)
### Unix Attributes
The following attributes need to be set to add functionality for UNIX based domain members.
#### Users
|Field on the "Unix Attributes" tab|Active Directory attribute|
|----------------------------------|--------------------------|
|NIS Domain                        |msSFU30NisDomain          |
|UID                               |uidNumber                 |
|Logon Shell                       |loginShell                |
|Home Directory                    |unixHomeDirectory         |
|Primary group name/GID	           |primaryGroupID            |
#### Groups
|Field on the "Unix Attributes" tab|Active Directory attribute|
|----------------------------------|--------------------------|
|NIS Domain                        |msSFU30NisDomain          |
|GID (Group ID)	                   |gidNumber                 |

(Source: https://wiki.samba.org/index.php/Installing_RSAT)
