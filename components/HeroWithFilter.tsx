// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { fetchSanityQuery } from "@/lib/fetchSanity";
// import { getAllCarsQuery } from "@/lib/queries";

// type Car = {
//   make: string;
//   model: string;
//   year: number;
// };

// export function HeroWithFilter() {
//   const router = useRouter();

//   const [cars, setCars] = useState<Car[]>([]);
//   const [availableMakes, setAvailableMakes] = useState<string[]>([]);
//   const [availableModels, setAvailableModels] = useState<string[]>([]);
//   const [availableYears, setAvailableYears] = useState<number[]>([]);

//   const [selectedMake, setSelectedMake] = useState("all");
//   const [selectedModel, setSelectedModel] = useState("all");
//   const [selectedYear, setSelectedYear] = useState("all");

//   const [matchingCount, setMatchingCount] = useState(0);

//   const isAll = (value: string) => value === "all";

//   useEffect(() => {
//     async function loadFilterData() {
//       const data: Car[] = await fetchSanityQuery(getAllCarsQuery);

//       setCars(data);

//       const makes = [...new Set(data.map((car) => car.make))].filter(Boolean);
//       const models = [...new Set(data.map((car) => car.model))].filter(Boolean);
//       const years = [...new Set(data.map((car) => car.year))]
//         .filter(Boolean)
//         .sort((a, b) => b - a);

//       setAvailableMakes(makes);
//       setAvailableModels(models);
//       setAvailableYears(years);
//     }

//     loadFilterData();
//   }, []);

//   // Update models when make changes
//   useEffect(() => {
//     if (!isAll(selectedMake)) {
//       const filteredModels = [
//         ...new Set(
//           cars
//             .filter((car) => car.make === selectedMake)
//             .map((car) => car.model)
//         ),
//       ];
//       setAvailableModels(filteredModels);
//     } else {
//       const allModels = [...new Set(cars.map((car) => car.model))];
//       setAvailableModels(allModels);
//     }

//     setSelectedModel("all"); // reset model when make changes
//   }, [selectedMake, cars]);

//   // Count matching cars
//   useEffect(() => {
//     const count = cars.filter((car) => {
//       return (
//         (isAll(selectedMake) || car.make === selectedMake) &&
//         (isAll(selectedModel) || car.model === selectedModel) &&
//         (isAll(selectedYear) || car.year === Number(selectedYear))
//       );
//     }).length;

//     setMatchingCount(count);
//   }, [selectedMake, selectedModel, selectedYear, cars]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     const params = new URLSearchParams();

//     if (!isAll(selectedMake)) params.append("make", selectedMake);
//     if (!isAll(selectedModel)) params.append("model", selectedModel);
//     if (!isAll(selectedYear)) params.append("year", selectedYear);

//     router.push(`/inventory?${params.toString()}`);
//   };

//   return (
//     <section className="bg-gray-100 py-16 px-4 md:px-8">
//       <div className="max-w-6xl mx-auto text-center">
//         <h1 className="text-4xl font-bold mb-4">Find the Perfect Match</h1>
//         <p className="text-gray-600 mb-10">
//           Use the filters below to narrow down your search and discover a
//           vehicle that fits your lifestyle.
//         </p>

//         <form
//           onSubmit={handleSubmit}
//           className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-white p-6 rounded-xl shadow-md max-w-5xl mx-auto"
//         >
//           {/* Make */}
//           <div>
//             <label className="block text-left text-sm font-medium mb-1 text-gray-700">
//               Make
//             </label>
//             <Select value={selectedMake} onValueChange={setSelectedMake}>
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="Select Make" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Makes</SelectItem>
//                 {availableMakes.map((make) => (
//                   <SelectItem key={make} value={make}>
//                     {make}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Model */}
//           <div>
//             <label className="block text-left text-sm font-medium mb-1 text-gray-700">
//               Model
//             </label>
//             <Select
//               value={selectedModel}
//               onValueChange={setSelectedModel}
//               disabled={!availableModels.length}
//             >
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="Select Model" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Models</SelectItem>
//                 {availableModels.map((model) => (
//                   <SelectItem key={model} value={model}>
//                     {model}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Year */}
//           <div>
//             <label className="block text-left text-sm font-medium mb-1 text-gray-700">
//               Year
//             </label>
//             <Select
//               value={selectedYear}
//               onValueChange={setSelectedYear}
//               disabled={!availableYears.length}
//             >
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="Select Year" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Years</SelectItem>
//                 {availableYears.map((year) => (
//                   <SelectItem key={year} value={String(year)}>
//                     {year}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Submit */}
//           <div>
//             <Button type="submit" className="w-full">
//               Search ({matchingCount})
//             </Button>
//           </div>
//         </form>
//       </div>
//     </section>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { fetchSanityQuery } from "@/lib/fetchSanity";
import { getAllCarsQuery } from "@/lib/queries";

