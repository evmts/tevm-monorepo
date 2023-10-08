# Why actions

The backbone of EVMts is its Actions. These simple JSON-serializable objects instruct an EVMts handler on which operations to execute. Embracing Actions brings an array of advantages:

- **Predictable**: Actions make the state management and listening of ever changing chain state much safer and predictable
- **Intuitive Usage**: Navigate EVMts seamlessly. No need to remember specific APIs – import a Contract or any actionCreator and utilize autocomplete.
- **Optimal Code Splitting**: While class-based APIs like ethers.js are user-centric, they don't excel in code splitting. Action-based APIs merge the strengths of both worlds.
- **Enhanced LSP Support**: The JSON format of contract actions enables EVMts LSP to offer direct go-to-definition, natspec comments on hover, and transparent solidity contract imports.
- **Debuggable**: Experience advanced dev tools for logging and time-travel debugging.
- **Highly Extendable**: Crafting custom handlers, listeners, and actionCreators for EVMts is a breeze.
- **Powerful**: Actions are the API used to interact with the formidable EVMts VM, maintaining a consistent and intuitive API across EVMts functionalities.
- **Predictable**: Use of EVMts actions create predictable state management on the client

There are 4 main concepts we will cover to gain a conceptual understanding of EVMts

1. Actions - JSON-serializable messages sent to EVMts
2. ActionCreators - Functions that create actions
3. ActionHandlers - Handlers exposed by EVMts to recieve actions
4. ActionListeners - The ability to subscribe to events within EVMts

