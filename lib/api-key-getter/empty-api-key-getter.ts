import ApiKeyGetter from "./static-api-key-getter";

export default class EmptyApiKeyGetter implements ApiKeyGetter {
    get(_: string): string {
        return "";
    }
}
