"use client";

import { troops, TTroop, TSpell, spells } from "@/lib/data";
import Image from "next/image";
import { useState } from "react";

export default function HomePage() {
  const [housingSpace, setHousingSpace] = useState<number>(5);
  const [housingSpaceSpells, setHousingSpaceSpells] = useState<number>(1);
  const [townHallLevel, setTownHallLevel] = useState<number>(1);
  const [generatedTroops, setGeneratedTroops] = useState<TTroop[]>([]);
  const [generatedSpells, setGeneratedSpells] = useState<TSpell[]>([]);
  const [options, setOptions] = useState<{
    superTroop: boolean;
    type: "all" | "elixir" | "dark elixir";
    movement: "all" | "flying" | "ground";
    usage: "all" | "hero" | "attack" | "both" | "flying" | "ground";
  }>({
    superTroop: false,
    type: "all",
    movement: "all",
    usage: "all",
  });

  function generateTroops() {
    const validTroops = troops.filter((troop) => {
      if (troop.townHallLevel > townHallLevel) return false;
      if (!options.superTroop && troop.superTroop) return false;

      if (options.type !== "all") {
        if (
          (options.type === "elixir" && troop.type === "dark elixir") ||
          (options.type === "dark elixir" && troop.type === "elixir")
        ) {
          return false;
        }
      }

      if (options.movement !== "all") {
        if (
          (options.movement === "flying" && troop.movement !== "flying") ||
          (options.movement === "ground" && troop.movement !== "ground")
        ) {
          return false;
        }
      }

      return true;
    });

    if (validTroops.length === 0) {
      setGeneratedTroops([]);
      return;
    }

    const newTroops: TTroop[] = [];
    let newHousingSpace = 0;

    const shuffledTroops = [...validTroops].sort(() => Math.random() - 0.5);

    while (newHousingSpace < housingSpace) {
      const possibleTroops = shuffledTroops.filter(
        (t) => t.housingSpace + newHousingSpace <= housingSpace
      );
      if (possibleTroops.length === 0) break;

      const chosen =
        possibleTroops[Math.floor(Math.random() * possibleTroops.length)];
      newTroops.push(chosen);
      newHousingSpace += chosen.housingSpace;
    }

    setGeneratedTroops(newTroops);
  }

  function generateSpells() {
    const allValidSpells = spells.filter((spell) => {
      if (spell.townHallLevel > townHallLevel) return false;

      if (options.type !== "all") {
        if (
          (options.type === "elixir" && spell.type === "dark elixir") ||
          (options.type === "dark elixir" && spell.type === "elixir")
        ) {
          return false;
        }
      }

      if (options.usage !== "all") {
        if (
          (options.usage === "hero" && spell.usage !== "hero") ||
          (options.usage === "attack" && spell.usage !== "attack") ||
          (options.usage === "both" && spell.usage !== "both") ||
          (options.usage === "flying" && spell.usage !== "flying") ||
          (options.usage === "ground" && spell.usage !== "ground")
        ) {
          return false;
        }
      }

      return true;
    });

    const newSpells: TSpell[] = [];
    let usedHousingSpace = 0;

    while (usedHousingSpace < housingSpaceSpells) {
      const fittingSpells = allValidSpells.filter(
        (s) => s.housingSpace + usedHousingSpace <= housingSpaceSpells
      );

      if (fittingSpells.length === 0) break;

      const randomIndex = Math.floor(Math.random() * fittingSpells.length);
      const chosen = fittingSpells[randomIndex];

      newSpells.push(chosen);
      usedHousingSpace += chosen.housingSpace;
    }

    setGeneratedSpells(() => newSpells);
  }

  return (
    <>
      <div className="bg-white rounded-md shadow-md w-[400px] max-w-[85%] mx-auto mt-20 p-4 flex gap-3 flex-wrap">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-base lg:text-lg">
            Housing space {`(troops)`}
          </label>

          <input
            className="text-sm lg:text-base font-bold bg-gray-100 rounded-md px-3 py-2 outline-none"
            value={housingSpace}
            onChange={(e) => setHousingSpace(() => parseInt(e.target.value))}
            type="number"
            step={5}
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="text-base lg:text-lg">
            Housing space {`(spells)`}
          </label>

          <input
            className="text-sm lg:text-base font-bold bg-gray-100 rounded-md px-3 py-2 outline-none"
            value={housingSpaceSpells}
            onChange={(e) =>
              setHousingSpaceSpells(() => parseInt(e.target.value))
            }
            type="number"
            step={1}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-base lg:text-lg">Town hall level</label>

          <input
            className="text-sm lg:text-base font-bold bg-gray-100 rounded-md px-3 py-2 outline-none"
            value={townHallLevel}
            onChange={(e) => setTownHallLevel(() => parseInt(e.target.value))}
            type="number"
            min={1}
            max={17}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-base lg:text-lg">Super troops?</label>

          <select
            className="text-sm lg:text-base font-bold bg-gray-100 rounded-md px-3 py-2 outline-none"
            value={options.superTroop ? "Yes" : "No"}
            onChange={(e) =>
              setOptions(
                (prev) =>
                  (prev = { ...prev, superTroop: e.target.value === "Yes" })
              )
            }
          >
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-base lg:text-lg">Type</label>

          <select
            className="text-sm lg:text-base font-bold bg-gray-100 rounded-md px-3 py-2 outline-none"
            value={options.type}
            onChange={(e) =>
              setOptions(
                (prev) => (prev = { ...prev, type: e.target.value as any })
              )
            }
          >
            <option value={"all"}>All</option>
            <option value={"elixir"}>Elixir</option>
            <option value={"dark elixir"}>Dark Elixir</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-base lg:text-lg">Movement</label>

          <select
            className="text-sm lg:text-base font-bold bg-gray-100 rounded-md px-3 py-2 outline-none"
            value={options.movement}
            onChange={(e) =>
              setOptions(
                (prev) => (prev = { ...prev, movement: e.target.value as any })
              )
            }
          >
            <option value={"all"}>All</option>
            <option value={"flying"}>Flying</option>
            <option value={"ground"}>Ground</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-base lg:text-lg">Spell usage</label>

          <select
            className="text-sm lg:text-base font-bold bg-gray-100 rounded-md px-3 py-2 outline-none"
            value={options.usage}
            onChange={(e) =>
              setOptions(
                (prev) => (prev = { ...prev, usage: e.target.value as any })
              )
            }
          >
            <option value={"all"}>All</option>
            <option value={"hero"}>Hero</option>
            <option value={"attack"}>Attack</option>
            <option value={"both"}>Flying & Ground</option>
            <option value={"flying"}>Flying</option>
            <option value={"ground"}>Ground</option>
          </select>
        </div>
      </div>

      <div className="w-fit mx-auto">
        <button
          onClick={() => {
            generateTroops();
            generateSpells();
          }}
          className="font-bold text-base lg:text-lg bg-emerald-400 rounded-md px-3 py-2 mt-5 cursor-pointer"
        >
          Generate
        </button>
      </div>

      {generatedTroops.length > 0 && (
        <div className="mt-10 mx-auto w-[900px] max-w-[85%]">
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

      {generatedSpells.length > 0 && (
        <div className="my-10 mx-auto w-[900px] max-w-[85%]">
          <h2 className="text-lg lg:text-xl font-bold">Generated Spells</h2>

          <div className="mt-5 flex gap-5 flex-wrap">
            {spells.map((spell, index) => {
              if (!generatedSpells.includes(spell)) return null;

              const count = generatedSpells.filter(
                (spell_) => spell_.name === spell.name
              ).length;

              return (
                <div
                  key={index}
                  className="bg-white rounded-md shadow-md p-4 flex flex-col items-center"
                >
                  <Image
                    src={spell.image}
                    alt={spell.name}
                    width={55}
                    height={55}
                  />

                  <h3 className="text-base lg:text-lg font-semibold">
                    {spell.name}
                  </h3>

                  <p className="text-xl lg:text-2xl font-bold">x{count}</p>

                  <p className="text-xs lg:text-sm text-gray-600">
                    Housing space: {spell.housingSpace}
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
