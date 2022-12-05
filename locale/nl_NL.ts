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
    
    // zondag 2 januari 2022 om 03:04:05 +09:00
    "%c": "%A %-d %B %Y om %H:%M:%S %:z",

    // 03:04:05 a.m.
    "%r": "%H:%M:%S %p",

    // 02-01-2022
    "%x": "%d-%m-%Y",

    // 03:04:05
    "%X": "%H:%M:%S",
};
