const utils = require('./utils');

class LoadBalancer {
    constructor(config) {
        if (!utils.areValidServers(config.servers)) {
            this.servers = [];
            throw 'Invalid servers in config file. Please refer to README for proper formatting.';
        }
        this.servers = config.servers;
        this.doesPrint = config.doesPrint;
        this.sumWeights();
    }

    sumWeights() {
        this.totalWeight = this.servers.reduce((sum, server) => (
            server.weight > 0 ? sum + server.weight : sum
        ), 0);
    }

    getServers() {
        return this.servers;
    }

    setPrint(doesPrint) {
        this.doesPrint = doesPrint;
        return this;
    }

    addServer(server) {
        if (!utils.isValidServer(server)) {
            console.log('\nInvalid server. Nothing added.\n');
            return this.servers;
        }
        utils.ensureWeight(server);
        this.servers.push(server);
        this.sumWeights();

        console.log('Successfully added server.\n');
        return this.servers;
    }

    removeServer(server) {
        if (!utils.isValidServer(server)) {
            console.log('\nInvalid server. Nothing removed.\n');
            return this.servers;
        }

        const address = server.address;
        const prevLength = this.servers.length;
        this.servers = this.servers.filter(server => server.address !== address);

        if (this.servers.length === prevLength) {
            console.log('\nServer not found. Nothing removed.\n')
        } else {
            this.sumWeights();
            console.log('Successfully removed server.\n');
        }
        return this.servers;
    }

    fetchWeighted() {
        const threshold = Math.random() * this.totalWeight;

        let sum = 0;
        for (const server of this.servers) {
            if (server.weight > 0) sum += server.weight;
            if (threshold < sum) return server.address;
        }
        
        // should never reach
        // if it does reach, totalWeight is wrong, so we need to recalculate
        this.sumWeights();
        return this.servers[this.servers.length - 1].address;
    }

    handle() {
        const address = this.fetchWeighted();
        if (this.doesPrint) console.log(`Output: ${address}`);
        return address;
    }
}

module.exports = LoadBalancer;