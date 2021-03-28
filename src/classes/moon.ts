import {FirstNewMoonDate, MoonPhase, MoonTemplate} from "../interfaces";
import Year from "./year";

export default class Moon{

    name: string;

    cycleLength: number;

    phases: MoonPhase[] = [];

    firstNewMoon: FirstNewMoonDate = {
        year: 0,
        month: 1,
        day: 1
    };


    constructor(name: string, cycleLength: number) {
        this.name = name;
        this.cycleLength = cycleLength;

        this.phases.push({
            name: game.i18n.localize('FSC.Moon.Phase.New'),
            length: 3.69
        });
    }

    clone(){
        const c = new Moon(this.name, this.cycleLength);
        c.phases = this.phases.map(p => { return { name: p.name, length: p.length };});
        c.firstNewMoon.year = this.firstNewMoon.year;
        c.firstNewMoon.month = this.firstNewMoon.month;
        c.firstNewMoon.day = this.firstNewMoon.day;
        return c;
    }

    toTemplate(year: Year): MoonTemplate {
        const data: MoonTemplate = {
            name: this.name,
            cycleLength: this.cycleLength,
            firstNewMoon: this.firstNewMoon,
            phases: this.phases,
            dayList: []
        };

        const month = year.months.find(m => m.numericRepresentation === data.firstNewMoon.month);

        if(month){
            data.dayList = month.days.map(d => d.toTemplate());
        }

        return data;
    }

    updatePhaseLength(){
        const phaseLength = Number((this.cycleLength / this.phases.length).toPrecision(5));
        this.phases.forEach(p => p.length = phaseLength);
    }

    getMoonPhase(year: Year){
        const lunarSeconds = this.cycleLength * year.time.secondsPerDay;
        const firstNewMoonSeconds = year.time.getTotalSeconds(year.dateToDays(this.firstNewMoon.year, this.firstNewMoon.month, this.firstNewMoon.day) - 1);

        const month = year.getMonth();
        if(month){
            const day = month.getDay();
            const daysSoFar = year.dateToDays(year.numericRepresentation, month.numericRepresentation, day? day.numericRepresentation : 1, true, true) - 1;
            const totalCurrentSeconds = year.time.getTotalSeconds(daysSoFar);

            const secondsDifference = totalCurrentSeconds - firstNewMoonSeconds;

            let currentCycleSeconds = Number((secondsDifference - (Math.floor(secondsDifference/lunarSeconds) * lunarSeconds)).toPrecision(8));

            if(currentCycleSeconds < 0){
                currentCycleSeconds += lunarSeconds;
            }

            const daysIntoCycle = (currentCycleSeconds / lunarSeconds) * lunarSeconds;

            let phaseDays = 0;
            let phase: MoonPhase | null = null;
            for(let i = 0; i < this.phases.length; i++){
                const newPhaseDays = phaseDays + this.phases[i].length;
                if(daysIntoCycle >= phaseDays && daysIntoCycle < newPhaseDays){
                    phase = this.phases[i];
                    break;
                }
                phaseDays = newPhaseDays;
            }
            if(phase !== null){
                return phase;
            }
        }
        return this.phases[0];
    }

}
