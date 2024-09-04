export default abstract class ApiKeyGetter {
    private static instance: ApiKeyGetter;

    static get(apiKeyName: string) {
        return ApiKeyGetter.instance.get(apiKeyName);
    }

    abstract get(apiKeyName: string): string;

    static setInstance(instance: ApiKeyGetter) {
        ApiKeyGetter.instance = instance;
    }
}
