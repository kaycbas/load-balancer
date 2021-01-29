const LoadBalancer = require('./src/load-balancer');
const UserInterface = require('./src/user-interface');
const config = require('./config/config.json');

try {
    const loadBalancer = new LoadBalancer(config);
    const ui = new UserInterface(loadBalancer);
    ui.run();
} catch (e) {
    console.error(e);
    process.exit();
}