type Car = {
  make: string;
  model: string;
  year: number;
};

export function HeroWithFilter() {
  const router = useRouter();

  const [cars, setCars] = useState<Car[]>([]);
  const [availableMakes, setAvailableMakes] = useState<string[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  const [selectedMake, setSelectedMake] = useState("all");
  const [selectedModel, setSelectedModel] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");

  const [matchingCount, setMatchingCount] = useState(0);

  const isAll = (value: string) => value === "all";

  useEffect(() => {
    async function loadFilterData() {
      const data: Car[] = await fetchSanityQuery(getAllCarsQuery);
      setCars(data);

      const makes = [...new Set(data.map((car) => car.make))].filter(Boolean);
      setAvailableMakes(makes);
    }

    loadFilterData();
  }, []);

  // Update model options when make changes
  useEffect(() => {
    if (!isAll(selectedMake)) {
      const filteredModels = [
        ...new Set(
          cars
            .filter((car) => car.make === selectedMake)
            .map((car) => car.model)
        ),
      ];
      setAvailableModels(filteredModels);
    } else {
      setAvailableModels([]);
    }

    setSelectedModel("all");
    setSelectedYear("all");
    setAvailableYears([]);
  }, [selectedMake, cars]);

  // Update year options when model changes
  useEffect(() => {
    if (!isAll(selectedMake) && !isAll(selectedModel)) {
      const filteredYears = [
        ...new Set(
          cars
            .filter(
              (car) => car.make === selectedMake && car.model === selectedModel
            )
            .map((car) => car.year)
        ),
      ].sort((a, b) => b - a);

      setAvailableYears(filteredYears);
    } else {
      setAvailableYears([]);
    }

    setSelectedYear("all");
  }, [selectedModel, selectedMake, cars]);

  // Count matching cars
  useEffect(() => {
    const count = cars.filter((car) => {
      return (
        (isAll(selectedMake) || car.make === selectedMake) &&
        (isAll(selectedModel) || car.model === selectedModel) &&
        (isAll(selectedYear) || car.year === Number(selectedYear))
      );
    }).length;

    setMatchingCount(count);
  }, [selectedMake, selectedModel, selectedYear, cars]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (!isAll(selectedMake)) params.append("make", selectedMake);
    if (!isAll(selectedModel)) params.append("model", selectedModel);
    if (!isAll(selectedYear)) params.append("year", selectedYear);

    router.push(`/inventory?${params.toString()}`);
  };

  return (
    <section className="bg-gray-50 py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Find the Perfect Match</h1>
        <p className="text-gray-600 mb-10">
          Use the filters below to narrow down your search and discover a
          vehicle that fits your lifestyle.
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-white p-6 rounded-xl shadow-md max-w-5xl mx-auto"
        >
          {/* Make */}
          <div>
            <label className="block text-left text-sm font-medium mb-1 text-gray-700">
              Make
            </label>
            <Select value={selectedMake} onValueChange={setSelectedMake}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Make" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Makes</SelectItem>
                {availableMakes.map((make) => (
                  <SelectItem key={make} value={make}>
                    {make}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Model */}
          <div>
            <label className="block text-left text-sm font-medium mb-1 text-gray-700">
              Model
            </label>
            <Select
              value={selectedModel}
              onValueChange={setSelectedModel}
              disabled={isAll(selectedMake) || availableModels.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Models</SelectItem>
                {availableModels.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year */}
          <div>
            <label className="block text-left text-sm font-medium mb-1 text-gray-700">
              Year
            </label>
            <Select
              value={selectedYear}
              onValueChange={setSelectedYear}
              disabled={isAll(selectedModel) || availableYears.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Submit */}
          <div>
            <Button type="submit" className="w-full">
              Search ({matchingCount})
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
