

const pressStart = () => { }
const pressMove = () => { }
const pressEnd = () => { }

class EventCenter {

    el: HTMLElement;
    customEvents: string[] = ['press'];
    acticeEvents: { name: string, func: (e) => any }[] = [];

    constructor(el: HTMLElement) {
        this.el = el;
    }

    on(name: string, func: (e) => any) {
        if (!this.customEvents.includes(name)) {
            this.el.addEventListener(name, func)
            this.acticeEvents.push({ name, func })
            console.log(name, '事件注册成功')
        }
    }

    off(name: string) {
        const index = this.acticeEvents.findIndex(it => it.name == name);
        if (index == -1) return;
        this.el.removeEventListener(name, this.acticeEvents[index].func)
        this.acticeEvents.splice(index, 1);
    }

    destroy() {
        this.acticeEvents.forEach((it) => {
            if (!this.customEvents.includes(it.name)) this.el.removeEventListener(it.name, it.func);

            console.log(it.name, '事件销毁成功')
        })
        this.acticeEvents = [];
    }

}

export default EventCenter