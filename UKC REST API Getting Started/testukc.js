'use strict'
/**
 * This is a simple program that demonstrates the use of UKC REST Api
 * It will connect to a UKC server, create a new partition and add a user
 */
const UkcAdminApi = require('ukc_admin_api');
const defaultClient = UkcAdminApi.ApiClient.instance;
// set server base url here
defaultClient.basePath = 'https://ec2-52-15-224-136.us-east-2.compute.amazonaws.com:8443';

// This is required if your server is using a self signed certificate
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const DEFAULT_PASSWORD = 'Password1!';

// Configure HTTP basic authorization: basicAuth
const basicAuth = defaultClient.authentications['basicAuth'];
basicAuth.username = 'so@root';
basicAuth.password = DEFAULT_PASSWORD;

const generalApi = new UkcAdminApi.GeneralApi()
const partitionsApi = new UkcAdminApi.PartitionsApi()
const usersApi = new UkcAdminApi.UsersApi();

const log = (text) => console.log(text);

async function test() {
  let serverInfo = await generalApi.getSystemInfo();
  log(`Successfully connected to server. Version is: ${serverInfo.version}`);

  //list partitions
  let partitions = await partitionsApi.listPartitions();
  log(`Partitions: ${partitions.map(p => p.name)}`)

  // add a new partition
  const newPartitionName = 'testapi';
  log(`Creating partition '${newPartitionName}'`);
  try {
    await partitionsApi.createPartition(
      {
        body: {
          name: newPartitionName,
          soPassword: DEFAULT_PASSWORD,
          newClient: {
            name: 'client1',
            pfxPassword: DEFAULT_PASSWORD
          }
        }
      })
    log(`Partition ${newPartitionName} created Successfully`)
  } catch(e) {
    if(e.status === 409) {
      log(`Partition ${newPartitionName} already exists`);
    } else {
      throw e;
    }
  }

  // list users of new partition
  basicAuth.username = `so@${newPartitionName}`;
  let users = await usersApi.listUser(newPartitionName);
  log(`${newPartitionName} partition users: ${users.map(u => u.name)}`);

  // adding an so
  const newUserName = `user_${users.length + 1}`;
  const fullUserName = `${newUserName}@${newPartitionName}`;
  log(`Adding user ${fullUserName}`);
  await usersApi.createUser({
    partitionId: newPartitionName,
    body: {
      name: newUserName,
      role: 'SO',
      password: DEFAULT_PASSWORD
    }
  });
  log(`User ${fullUserName} created Successfully`);
}

test()
.then(() => log(`Test script completed successfully`))
.catch(e => {
  log(e);
})
