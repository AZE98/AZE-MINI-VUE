let activeEffect: ReactiveEffect;

class ReactiveEffect {
    private _fn: Function;
    constructor(fn: Function) {
        this._fn = fn;
    }
    run () {
        activeEffect = this;
        this._fn();
    }
}

export function effect (fn: Function) {
    // fn
    const _effect = new ReactiveEffect(fn);

    _effect.run();
}

const targetMap = new Map();
export function track (target: object, key: string | symbol) {
    // target -> key -> dep
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()));
    }

    let dep = depsMap.get(key);
    if (!dep) {
        depsMap.set(key, (dep = new Set<ReactiveEffect>()));
    }
    dep.add(activeEffect);
}

export function trigger (target: object, key: string | symbol) {
    let depsMap = targetMap.get(target);
    let dep = depsMap.get(key);

    for (const effect of dep) {
        effect.run();
    }
}