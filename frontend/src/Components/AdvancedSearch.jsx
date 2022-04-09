import { Button, Grid, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ClearIcon from '@mui/icons-material/Clear';
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { YEARS, REGIONS, KEYWORDS } from "../Utils/AdvancedSearchItems";
import { StyledToggleButton, StyledToggleButtonGroup } from "../Style/StyledToggleButton";



export default function AdvancedSearch({parentOnHide, parentOnApply, parentFilterClick}) {

	const [searchParams, setSearchParams] = useSearchParams();
	const [allYearsTo, setAllYearsTo] = useState(YEARS);
	const [selectedRegions, setSelectedRegions] = useState([]);
	const [selectedKeywords, setSelectedKeywords] = useState([]);
	const [selectedYearFrom, setSelectedYearFrom] = useState(YEARS[0]);
	const [selectedYearTo, setSelectedYearTo] = useState(YEARS[YEARS.length - 1]);
	const [appliedYearFrom, setAppliedYearFrom] = useState(false);
	const [appliedYearTo, setAppliedYearTo] = useState(false);


	const getNoOfSelectedFiltes = () => {
		var sum = 0;
		var appliedRegions = selectedRegions.length;
		var appliedKeywords = selectedKeywords.length;

		if (appliedYearFrom) {
			sum += 1;
		}
		if (appliedYearTo) {
			sum += 1;
		}
		
		sum += appliedRegions;
		sum += appliedKeywords;

		return sum;
	}
	

  	const handleChangeYearFrom = (e) => {
		setAllYearsTo(YEARS.slice(YEARS.indexOf(e.target.value))); // changing based on selected lower limit year range - years from
		setSelectedYearFrom(e.target.value);
  	};


	const handleChangeYearTo = (e) => {
		setSelectedYearTo(e.target.value);
  	};


	const handleRegionClick = (e, newRegion) => {
		setSelectedRegions(newRegion);
		parentFilterClick(getNoOfSelectedFiltes());
	}


	const handleKeywordClick = (e, newKeyword) => {
		setSelectedKeywords(newKeyword);
		parentFilterClick(getNoOfSelectedFiltes());
	}


	const onHide = () => {
		parentOnHide();
	}

	
	const onCancel = () => {
		setSelectedYearFrom(YEARS[0]);
		setSelectedYearTo(YEARS[YEARS.length - 1]);
		setSelectedRegions([]);
		setSelectedKeywords([]);
		parentFilterClick(0);
		parentOnHide();
	}


	const onClear = () => {
		//window.scroll({top: 0, left: 0, behavior: 'smooth' });
		setSelectedYearFrom(YEARS[0]);
		setSelectedYearTo(YEARS[YEARS.length - 1]);
		setSelectedRegions([]);
		setSelectedKeywords([]);
		parentFilterClick(0);
	}


	const onApply = () => {
		searchParams.delete("from");
		searchParams.delete("to");
		searchParams.delete("regions");
		searchParams.delete("keywords");

		if (appliedYearFrom) {
			searchParams.append("from", selectedYearFrom + '-01-01');
		}

		if (appliedYearFrom) {
			searchParams.append("to", selectedYearTo + '-31-12');
		}

		if (selectedRegions.length) {
			searchParams.append("regions", '[' + selectedRegions.join(',') + ']');
		}

		if (selectedKeywords.length) {
			searchParams.append("keywords", '[' + selectedKeywords.join(',') + ']');
		}

		setSearchParams(searchParams);
		parentOnApply();
	}


	useEffect(() => {
		if (selectedYearFrom !== YEARS[0]) {
			setAppliedYearFrom(true);
		} else {
			setAppliedYearFrom(false);
		}
	}, [selectedYearFrom]);


	useEffect(() => {
		if (selectedYearTo !== YEARS[YEARS.length - 1]) {
			setAppliedYearTo(true);
		} else {
			setAppliedYearTo(false);
		}
	}, [selectedYearTo]);


	useEffect(() => {
		parentFilterClick(getNoOfSelectedFiltes());
	}, [appliedYearFrom, appliedYearTo, selectedKeywords, selectedRegions]);

 
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
				{selectedRegions.length ? <Typography color="primary">Region</Typography> : <Typography color="secondary">Region</Typography>}
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
				{selectedKeywords.length ? <Typography color="primary">Included keywords</Typography> : <Typography color="secondary">Included keywords</Typography>}
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
				<Grid item><Button color="secondary" variant="text" size="small" style={{textDecoration: "underline"}} onClick={onClear}><ClearIcon />Clear</Button></Grid>
				<Grid item><Button size="small" variant="contained" onClick={onApply}>Apply & Search</Button></Grid>
				<Grid item><Button color="secondary" variant="contained" size="small" onClick={onCancel}>Cancel</Button></Grid>
			</Grid>
		</Grid>

	);
	
}