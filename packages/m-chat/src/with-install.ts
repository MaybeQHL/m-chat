// https://github.com/youzan/vant/issues/8302
// type EventShim = {
//     new(...args: any[]): {
//         $props: {
//             onClick?: (...args: any[]) => void;
//         };
//     };
// };

export type WithInstall<T> = T & {
    install(app: any): void;
};

// using any here because tsc will generate some weird results when using generics
export function withInstall<T>(options: any): WithInstall<T> {
    options.install = (app: any, opts) => {
        const { name } = options as any;
        app.component(name, options);
    };

    return options;
}