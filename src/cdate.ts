import type {cdate as cdateFn, cdateNS} from "../types/cdate";
import type {DateLike} from "./datelike.js";
import {texter} from "./texter.js";
import {add} from "./add.js";
import {startOf} from "./startof.js";
import {toISO} from "./iso.js";
import {getTZ} from "./tz.js";
import {dateTZ, dateUTC} from "./datetz.js";
import {getLocale} from "./locale.js";

type Texter = typeof texter;
type TZ = ReturnType<typeof getTZ>;

interface Options {
    tx?: Texter;
    tz?: TZ;
}

export const cdate: typeof cdateFn = (dt) => {
    if (dt == null) {
        dt = new Date();
    } else if ("string" === typeof dt) {
        dt = new Date(dt);
    }
    return new CDateLocal(dt, null);
};

abstract class CDate implements cdateNS.CDate {
    /**
     * millisecond since the UNIX epoch
     */
    protected readonly t: number | DateLike;

    /**
     * read-only version of DateLike
     */
    private d: DateLike;

    /**
     * options container
     */
    protected x: Options;

    /**
     * the constructor
     */
    constructor(t: number | DateLike, x: Options) {
        this.t = t;
        if ("number" !== typeof t) {
            this.d = t;
        }
        this.x = x;
    }

    /**
     * creates another CDate object
     */
    cdate(ms: number | DateLike): this {
        return new (this.constructor as any)(ms, this.x);
    }

    /**
     * updates strftime option with the given locale
     */
    extend(handlers: cdateNS.Handlers): this {
        const out = this.cdate(+this);
        const x = out.x = copyOptions(out.x);
        x.tx = getTexter(x).extend(handlers);
        return out;
    }

    /**
     * returns a read-write version of DateLike for manipulation
     */
    protected abstract rw(): DateLike;

    /**
     * returns a read-only version of DateLike for displaying
     */
    protected ro(): DateLike {
        return this.d || (this.d = this.rw());
    }

    /**
     * returns UTC version of CDate
     */
    utc(): cdateNS.CDate {
        const x = copyOptions(this.x);
        x.tz = null;
        return new CDateUTC(+this, x);
    }

    /**
     * returns timezone version of CDate
     */
    tz(timezone: string): cdateNS.CDate {
        const x = copyOptions(this.x);
        x.tz = getTZ(timezone);
        return new CDateTZ(+this, x);
    }

    /**
     * locale
     */
    locale(lang: string): this {
        return this.extend(getLocale(lang));
    }

    /**
     * returns milliseconds since the epoch
     */
    valueOf(): number {
        return +this.ro();
    }

    /**
     * returns a raw Date object
     */
    toDate(): Date {
        return new Date(+this);
    }

    /**
     * returns a JSON string
     */
    toJSON(): string {
        return this.toDate().toJSON();
    }

    /**
     * returns an ISO string
     */
    toString(): string {
        return toISO(this.ro());
    }

    /**
     * returns a text with "YYYY-MM-DD" formatting style
     */
    format(fmt: string): string {
        return getTexter(this.x).format(fmt, this.ro());
    }

    /**
     * returns a text with "%y/%m/%d formatting style
     */
    text(fmt: string): string {
        return getTexter(this.x).strftime(fmt, this.ro());
    }

    /**
     * returns a new CDate object manipulated
     */
    startOf(unit: cdateNS.UnitForStart): this {
        const dt = this.rw();
        startOf(dt, unit);
        return this.cdate(dt);
    }

    /**
     * returns a new CDate object manipulated
     */
    endOf(unit: cdateNS.UnitForStart): this {
        const dt = this.rw();
        startOf(dt, unit);
        add(dt, 1, unit);
        add(dt, -1);
        return this.cdate(dt);
    }

    /**
     * returns a new CDate object manipulated
     */
    add(diff: number, unit: cdateNS.UnitForAdd): this {
        const dt = this.rw();
        add(dt, diff, unit);
        return this.cdate(dt);
    }

    /**
     * returns a new CDate object manipulated
     */
    next(unit: cdateNS.UnitForNext): this {
        return this.add(1, unit);
    }

    /**
     * returns a new CDate object manipulated
     */
    prev(unit: cdateNS.UnitForNext): this {
        return this.add(-1, unit);
    }
}

class CDateLocal extends CDate {
    protected rw(): DateLike {
        return new Date(+this.t);
    }
}

class CDateUTC extends CDate {
    protected rw(): DateLike {
        return dateUTC(+this.t);
    }
}

class CDateTZ extends CDateUTC {
    protected rw(): DateLike {
        return dateTZ(+this.t, this.x.tz);
    }
}

const copyOptions = (x: Options): Options => x ? Object.create(x) : {};

const getTexter = (x: Options): typeof texter => (x && x.tx || texter);
