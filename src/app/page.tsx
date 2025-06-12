"use client";

import { troops, TTroop } from "@/lib/data";
import Image from "next/image";
import { useState } from "react";

export default function HomePage() {
  const [housingSpace, setHousingSpace] = useState<number>(5);
  const [townHallLevel, setTownHallLevel] = useState<number>(1);
  const [generatedTroops, setGeneratedTroops] = useState<TTroop[]>([]);

  function generateTroops() {
    const newTroops: TTroop[] = [];
    let newHousingSpace = 0;

    while (newHousingSpace < housingSpace) {
      const randomIndex = Math.floor(Math.random() * troops.length);
      const troop = troops[randomIndex];

      if (newHousingSpace + troop.housingSpace > housingSpace) {
        continue;
      }

      if (troop.townHallLevel <= townHallLevel) {
        newHousingSpace += troop.housingSpace;
        newTroops.push(troop);
      }
    }

    setGeneratedTroops((prev) => (prev = newTroops));
  }

  return (
    <>
      <div className="bg-white rounded-md shadow-md w-[400px] max-w-[85%] mx-auto mt-20 p-4 flex gap-3 flex-wrap">
        <div className="flex flex-col gap-2">
          <label className="text-base lg:text-lg">Housing space</label>

          <input
            className="text-sm lg:text-base font-bold bg-gray-100 rounded-md px-3 py-2 outline-none"
            value={housingSpace}
            onChange={(e) =>
              setHousingSpace((prev) => (prev = parseInt(e.target.value)))
            }
            type="number"
            step={5}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-base lg:text-lg">Town hall level</label>

          <input
            className="text-sm lg:text-base font-bold bg-gray-100 rounded-md px-3 py-2 outline-none"
            value={townHallLevel}
            onChange={(e) =>
              setTownHallLevel((prev) => (prev = parseInt(e.target.value)))
            }
            type="number"
            min={1}
            max={17}
          />
        </div>
      </div>

      <div className="w-fit mx-auto">
        <button
          onClick={() => generateTroops()}
          className="font-bold text-base lg:text-lg bg-emerald-400 rounded-md px-3 py-2 mt-5 cursor-pointer"
        >
          Generate
        </button>
      </div>

      {generatedTroops.length > 0 && (
        <div className="my-10 mx-auto w-[700px] max-w-[85%]">
          <h2 className="text-lg lg:text-xl font-bold">Generated Troops</h2>

          <div className="mt-5 flex gap-5 flex-wrap">
            {troops.map((troop, index) => {
              if (!generatedTroops.includes(troop)) return null;

              const count = generatedTroops.filter(
                (troop_) => troop_.name === troop.name
              ).length;

              return (
                <div
                  key={index}
                  className="bg-white rounded-md shadow-md p-4 flex flex-col items-center"
                >
                  <Image
                    src={troop.image}
                    alt={troop.name}
                    width={55}
                    height={55}
                  />

                  <h3 className="text-base lg:text-lg font-semibold">
                    {troop.name}
                  </h3>

                  <p className="text-xl lg:text-2xl font-bold">x{count}</p>

                  <p className="text-xs lg:text-sm text-gray-600">
                    Housing space: {troop.housingSpace}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {generatedTroops.length === 0 && (
        <h2 className="text-lg lg:text-xl font-bold text-center mt-10">
          No troops generated yet
        </h2>
      )}
    </>
  );
}
