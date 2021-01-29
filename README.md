# JavaScript Weighted Load Balancer

## Running the load balancer
`cd` into root dir
`node index.js`


## CLI Usage:
#### Print CLI usage instructions
`help`

#### Call loadBalancer.handle()
`handle [numIterations] [--noprint]`
- numIterations is the number of times the handler will be called. Defaults to 1 if not specified.
- --noprint flag indicates that only the output distribution stats should be printed. Useful for large number of iterations
- example: `handle 10000 --noprint`

#### Add a server
`add <ipAddress> [weight]`
- adds server to loadBalancer with given weight, or default weight of 1 if not specified
- example: `add 10.10.10.10 5`

#### Remove a server
`remove <ipAddress>`
- removes server from loadBalancer
- example: `remove 10.10.10.10`

#### Print server list
`show`
- prints current servers in loadBalancer

#### Exit
`exit`
- exits CLI


## Configuration
The load balancer is initialized using the data in ./config/config.json.

The config file must contain a json object with a key of "servers" followed by an array 
of objects representing the servers. Server objects must have a key of "address" followed 
by a valid ip address, and an (optional) key of "weight" followed by a numeric weight. If 
no weight is provided,the default is 1.

