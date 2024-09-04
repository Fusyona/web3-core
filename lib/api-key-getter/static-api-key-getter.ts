import ApiKeyGetter from "./api-key-getter";
import EmptyApiKeyGetter from "./empty-api-key-getter";

export default class StaticApiKeyGetter {
    private static instance: ApiKeyGetter = new EmptyApiKeyGetter();

    static get(apiKeyName: string) {
        return StaticApiKeyGetter.instance.get(apiKeyName);
    }

    static setInstance(instance: ApiKeyGetter) {
        StaticApiKeyGetter.instance = instance;
    }
}
