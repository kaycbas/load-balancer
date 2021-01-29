module.exports.isNumeric = val => {
  return !isNaN(val);
}

module.exports.isValidAddress = ipAddress => {
  const validIp = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return validIp.test(ipAddress);
}

module.exports.isValidServer = server => {
  if (server && server.address) {
    this.ensureWeight(server);
    return this.isValidAddress(server.address)
  }
  return false;
}

module.exports.areValidServers = servers => {
  for (let server of servers) {
    if (!this.isValidServer(server)) return false;
    this.ensureWeight(server);
  }
  return true;
}

module.exports.ensureWeight = server => {
  if (!('weight' in server)) {
    server.weight = 1;
  } else if (server.weight < 0) {
    server.weight = 0;
  }
}

