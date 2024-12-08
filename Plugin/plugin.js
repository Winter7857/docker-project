// const grpc = require('@grpc/grpc-js');
// const protoLoader = require('@grpc/proto-loader');

// // Load the .proto file
// const PROTO_PATH = './clicker.proto';
// const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
//   keepCase: true,
//   longs: String,
//   enums: String,
//   defaults: true,
//   oneofs: true,
// });
// const clickerProto = grpc.loadPackageDefinition(packageDefinition).ClickerPluginService;


// // Implement the IncrementByPlugin method
// function incrementByPlugin(call, callback) {
//   const value = call.request.value;
//   console.log(`Received value in plugin: ${value}`);
//   callback(null, { result: value + 2 }); // Add 2 to the input value
// }



// // Create a gRPC server
// const server = new grpc.Server();
// server.addService(clickerProto.service, { IncrementByPlugin: incrementByPlugin });

// // Start the gRPC server
// const PORT = process.env.PLUGIN_PORT || 50051;
// server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
//   server.start();
//   console.log(`Plugin server running on port ${PORT}`);
// });
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load the .proto file
const PROTO_PATH = './clicker.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const clickerProto = grpc.loadPackageDefinition(packageDefinition).ClickerPluginService;

// Plugin state
let pluginEnabled = true;

// Implement the IncrementByPlugin method
function incrementByPlugin(call, callback) {
  const value = call.request.value;
  console.log(`Received value in plugin: ${value}`);

  if (pluginEnabled) {
    callback(null, { result: value + 2 }); // Increment by 2
  } else {
    callback(null, { result: value }); // No increment
  }
}

// Implement the TogglePlugin method
function togglePlugin(call, callback) {
  pluginEnabled = !pluginEnabled;
  console.log(`Plugin toggled: ${pluginEnabled ? 'Enabled' : 'Disabled'}`);
  callback(null, { pluginEnabled });
}

// Create a gRPC server
const server = new grpc.Server();
server.addService(clickerProto.service, {
  IncrementByPlugin: incrementByPlugin,
  TogglePlugin: togglePlugin,
});

// Start the gRPC server
const PORT = process.env.PLUGIN_PORT || 50051;
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
  server.start();
  console.log(`Plugin server running on port ${PORT}`);
});
