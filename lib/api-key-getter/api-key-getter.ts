export default interface ApiKeyGetter {
    get(apiKeyName: string): string;
}
