import { Button, Stack, Grid, Typography, FormControl, InputLabel, Select, MenuItem, Item, ToggleButtonGroup } from "@mui/material";
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
		<Grid container
			spacing={2}
			sx={{ pt: 2 }}
		>
			<Grid item>
				<Typography color="primary">Year of publication</Typography>
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
							value={selectedYearFrom}
							onChange={handleChangeYearFrom}
						>
							{YEARS.map(year => (<MenuItem key={year} value={year}>{year}</MenuItem>))}
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
							value={selectedYearTo}
							onChange={handleChangeYearTo}
						>
							{allYearsTo.map(year => (<MenuItem key={year} value={year}>{year}</MenuItem>))}
						</Select>
					</FormControl>
				</Grid>
			</Grid>

			<Grid item>
				<Typography color="primary">Region</Typography>
			</Grid>

			<StyledToggleButtonGroup
				value={selectedRegions}
				onChange={handleRegionClick}
			>
				{REGIONS.map((region) => (
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
				<Typography color="primary">Included keywords</Typography>
			</Grid>
			
			<StyledToggleButtonGroup
				value={selectedKeywords}
				onChange={handleKeywordClick}
			>
				{KEYWORDS.map((keyword) => (
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
				<Grid item><Button size="small" variant="contained" onClick={onApply}>Apply</Button></Grid>
				<Grid item><Button color="secondary" variant="contained" size="small" onClick={onCancel}>Cancel</Button></Grid>
			</Grid>
		</Grid>

	);
	
}