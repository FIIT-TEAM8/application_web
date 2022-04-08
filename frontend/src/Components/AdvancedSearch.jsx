import { Button, Stack, Grid, Typography, FormControl, InputLabel, Select, MenuItem, ToggleButton, ToggleButtonGroup } from "@mui/material";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { YEARS, REGIONS, KEYWORDS } from "../Utils/AdvancedSearchItems";
import { StyledToggleButton, StyledToggleButtonGroup } from "../Style/StyledToggleButton";



export default function AdvancedSearch({onHide}) {

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


	const handleRegionClick = (e, newRegion) => {
		setSelectedRegions(newRegion);
	}


	const handleKeywordClick = (e, newKeyword) => {
		setSelectedKeywords(newKeyword);
	}

	
	const onCancel = () => {
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
						{YEARS.map(year => (
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
			
			<StyledToggleButtonGroup
				value={selectedRegions}
				onChange={handleRegionClick}
				>
				{REGIONS.map((region) => (
					<StyledToggleButton sx={{ whiteSpace: 'nowrap' }} size="small" key={region} value={region}>{region}</StyledToggleButton>	
				))}
			</StyledToggleButtonGroup>

			<Typography color="primary">Included keywords</Typography>
			
			<StyledToggleButtonGroup
				value={selectedKeywords}
				onChange={handleKeywordClick}
				>
				{KEYWORDS.map((keywords) => (
					<StyledToggleButton sx={{ whiteSpace: 'nowrap' }} size="small" key={keywords} value={keywords}>{keywords}</StyledToggleButton>	
				))}
			</StyledToggleButtonGroup>

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