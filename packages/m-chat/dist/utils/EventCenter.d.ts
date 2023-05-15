declare class EventCenter {
    el: HTMLElement;
    customEvents: string[];
    acticeEvents: {
        name: string;
        func: (e: any) => any;
    }[];
    constructor(el: HTMLElement);
    on(name: string, func: (e: any) => any): void;
    off(name: string): void;
    destroy(): void;
}
export default EventCenter;
