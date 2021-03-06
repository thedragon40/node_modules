import { AlphabetLowercase, AlphabetUppercase } from './alphabet';
export declare type DefaultContext<T> = {
    options: IOptionFlag<T>;
    flags: {
        [k: string]: string;
    };
};
export declare type Default<T> = T | ((context: DefaultContext<T>) => T);
export declare type IFlagBase<T, I> = {
    name: string;
    char?: AlphabetLowercase | AlphabetUppercase;
    description?: string;
    helpLabel?: string;
    hidden?: boolean;
    required?: boolean;
    dependsOn?: string[];
    exclusive?: string[];
    exactlyOne?: string[];
    /**
     * also accept an environment variable as input
     */
    env?: string;
    parse(input: I, context: any): T;
};
export declare type IBooleanFlag<T> = IFlagBase<T, boolean> & {
    type: 'boolean';
    allowNo: boolean;
    /**
     * specifying a default of false is the same not specifying a default
     */
    default?: Default<boolean>;
};
export declare type IOptionFlag<T> = IFlagBase<T, string> & {
    type: 'option';
    helpValue?: string;
    default?: Default<T | undefined>;
    multiple: boolean;
    input: string[];
    options?: string[];
};
export declare type Definition<T> = {
    (options: {
        multiple: true;
    } & Partial<IOptionFlag<T[]>>): IOptionFlag<T[]>;
    (options: ({
        required: true;
    } | {
        default: Default<T>;
    }) & Partial<IOptionFlag<T>>): IOptionFlag<T>;
    (options?: Partial<IOptionFlag<T>>): IOptionFlag<T | undefined>;
};
export declare type EnumFlagOptions<T> = Partial<IOptionFlag<T>> & {
    options: T[];
};
export declare type IFlag<T> = IBooleanFlag<T> | IOptionFlag<T>;
export declare function build<T>(defaults: {
    parse: IOptionFlag<T>['parse'];
} & Partial<IOptionFlag<T>>): Definition<T>;
export declare function build(defaults: Partial<IOptionFlag<string>>): Definition<string>;
export declare function boolean<T = boolean>(options?: Partial<IBooleanFlag<T>>): IBooleanFlag<T>;
export declare const integer: Definition<number>;
export declare function option<T>(options: {
    parse: IOptionFlag<T>['parse'];
} & Partial<IOptionFlag<T>>): IOptionFlag<T | undefined>;
declare const stringFlag: Definition<string>;
export { stringFlag as string };
export declare const defaultFlags: {
    color: IBooleanFlag<boolean>;
};
export declare type Output = {
    [name: string]: any;
};
export declare type Input<T extends Output> = {
    [P in keyof T]: IFlag<T[P]>;
};
