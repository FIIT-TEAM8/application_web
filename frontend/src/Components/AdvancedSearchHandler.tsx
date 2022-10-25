import React, { useEffect, useState } from "react";
import {
  useSearchParams
} from "react-router-dom";
import {
  Collapse,
} from "@mui/material";
import { apiCall } from "../Utils/APIConnector";
import { getYears } from "../Utils/AdvancedSearchUtils";
import { AdvSearchItems, APIResponse, Regions } from "../Utils/Interfaces";
import AdvancedSearch from "./AdvancedSearch";

const emptyFilters: AdvSearchItems = {
  from: {
    value: "",
    defaultValue: "",
  },
  to: {
    value: "",
    defaultValue: "",
  },
  regions: [],
  keywords: [],
};

type Props = {
  open: boolean,
  // eslint-disable-next-line no-unused-vars
  onFilterSelect: (numSelectedFilters: number) => void,
  apply: () => void,
};

export default function AdvancedSearchHandler({ open, onFilterSelect, apply }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
  const [allYears, setAllYears] = useState<string[]>([]);
  const [allRegions, setAllRegions] = useState<Regions>({});
  const [allKeywords, setAllKeywords] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState(emptyFilters);
  const [numSelectedFilters, setNumSelectedFilters] = useState(0);

  useEffect(() => {
    apiCall("/api/advanced_search/keyword_categories", "GET").then((result: APIResponse) => {
      if (result.ok && result.data) {
        setAllKeywords(Object.keys(result.data));
      }
    });

    apiCall("/api/advanced_search/region_mapping", "GET").then((result: APIResponse) => {
      if (result.ok && result.data && !("results" in result.data)) {
        setAllRegions(result.data);
      }
    });

    setAllYears(getYears(2016, new Date().getFullYear()));
  }, []);

  useEffect(() => {
    setAdvancedSearchOpen(open);
  }, [open]);

  useEffect(() => {
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const regionCodes: string | null = searchParams.get("regions");
    const keywords = searchParams.get("keywords");

    const prevSelectedFilters = { ...selectedFilters };

    const defaultYearFrom = allYears[0];
    const defaultYearTo = allYears[allYears.length - 1];

    // e.g. from="2019-01-01", to="2022-12-31"
    prevSelectedFilters.from.defaultValue = defaultYearFrom;
    prevSelectedFilters.from.value = from ? from.slice(0, 4) : defaultYearFrom;

    prevSelectedFilters.to.defaultValue = defaultYearTo;
    prevSelectedFilters.to.value = to ? to.slice(0, 4) : defaultYearTo;

    // e.g. regionCodes="[sk,us,gb]"
    if (regionCodes) {
      const regionCodesArr: Array<string> = regionCodes.slice(1, -1).split(",");

      // e.g. selectedRegions=['Slovakia', 'United States', 'Great Britan']
      const selectedRegions: Array<string> = regionCodesArr.map((regionCode) => {
        const regionName = Object.keys(allRegions).find(
          (key) => allRegions[key] === regionCode
        );
        return regionName ?? "";
      });

      prevSelectedFilters.regions = selectedRegions;
    }
    if (keywords) {
      const keywordsArr = keywords.slice(1, -1).split(",");
      prevSelectedFilters.keywords = keywordsArr;
    }

    setSelectedFilters(prevSelectedFilters);
  }, [allYears, allRegions, allKeywords]);

  // calculate number of selected filters
  useEffect(() => {
    const yearFrom = selectedFilters.from.defaultValue !== selectedFilters.from.value ? 1 : 0;
    const yearTo = selectedFilters.to.defaultValue !== selectedFilters.to.value ? 1 : 0;
    const regions = selectedFilters.regions.length;
    const keywords = selectedFilters.keywords.length;

    setNumSelectedFilters(yearFrom + yearTo + regions + keywords);
  }, [selectedFilters]);

  useEffect(() => {
    onFilterSelect(numSelectedFilters);
  }, [numSelectedFilters]);

  const onYearFromSelect = (yearFrom: string) => {
    let yearTo = selectedFilters.to.value;
    // disable wrong year range
    if (yearFrom > selectedFilters.to.value) {
      yearTo = yearFrom;
    }
    setSelectedFilters({
      ...selectedFilters,
      from: { ...selectedFilters.from, value: yearFrom },
      to: { ...selectedFilters.to, value: yearTo },
    });
  };

  const onYearToSelect = (yearTo: string) => {
    setSelectedFilters({
      ...selectedFilters,
      to: { ...selectedFilters.to, value: yearTo },
    });
  };

  const onRegionSelect = (selectedRegions: string[]) => {
    setSelectedFilters({ ...selectedFilters, regions: selectedRegions });
  };

  const onKeywordSelect = (selectedKeywords: string[]) => {
    setSelectedFilters({ ...selectedFilters, keywords: selectedKeywords });
  };

  const onHide = () => {
    setAdvancedSearchOpen(false);
    window.scroll({ top: 0, left: 0, behavior: "smooth" });
  };

  const onClear = () => {
    const defaultYearFrom = allYears[0];
    const defaultYearTo = allYears[allYears.length - 1];

    setSelectedFilters({
      ...emptyFilters,
      from: {
        value: defaultYearFrom,
        defaultValue: defaultYearFrom,
      },
      to: {
        value: defaultYearTo,
        defaultValue: defaultYearTo,
      },
    });
  };

  const onApply = () => {
    onHide();

    const filters = Object.keys(selectedFilters);

    filters.forEach((filterName) => {
      searchParams.delete(filterName);
    });

    const selectedRegions = selectedFilters.regions.map(
      (region) => allRegions[region]
    );

    if (selectedFilters.from.value !== selectedFilters.from.defaultValue) {
      searchParams.append("from", `${selectedFilters.from.value}-01-01`);
    }
    if (selectedFilters.to.value !== selectedFilters.to.defaultValue) {
      searchParams.append("to", `${selectedFilters.to.value}-12-31`);
    }
    if (selectedRegions.length) {
      searchParams.append("regions", `[${selectedRegions.join(",")}]`);
    }
    if (selectedFilters.keywords.length) {
      searchParams.append("keywords", `[${selectedFilters.keywords.join(",")}]`);
    }

    setSearchParams(searchParams);
    apply();
  };

  const onCancel = () => {
    const filters = Object.keys(selectedFilters);

    filters.forEach((filterName) => {
      searchParams.delete(filterName);
    });

    setSearchParams(searchParams);

    onClear();
    onApply();
  };

  return (
    <Collapse timeout={1200} in={advancedSearchOpen}>
      <AdvancedSearch
        allYearsFromAPI={allYears}
        allRegionsFromAPI={allRegions}
        allKeywordsFromAPI={allKeywords}
        selectedAdvancedFilters={selectedFilters}
        onYearFromSelect={onYearFromSelect}
        onYearToSelect={onYearToSelect}
        onRegionSelect={onRegionSelect}
        onKeywordSelect={onKeywordSelect}
        onHide={onHide}
        onClear={onClear}
        onApply={onApply}
        onCancel={onCancel}
      />
    </Collapse>
  );
}
