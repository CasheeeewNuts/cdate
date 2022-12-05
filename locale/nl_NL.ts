// nl_NL.ts

import type {cdateNS} from "../";

const weekdayShort = ["zo", "ma", "di", "wo", "do", "vr", "za"];
const weekdayLong = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];
const monthShort = ["jan.", "feb.", "mrt.", "apr.", "mei", "jun.", "jul.", "aug.", "sep.", "okt.", "nov.", "dec."];
const monthLong = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];

export const nl_NL: cdateNS.Specifiers = {
    "%a": dt => weekdayShort[dt.getDay()],
    "%A": dt => weekdayLong[dt.getDay()],
    "%b": dt => monthShort[dt.getMonth()],
    "%B": dt => monthLong[dt.getMonth()],
    "%p": dt => (dt.getHours() < 12 ? "a.m." : "p.m."),
    
    // zo 2 jan. 2022 03:04:05
    "%c": "%a %-d %b %Y %H:%M:%S",

    // 03:04:05 a.m.
    "%r": "%H:%M:%S %p",

    // 02-01-2022
    "%x": "%d-%m-%Y",

    // 03:04:05
    "%X": "%H:%M:%S",
};
