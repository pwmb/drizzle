"use client";

import { API_KEY } from "@/utils/constants";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface SearchResults {
  name: string;
  lat: number;
  lon: number;
  country: string;
}

function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

function SearchResult({ result }: { result: SearchResults }) {
  return (
    <Link href={"/location/" + result.lat + "/" + result.lon}>
      <div className="flex justify-between w-full border-b px-6 py-5 lg:rounded-xl lg:border hover:bg-gray-50 hover:cursor-pointer">
        <div className="flex">
          <p>{result.name}</p>
        </div>
        <p className="capitalize">{getFlagEmoji(result.country)}</p>
      </div>
    </Link>
  );
}

function SearchResults({ results }: { results: SearchResults[] }) {
  return (
    <div className="w-full">
      <div className="self-start pl-2">
        <p className="font-extralight">Search Results</p>
      </div>
      <div className="flex space-y-5 flex-col pt-5">
        {results.map((r, i) => (
          <SearchResult result={r} key={i}></SearchResult>
        ))}
      </div>
    </div>
  );
}

export default function Search() {
  const [search, setSearch] = useState<string>();
  const [error, setError] = useState<string>();
  const [results, setResults] = useState<SearchResults[]>();

  async function FindLocation(e: KeyboardEvent) {
    if (e.key === "Enter") {
      const url = `http://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=10&appid=${API_KEY}`;
      const resp = await fetch(url, {
        next: {
          revalidate: 3,
        },
      });
      const data = await resp.json();

      if (data.cod === 401) {
        setError("Invalid API Key");
        setResults(undefined);
      } else {
        setResults(data);
      }
    }
    if (search === "") {
      setResults(undefined);
    }
  }

  return (
    <div className="flex flex-col max-w-5xl w-full items-center justify-between space-y-5 lg:flex">
      <div className="w-full">
        <div className="pt-2 relative mx-auto text-gray-600">
          <input
            className="border-2 border-gray-300 w-full h-12 px-5 pr-16 rounded-lg text-sm focus:outline-none"
            type="text"
            placeholder="Search"
            onKeyUp={(e) => FindLocation(e as any)}
            defaultValue={search}
            onChange={({ target }) => setSearch(target.value)}
          />
          <button type="submit" className="absolute right-0 top-0 mt-6 mr-4">
            <Image
              src="/search.svg"
              alt="search"
              className="text-gray-600 h-4 w-4 fill-current"
              width={100}
              height={24}
              priority
            />
          </button>
        </div>
      </div>
      {results && <SearchResults results={results}></SearchResults>}
      {error && (
        <pre>Invalid API Key, make sure you have the correct API Key set</pre>
      )}
    </div>
  );
}
