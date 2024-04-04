'use client';
import PowerPlantDetail from "@/components/PowerPlantDetail";
import USAMap from "@/components/USAMap";
import { stateList } from "@/lib/stateList";
import { useEffect, useState } from "react";

export default function Home() {
  const [powerplants, setPowerplants] = useState([]);
  const [limit, setLimit] = useState(10);
  const [formLimit, setFormLimit] = useState(10);
  const [message, setMessage] = useState("");
  const [selectedPowerPlant, setSelectedPowerPlant] = useState(null);

  useEffect(() => {
    getPowerPlantData({name: "All", code: "All"}, limit);
  }, [limit]);

  function getPowerPlantData(state: { code: string, name: string}, limit: number) {
    setMessage(`Getting top ${limit} power plant of ${state.name}`);
    return fetch(`/api/v1/powerplant?state=${state.code}&limit=${limit}`)
      .then((res) => res.json())
      .then((data) => {
        setPowerplants(data)
        setMessage(`Showing top ${Math.min(limit, data.length)} power plants of ${state.code === "All" ? "all states" : state.name}`)
      });
  }

  function onStateSelected(stateName: string) {
    const state = stateList.find((s) => s.name === stateName) || { code: "All", name: "All"};
    getPowerPlantData(state, limit);
    console.log(stateName);
  }

  function changeLimit(e: any) {
    setLimit(formLimit);
  }


  return (
    <main className="flex h-screen flex-col p-12">
      <div className="flex justify-between">
        <div>
          <h1 className="text-4xl font-bold">Power Plant Data</h1>
          <p className="text-lg py-4">{message}</p>
        </div>
        <form action={changeLimit}>
          <div>
          Show top <input type="number" min={1} max={20} value={formLimit} onChange={(e) => setFormLimit(parseInt(e.target.value))} className="border border-gray-300 rounded p-2" /> Power plants
          </div>
          <div className="text-center text-sm">(Press enter)</div>
        </form>
      </div>
      <div className="grid grid-cols-4 gap-12 w-full h-full p-4">
        <div className="col-span-3">
          <USAMap onStateSelected={onStateSelected} markers={powerplants} onPowerPlantSelected={powerplants => {
            console.log(powerplants);
            setSelectedPowerPlant({...powerplants})
          }}/>
        </div>
        <PowerPlantDetail powerplant={selectedPowerPlant}/>
      </div>
    </main>
  );
}
