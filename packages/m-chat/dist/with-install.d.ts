export type WithInstall<T> = T & {
    install(app: any): void;
};
export declare function withInstall<T>(options: any): WithInstall<T>;
