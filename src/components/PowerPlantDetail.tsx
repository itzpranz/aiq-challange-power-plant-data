import { dataPointMapping } from "@/lib/dataPointMapping";
import { useEffect } from "react";

interface PowerPlantDetailProps {
    powerplant: any;
}
export default function PowerPlantDetail({powerplant}: PowerPlantDetailProps) {
    useEffect(() => {
        console.log("PowerPlantDetail",powerplant);
    }, [powerplant]);
  return (
    <div className="p-4">
      <h1 className="text-xl">Power Plant Detail</h1>
      {powerplant ? <ul>
        {
            Object.keys(dataPointMapping).map((key: string) => {
                return <li key={key} className="text-black dark:text-white text-sm list-disc"><span className="font-bold">{dataPointMapping[key]}:</span> {powerplant[key]}</li>
            })
        }
      </ul> : <p className="text-sm">Select a power plant to view details</p>    }
    </div>
  );
} 