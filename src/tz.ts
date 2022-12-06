const DateTimeFormat = Intl.DateTimeFormat;

const parseTZ = (tz: string) => {
    const m = +tz.replace(/:/g, "");
    return Math.trunc(m / 100) * 60 + (m % 100);
};

let longOffset: "longOffset";
let partsToOffset: (parts: Intl.DateTimeFormatPart[], dt?: Date) => number;

/**
 * Node v16 and below does NOT support {timeZoneName: "longOffset"} option
 * Node v18 however supports it.
 */
const checkLongOffset = () => {
    try {
        const tzn = "longOffset";
        getDateTimeFormat("Asia/Tokyo", tzn);
        longOffset = tzn;
        partsToOffset = parseTimeZoneName; // node v18
    } catch (e) {
        // RangeError: Value longOffset out of range for Intl.DateTimeFormat options property timeZoneName
        partsToOffset = calcTimeZoneOffset; // node v16
    }
};

const getDateTimeFormat = (timeZone: string, timeZoneName: typeof longOffset): Intl.DateTimeFormat => {
    return new DateTimeFormat("en-US", timeZoneName ?
        // node v18
        {timeZone, timeZoneName} :
        // node v16
        {timeZone, hour12: false, weekday: "short", day: "numeric", hour: "numeric", minute: "numeric"});
};

class TZ {
    // fixed
    private m: number;

    // Asia/Tokyo - IANA time zone name
    private tz: string;

    // last offset cache
    private c: { [ms: string]: number };

    constructor(tz: string) {
        if (/\//.test(tz)) {
            this.tz = tz;
        } else {
            this.m = parseTZ(tz);
        }
    }

    /**
     * returns time zone offset in minutes
     */
    tzo(ms: number): number {
        const self = this;
        if (self.m != null) return self.m;

        let offset = self.c && self.c[ms];
        if (offset != null) return offset;

        const dt = new Date(ms);
        const {tz} = self;

        if (!partsToOffset) checkLongOffset();
        const f = DateTimeFormat && getDateTimeFormat(tz, longOffset);
        const parts = partsToOffset && f && f.formatToParts(ms);
        if (parts) {
            offset = partsToOffset(parts, dt);
        }
        if (offset == null) {
            // fallback to local time zone
            offset = -dt.getTimezoneOffset();
        }

        self.c = {};
        self.c[ms] = offset;
        return offset;
    }
}

const parseTimeZoneName: typeof partsToOffset = (parts) => {
    const part = parts.find(v => v.type === "timeZoneName");
    const value = part && part.value;
    if (/^GMT/.test(value)) {
        return parseTZ(value.substr(3));
    }
};

let weekdayMap: { [key: string]: number };

const calcTimeZoneOffset: typeof partsToOffset = (parts, dt): number => {
    if (!weekdayMap) {
        weekdayMap = {};
        ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((key, idx) => (weekdayMap[key] = idx));
    }

    const index: { [key in Intl.DateTimeFormatPartTypes]?: any } = {};
    parts.forEach(v => (index[v.type] = v.value));
    const day = (7 + dt.getUTCDay() - weekdayMap[index.weekday]) % 7;
    const hour = dt.getUTCHours() - (index.hour) % 24;
    const minutes = dt.getUTCMinutes() - index.minute;

    return -((day * 24 + hour) * 60 + minutes);
};

const tzCache: { [tz: string]: TZ } = {};

export const getTZ = (tz: string) => (tzCache[tz] || (tzCache[tz] = new TZ(tz)));
