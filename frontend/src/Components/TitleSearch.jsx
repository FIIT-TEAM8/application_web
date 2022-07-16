import {
    Collapse,
    IconButton,
    TextField,
    Typography,
    InputAdornment,
    Stack,
    Button,
    Box,
    ButtonBase,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useEffect, useState, useCallback } from 'react';
import { Outlet, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useWindowSize } from '../Utils/Screen';
import { apiCall } from '../Utils/APIConnector';
import AdvancedSearch from '../Components/AdvancedSearch';
import { emptyFilters, getYears } from '../Utils/AdvancedSearchUtils';

export default function TitleSearch() {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const shouldCollapse = width < 992;

    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [showingResults, setShowingResults] = useState(false);

    // states for advanced search
    const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
	const [allYears, setAllYears] = useState([]);
	const [allRegions, setAllRegions] = useState([]);
	const [allKeywords, setAllKeywords] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState(emptyFilters);
    const [numSelectedFilters, setNumSelectedFilters] = useState(0);

    let searchDivStyle = {
        margin: 'auto',
        padding: shouldCollapse ? '200px 7%' : '200px 20%',
    };

    if (showingResults) {
        searchDivStyle.padding = shouldCollapse ? '20px 7%' : '20px 20%';
    }

    useEffect(() => {
        apiCall('/api/advanced_search/keyword_categories', 'GET').then((result) => {
            if (result.ok) {
                setAllKeywords(Object.keys(result.data));
            }
        });

        apiCall('/api/advanced_search/region_mapping', 'GET').then((result) => {
            if (result.ok) {
                setAllRegions(result.data);
            }
        });

        setAllYears(getYears(2016, new Date().getFullYear()));

        const q = searchParams.get('q');

        if (q) {
            setShowingResults(true);
            setSearchTerm(q);
        }

	}, []);

    // check if we should change actual state to main page state
    // handling when click on logo
    useEffect(() => {
        const q = searchParams.get('q');
        if (!q) {
            setShowingResults(false);
            setSearchTerm('');
        }
    }, [searchParams]);
    
    useEffect(() => {
        let from = searchParams.get('from');
		let to = searchParams.get('to');
		const regionCodes = searchParams.get('regions');
		const keywords = searchParams.get('keywords');

        let prevSelectedFilters = {...selectedFilters};

        let defaultYearFrom = allYears[0];
        let defaultYearTo = allYears[allYears.length - 1];

        // e.g. from="2019-01-01", to="2022-12-31"
        prevSelectedFilters['from']['defaultValue'] = defaultYearFrom;
		prevSelectedFilters['from']['value'] = from ? from.slice(0, 4) : defaultYearFrom;

        prevSelectedFilters['to']['defaultValue'] = defaultYearTo;
		prevSelectedFilters['to']['value'] = to ? to.slice(0, 4) : defaultYearTo;

		// e.g. regionCodes="[sk,us,gb]"
		if (regionCodes) {
			let regionCodesArr = regionCodes.slice(1, -1).split(',');
            let selectedRegions = [];

            // e.g. selectedRegions=['Slovakia', 'United States', 'Great Britan']
            regionCodesArr.map((regionCode) => {
                let regionName = Object.keys(allRegions).find(key => allRegions[key] === regionCode);
                selectedRegions.push(regionName);
            });

            prevSelectedFilters['regions'] = selectedRegions;

		}
		if (keywords) {
			let keywordsArr = keywords.slice(1, -1).split(',');
			prevSelectedFilters['keywords'] = keywordsArr;
		}

		setSelectedFilters(prevSelectedFilters);
    }, [allYears, allRegions, allKeywords]);

    // calculate number of selected filters
    useEffect(() => {
        let yearFrom = selectedFilters['from']['defaultValue'] !== selectedFilters['from']['value'] ? 1 : 0;
        let yearTo = selectedFilters['to']['defaultValue'] !== selectedFilters['to']['value'] ? 1 : 0;
        let regions = selectedFilters['regions'].length;
        let keywords = selectedFilters['keywords'].length;

        setNumSelectedFilters(yearFrom + yearTo + regions + keywords);
    }, [selectedFilters]);

    const handleSearchChange = (value) => {
        setSearchTerm(value);
    };

    const onYearFromSelect = (yearFrom) => {
        let yearTo = selectedFilters['to']['value'];
        // disable wrong year range
        if (yearFrom > selectedFilters['to']['value']) {
            yearTo = yearFrom;
        }
        setSelectedFilters({...selectedFilters, 'from': {...selectedFilters['from'], 'value': yearFrom}, 'to': {...selectedFilters['to'], 'value': yearTo}});
    };

    const onYearToSelect = (yearTo) => {
        setSelectedFilters({...selectedFilters, 'to': {...selectedFilters['to'], 'value': yearTo}});
    };

    const onRegionSelect = (selectedRegions) => {
        setSelectedFilters({...selectedFilters, 'regions': selectedRegions});
    };

    const onKeywordSelect = (selectedKeywords) => {
        setSelectedFilters({...selectedFilters, 'keywords': selectedKeywords});
    };

    const onAdvancedSearchHide = () => {
        setAdvancedSearchOpen(false);
        window.scroll({top: 0, left: 0, behavior: 'smooth' });
    };

    const onAdvancedSearchClear = () => {
        let defaultYearFrom = allYears[0];
        let defaultYearTo = allYears[allYears.length - 1];

        setSelectedFilters({
            ...emptyFilters, 
            'from': {
                'value':defaultYearFrom, 
                'defaultValue': defaultYearFrom,
            }, 
            'to': {
                'value': defaultYearTo,
                'defaultValue': defaultYearTo,
            },
        });
    };

    const onAdvancedSearchApply = () => {
        onAdvancedSearchHide();
        submitSearchParams();
    };

    const onAdvancedSearchCancel = () => {
        for (const filterName in selectedFilters) {
            searchParams.delete(filterName);
        }
        setSearchParams(searchParams);

        onAdvancedSearchClear();
        onAdvancedSearchHide();
    };

    const submitSearchParams = () => {
        searchParams.delete('q');
        searchParams.delete('page');
        for (const filterName in selectedFilters) {
            searchParams.delete(filterName);
        }

        searchParams.append('q', searchTerm);
		searchParams.append('page', 1);

        const selectedFrom = selectedFilters['from']['value'] !== selectedFilters['from']['defaultValue'] ? selectedFilters['from']['value'] : null;
        const selectedTo = selectedFilters['to']['value'] !== selectedFilters['to']['defaultValue'] ? selectedFilters['to']['value'] : null;
        
        let selectedRegions = [];
        selectedFilters['regions'].map(region => {
            selectedRegions.push(allRegions[region]);
        });
        selectedRegions = selectedRegions.length ? selectedRegions : null;

        const selectedKeywords = selectedFilters['keywords'].length ? selectedFilters['keywords'] : null;

        if (selectedFrom) {
            searchParams.append('from', selectedFrom + '-01-01');
        }
        if (selectedTo) {
            searchParams.append('to', selectedTo + '-12-31');
        }
        if (selectedRegions) {
            searchParams.append('regions', '[' + selectedRegions.join(',') + ']');
        }
        if (selectedKeywords) {
            searchParams.append('keywords', '[' + selectedKeywords.join(',') + ']');
        }

        setShowingResults(true);
        setSearchParams(searchParams);
        navigate(`results?${searchParams.toString()}`);
    };
    

    const onSubmit = (event) => {
        event.preventDefault();

        onAdvancedSearchHide();
        submitSearchParams();
    };

    return (
        <div style={searchDivStyle}>
            <form onSubmit={onSubmit}>
                <Link
                    to="/search"
                    onClick={onAdvancedSearchHide}
                    style={{ textDecoration: 'none' }}>
                    <Typography variant="h1" color="primary">
                        ams
                    </Typography>
                </Link>
                <TextField
                    id="outlined-search"
                    color={'secondary'}
                    value={searchTerm}
                    label={'Search'}
                    autoComplete="off"
                    variant="outlined"
                    onChange={(event) => handleSearchChange(event.target.value)}
                    fullWidth
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                {
                                    <IconButton color="primary" type="submit">
                                        <Search />
                                    </IconButton>
                                }
                            </InputAdornment>
                        ),
                    }}
                />
            </form>
            
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
                    onHide={onAdvancedSearchHide}
                    onClear={onAdvancedSearchClear}
                    onApply={onAdvancedSearchApply}
                    onCancel={onAdvancedSearchCancel}
                />
            </Collapse>
            
            {(!advancedSearchOpen) && 
                <Stack 
                    alignItems={'center'}
                    justifyContent={'flex-end'}
                    direction={'row'}
                    spacing={1}
                    >
                    {numSelectedFilters ? 
                        <ButtonBase onClick={() => setAdvancedSearchOpen(true)}>
                            <Stack
                                direction={'row'}
                                spacing={0.3}
                            >
                                <Box sx={{ textAlign: 'center', borderRadius: '50%', width: '0.9rem', height: '0.9rem', backgroundColor: 'primary.main' }}>
                                    <Typography fontSize={11}  color="white">{numSelectedFilters}</Typography>
                                </Box>
                                {numSelectedFilters === 1 ? 
                                    <Typography color="primary" fontSize={11}>applied filter</Typography>
                                    : 
                                    <Typography color="primary" fontSize={11}>applied filters</Typography>
                                }
                            </Stack> 
                        </ButtonBase>
                        : 
                        <></>
                    }
                    <Button 
                        color="secondary" 
                        variant="text" 
                        size="small" 
                        style={{textDecoration: 'underline'}}
                        onClick={() => setAdvancedSearchOpen(true)}
                        >
                        Advanced search
                    </Button>
                </Stack>
            }

            <Outlet />
        </div>
    );
}
