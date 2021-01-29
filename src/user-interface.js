const { rl } = require('./reader');
const utils = require('./utils');

class UserInterface {
    constructor(loadBalancer) {
        this.loadBalancer = loadBalancer;
    }

    async run() {
        console.log("Type 'help' to see available commands.");
        for await (const line of rl) {
            console.log("-----------------------------------");
            this.processInput(line);
            console.log("-----------------------------------");
        }
    }

    processInput(userInput) {
        userInput = userInput.split(' ');
        const action = userInput[0];
        const options = userInput.slice(1);
        switch (action) {
            case 'help':
                this.printInstructions();
                break;
            case 'handle':
                this.handle(options);
                break;
            case 'add':
                this.addServer(options);
                break;
            case 'remove':
                this.removeServer(options);
                break;
            case 'show':
                this.showServers();
                break;
            case 'exit':
                this.exit();
                break;
            default:
                console.log("Not a valid action. Type 'help' to see available commands.");
                break;
        }
    }

    printInstructions() {
        console.log('\nUsage:\n');
        console.log('<command> [options]');
        console.log('\n\nCommands:\n')
        console.log('handle [numIterations] [--noprint]    // calls loadBalancer.handle() numIterations times (or default 1) and prints output. Use --noprint to only print distribution stats');
        console.log('add <ipAddress> [weight]              // adds server to loadBalancer with given weight, or default 1');
        console.log('remove <ipAddress>                    // removes server from loadBalancer');
        console.log('show                                  // prints current servers in loadBalancer');
        console.log('exit                                  // exits CLI');
        console.log('\n\nExamples:\n');
        console.log('handle                                // calls loadBalancer.handle() once');
        console.log('handle 100                            // calls loadBalancer.handle() 100 times');
        console.log('handle 1000  --noprint                // calls loadBalancer.handle() 1000 times and only prints distribution stats');
        console.log('add 192.168.1.4                       // adds server to loadBalancer with a default weight of 1');
        console.log('add 192.168.1.4 5                     // adds server to loadBalancer with weight of 5');
        console.log('remove 192.168.1.4                    // removes server from loadBalancer\n');
    }

    handle(options) {
        // default number of calls to loadBalancer.handle()
        let iters = 1;

        // validate and process options
        if (utils.isNumeric(options[0])) {
            iters = Number(options[0]);
        }
        if (options[0] === '--noprint' || options[1] === '--noprint') {
            this.loadBalancer.setPrint(false);
        }

        // call loadBalance handler and track output stats
        const counts = {};
        for (let i = 0; i < iters; i++) {
            const addr = this.loadBalancer.handle();
            counts[addr] = ++counts[addr] || 1;
        }

        // convert address counts to percentage of total
        for (const addr in counts) {
            const count = counts[addr];
            counts[addr] = (count / iters) * 100;
        }

        console.log(`\nPercent distribution:`);
        console.log(counts);
        this.loadBalancer.setPrint(true);
    }
    
    addServer(options) {
        // construct server object and add to load balancer
        const server = { address: options[0] };
        if (utils.isNumeric(options[1])) server.weight = Number(options[1]);
        this.loadBalancer.addServer(server);

        console.log('Current servers: ');
        console.log(this.loadBalancer.getServers());
    }
    
    removeServer(options) {
        // construct server object and remove from load balancer
        const server = { address: options[0] };
        this.loadBalancer.removeServer(server);

        console.log('Current servers: ');
        console.log(this.loadBalancer.getServers());
    }

    showServers() {
        console.log('Current servers: ');
        console.log(this.loadBalancer.getServers());
    }

    exit() {
        console.log('Bye bye.');
        process.exit();
    }
}

module.exports = UserInterface;