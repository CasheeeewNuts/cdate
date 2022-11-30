/**
 * strftime
 */

import type {cDateNS} from "../types/cdate";
import {en_US} from "../locale/en_US";
import {common} from "./common";

type PickSpec = (spec: string) => (string | ((dt: cDateNS.RODate) => (string | number)));

const merge = (a: PickSpec, b?: PickSpec): PickSpec => b ? (spec => (a(spec) || b(spec))) : a;

const picker = (locale: cDateNS.Locale): PickSpec => spec => locale[spec];

const factory = (pick: PickSpec) => {
    const strftime: cDateNS.strftime = (fmt, dt) => {
        return fmt.replace(/%(?:-?[a-zA-Z%]|:z)/g, spec => {
            const fn = pick(spec);

            if ("function" === typeof fn) {
                return fn(dt) as string;
            } else if (fn == null) {
                return spec; // Unsupported specifiers
            } else {
                return strftime(String(fn), dt) as string; // recursive call
            }
        });
    };

    strftime.extend = locale => factory(merge(picker(locale), pick));

    return strftime;
};

export const strftime = factory(picker(common)).extend(en_US);
