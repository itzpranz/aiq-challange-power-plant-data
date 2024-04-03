import powerPlantData from '../data/powerplant.json';

const powerPlantDataSortedByNet = (powerPlantData as Array<any>).sort((a: any, b: any) => b.PLNGENAN - a.PLNGENAN);

export function getPowerPlantData(state: string = "All", limit: number = 10) {
    if (state === "All") {
        return powerPlantDataSortedByNet.slice(0, limit);
    }
    return powerPlantDataSortedByNet.filter((plant: any) => plant.PSTATABB === state).slice(0, limit);
}