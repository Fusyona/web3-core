import ApiKeyGetter from "../lib/api-key-getter/api-key-getter";
import HardhatApiKeyGetter from "../lib/api-key-getter/hardhat-api-key-getter";
import { NetworkConfigs } from "../lib/config";

describe("NetworkConfigs", () => {
    before(() => {
        ApiKeyGetter.setInstance(new HardhatApiKeyGetter());
    });

    describe("networks()", () => {
        it("should be called with no arguments", () => {
            const configs = new NetworkConfigs("remote");
            configs.networks();
        });
    });
});
