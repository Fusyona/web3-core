import { vars } from "hardhat/config";
import ApiKeyGetter from "./static-api-key-getter";

export default class HardhatApiKeyGetter implements ApiKeyGetter {
    get(apiKeyName: string): string {
        return vars.get(apiKeyName);
    }
}
