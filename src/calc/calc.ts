import type {cdate} from "../../index.js";
import {add} from "./add.js";
import {startOf} from "./startof.js";

export const calcPlugin: cdate.cPlugin<cdate.CDateCalc> = (Parent) => {
    return class CDateCalc extends Parent implements cdate.CDateCalc {
        /**
         * returns a new CDate object manipulated
         */
        startOf(unit: cdate.UnitForStart) {
            const dt = this.rw();
            startOf(dt, unit);
            return this.create(dt);
        }

        /**
         * returns a new CDate object manipulated
         */
        endOf(unit: cdate.UnitForStart) {
            const dt = this.rw();
            startOf(dt, unit);
            add(dt, 1, unit);
            add(dt, -1);
            return this.create(dt);
        }

        /**
         * returns a new CDate object manipulated
         */
        add(diff: number, unit: cdate.UnitForAdd) {
            const dt = this.rw();
            add(dt, diff, unit);
            return this.create(dt);
        }

        /**
         * returns a new CDate object manipulated
         */
        next(unit: cdate.UnitForNext) {
            return this.add(1, unit);
        }

        /**
         * returns a new CDate object manipulated
         */
        prev(unit: cdate.UnitForNext) {
            return this.add(-1, unit);
        }
    }
};
