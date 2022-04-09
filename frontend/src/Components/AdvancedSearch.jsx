import { Button, Grid, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ClearIcon from '@mui/icons-material/Clear';
import { useState, useEffect } from "react";
import { YEARS, REGIONS, KEYWORDS } from "../Utils/AdvancedSearchItems";
import { StyledToggleButton, StyledToggleButtonGroup } from "../Style/StyledToggleButton";



export default function AdvancedSearch({onSelectAdvancedSearchFilter, parentOnHide, parentOnApply, parentOnCancel}) {

	const [allYearsFrom, setAllYearsFrom] = useState([]);
	const [allYearsTo, setAllYearsTo] = useState([]);
	const [allRegions, setAllRegions] = useState([]);
	const [allKeywords, setAllKeywords] = useState([]);
	const [selectedFilters, setSelectedFilters] = useState({'from': '', 'to': '', 'regions': [], 'keywords': []});
	const [appliedYearFrom, setAppliedYearFrom] = useState(false);
	const [appliedYearTo, setAppliedYearTo] = useState(false);


	useEffect(() => {
		// api call get regions and keywords
		setAllYearsFrom(YEARS);
		setAllYearsTo(YEARS);
		setAllRegions(REGIONS);
		setAllKeywords(KEYWORDS);
		
		// define first and last year
		let copySelectedFilters = selectedFilters;
		copySelectedFilters['from'] = YEARS[0];
		copySelectedFilters['to'] = YEARS[YEARS.length - 1];
		setSelectedFilters(copySelectedFilters);
	}, []);


	useEffect(() => {
		let numOfSelFilters = 0

		// is filter for year range applied?
		if (selectedFilters['from'] !== allYearsFrom[0]) {
			numOfSelFilters += 1;
			setAppliedYearFrom(true);
		} else {
			setAppliedYearFrom(false);
		}

		if (selectedFilters['to'] !== allYearsFrom[allYearsFrom.length - 1]) {
			numOfSelFilters += 1;
			setAppliedYearTo(true);
		} else {
			setAppliedYearTo(false);
		}

		numOfSelFilters += selectedFilters['regions'].length + selectedFilters['keywords'].length;
		
		// always sent to parent after change of selected filters
		onSelectAdvancedSearchFilter(numOfSelFilters, selectedFilters, appliedYearFrom, appliedYearTo);

	}, [selectedFilters, onSelectAdvancedSearchFilter, allYearsFrom, allYearsTo]);


  	const handleChangeYearFrom = (e) => {
		setAllYearsTo(allYearsFrom.slice(allYearsFrom.indexOf(e.target.value)));
		setSelectedFilters({ ...selectedFilters, 'from': e.target.value })
  	};


	const handleChangeYearTo = (e) => {
		setSelectedFilters({ ...selectedFilters, 'to': e.target.value })
  	};


	const handleRegionClick = (e, allSelectedRegions) => {
		setSelectedFilters({ ...selectedFilters, 'regions': allSelectedRegions })
	}


	const handleKeywordClick = (e, allSelectedKeywords) => {
		setSelectedFilters({ ...selectedFilters, 'keywords': allSelectedKeywords })
	}


	const onHide = () => {
		parentOnHide();
	}

	
	const onCancel = () => {
		setSelectedFilters({'from': 2016, 'to': 2022, 'regions': [], 'keywords': []});
		parentOnCancel();
	}


	const onClear = () => {
		setSelectedFilters({'from': 2016, 'to': 2022, 'regions': [], 'keywords': []});
	}


	const onApply = () => {
		parentOnApply();
	}

 
	return (
		<Grid container
			spacing={2}
			sx={{ pt: 2 }}
		>
			<Grid item>
				{appliedYearFrom || appliedYearTo ? <Typography color="primary">Year of publication</Typography> : <Typography color="secondary">Year of publication</Typography>}
			</Grid>
			
			
			<Grid item container 
				spacing={1} 
				direction="row"
			>
				<Grid item container xs={5} justifyContent={"center"}>
					<FormControl 
						variant="standard"
					>
						<InputLabel>From</InputLabel>
						<Select
							label="From"
							value={selectedFilters['from']}
							onChange={handleChangeYearFrom}
						>
							{allYearsFrom.map(year => (<MenuItem key={year} value={year}>{year}</MenuItem>))}
						</Select>
					</FormControl>
	
				</Grid>

				<Grid item container xs justifyContent={"center"}>
					<Typography variant="h2" component="p" color="secondary" sx={{ pt: 2}}>-</Typography>
				</Grid>

				<Grid item container xs={5} justifyContent={"center"}>
					<FormControl 
						variant="standard"
					>
						<InputLabel>To</InputLabel>
						<Select
							label="To"
							value={selectedFilters['to']}
							onChange={handleChangeYearTo}
						>
							{allYearsTo.map(year => (<MenuItem key={year} value={year}>{year}</MenuItem>))}
						</Select>
					</FormControl>
				</Grid>
			</Grid>

			<Grid item>
				{selectedFilters['regions'].length ? <Typography color="primary">Region</Typography> : <Typography color="secondary">Region</Typography>}
			</Grid>

			<StyledToggleButtonGroup
				value={selectedFilters['regions']}
				onChange={handleRegionClick}
			>
				{allRegions.map((region) => (
					<StyledToggleButton 
						key={region}
						sx={{ whiteSpace: 'nowrap' }} 
						size="small" 
						value={region}
					>
						{region}
					</StyledToggleButton>
				))}
			</StyledToggleButtonGroup>
			
			<Grid item>
				{selectedFilters['keywords'].length ? <Typography color="primary">Included keywords</Typography> : <Typography color="secondary">Included keywords</Typography>}
			</Grid>
			
			<StyledToggleButtonGroup
				value={selectedFilters['keywords']}
				onChange={handleKeywordClick}
			>
				{allKeywords.map((keyword) => (
					<StyledToggleButton 
						key={keyword}
						sx={{ whiteSpace: 'nowrap' }} 
						size="small" 
						value={keyword}
					>
						{keyword}
					</StyledToggleButton>	
				))}
			</StyledToggleButtonGroup>

			<Grid item container
				justifyContent="flex-end"
				spacing={1}
			>
				<Grid item><Button color="secondary" variant="text" size="small" style={{textDecoration: "underline"}} onClick={onHide}><KeyboardArrowUpIcon />Hide</Button></Grid>
				<Grid item><Button color="secondary" variant="text" size="small" style={{textDecoration: "underline"}} onClick={onClear}><ClearIcon />Clear</Button></Grid>
				<Grid item><Button size="small" variant="contained" onClick={onApply}>Apply & Search</Button></Grid>
				<Grid item><Button color="secondary" variant="contained" size="small" onClick={onCancel}>Cancel</Button></Grid>
			</Grid>
		</Grid>

	);
	
}