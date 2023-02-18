import { Chain, Common, Hardfork } from "@ethereumjs/common";

export const common = new Common({
	chain: Chain.Rinkeby,
	hardfork: Hardfork.Istanbul,
});
