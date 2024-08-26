import { NetworkConfigs } from "../lib/config";

describe("NetworkConfigs", () => {
    describe("networks()", () => {
        it("should be called with no arguments", () => {
            const configs = new NetworkConfigs("remote");
            configs.networks();
        });
    });
});
