import { publicClient } from "../clients/publicClient";
import { HelloWorld } from "./HelloWorld.s.sol";


const executeScript = () => {
  const helloWorldScript = publicClient.script(HelloWorld);
return helloWorldScript // [!code focus]
  .run() // [!code focus]
  .then((res) => {
    // [!code focus]
    console.log(res.data); // [!code focus]
  }); // [!code focus]

}
