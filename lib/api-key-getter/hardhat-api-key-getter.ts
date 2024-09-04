import { vars } from "hardhat/config";
import ApiKeyGetter from "./api-key-getter";

export default class HardhatApiKeyGetter extends ApiKeyGetter {
    get(apiKeyName: string): string {
        return vars.get(apiKeyName);
    }
}
