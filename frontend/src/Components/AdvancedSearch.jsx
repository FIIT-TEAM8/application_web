import { Button, Stack, Grid, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { YEARS, REGIONS, KEYWORDS } from "../Utils/AdvancedSearchItems";
import CustomToggleButton from "../Components/CustomToggleButton";


export default function AdvancedSearch({show, onHide}) {

	const [allRegions, setAllRegions] = useState(REGIONS);
	const [allKeywords, setAllKeywords] = useState(KEYWORDS);
	const [allYearsFrom, setAllYearsFrom] = useState(YEARS); 
	const [allYearsTo, setAllYearsTo] = useState(YEARS);
	const [selectedRegions, setSelectedRegions] = useState([]);
	const [selectedKeywords, setSelectedKeywords] = useState([]);
	const [selectedYearFrom, setSelectedYearFrom] = useState(YEARS[0]);
	const [selectedYearTo, setSelectedYearTo] = useState(YEARS[YEARS.length - 1]);
	

  	const handleChangeYearFrom = (e) => {
		setAllYearsTo(YEARS.slice(YEARS.indexOf(e.target.value))); // changing based on selected lower limit year range - years from
		setSelectedYearFrom(e.target.value);
  	};


	const handleChangeYearTo = (e) => {
		setSelectedYearTo(e.target.value);
  	};

	
	const handleRegionClick = (region, selected) => {
		if (selected) {
			setSelectedRegions([...selectedRegions, region]);
		} else {
			setSelectedRegions(
				selectedRegions.filter((selectedRegion) => {
					return selectedRegion !== region;
				})
			);
		}
	}


	const handleKeywordClick = (keyword, selected) => {
		if (selected) {
			setSelectedKeywords([...selectedKeywords, keyword]);
		} else {
			setSelectedKeywords(
				selectedKeywords.filter((selectedKeyword) => {
					return selectedKeyword !== keyword;
				})
			);
		}
	}

	
	const onCancel = () => {
		// due to rerender toggle elements with init state - not selected
		setAllYearsFrom(YEARS);
		setAllYearsTo(YEARS);
		setAllRegions(REGIONS);
		setAllKeywords(KEYWORDS);

		setSelectedYearFrom(YEARS[0]);
		setSelectedYearTo(YEARS[YEARS.length - 1]);
		setSelectedRegions([]);
		setSelectedKeywords([]);
		onHide();
	}


	const onApply = () => {
		console.log(selectedRegions);
		console.log(selectedKeywords);
		console.log(selectedYearFrom);
		console.log(selectedYearTo);
		onHide();
	}

 
	return (
		<Stack
			spacing={2}
			sx={{ pt: 2 }}>
			<Typography color="primary">Year of publication</Typography>
			<Stack 
				spacing={10} 
				sx={{ pl: 5 }} 
				direction="row"
				justifyContent="center">
				<FormControl 
					variant="standard"
					sx={{ minWidth: 120 }}
					>
					<InputLabel>From</InputLabel>
					<Select
						label="From"
						value={selectedYearFrom}
						onChange={handleChangeYearFrom}
						>
						{allYearsFrom.map(year => (
							<MenuItem key={year} value={year}>{year}</MenuItem>
						))}
					</Select>
				</FormControl>
				<Typography variant="h2" component="p" color="secondary" sx={{ pt: 2}}>-</Typography>
				<FormControl 
					variant="standard"
					sx={{ minWidth: 120 }}
					>
					<InputLabel>To</InputLabel>
					<Select
						label="To"
						value={selectedYearTo}
						onChange={handleChangeYearTo}
						>
						{allYearsTo.map(year => (
							<MenuItem key={year} value={year}>{year}</MenuItem>
						))}
					</Select>
				</FormControl>
			</Stack>
			<Typography color="primary">Region</Typography>
			<Grid 
				container 
				direction="row"
				spacing={2}
				justifyContent="center"
				>
				{allRegions.map((region) => (
					<Grid item key={region}>
						<CustomToggleButton buttonValue={region} onSelect={handleRegionClick} />
					</Grid>
				))}
			</Grid>
			<Typography color="primary">Included keywords</Typography>
			<Grid 
				container 
				direction="row"
				spacing={2}
				justifyContent="center"
				>
				{allKeywords.map((keyword) => (
					<Grid key={keyword} item>
						<CustomToggleButton buttonValue={keyword} onSelect={handleKeywordClick} />
					</Grid>
				))}
			</Grid>
			<Grid
				container
				justifyContent="flex-end"
				spacing={1}
				>
				<Grid item><Button color="secondary" variant="text" size="small" style={{textDecoration: "underline"}} onClick={onHide}><KeyboardArrowUpIcon />Hide</Button></Grid>
				<Grid item><Button size="small" variant="contained" onClick={onApply}>Apply</Button></Grid>
				<Grid item><Button color="secondary" variant="contained" size="small" onClick={onCancel}>Cancel</Button></Grid>
			</Grid>
		</Stack>

	);
	
}
