import { styled } from '@mui/material/styles';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { theme } from "./Theme";


export const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ originTheme }) => ({
	'&': {
		display: 'inline-block',
		textAlign: 'center',
	},
	'& .MuiToggleButtonGroup-grouped': {
		'&:not(:first-of-type)': {
			borderTopRightRadius: '5px',
			borderBottomRightRadius: '5px',
			borderTopLeftRadius: '5px',
			borderBottomLeftRadius: '5px',
			border: '1px solid #e0e0e0',
			marginLeft: '16px',
			marginTop: '16px',
		},
		'&:not(:last-of-type)': {
			borderTopRightRadius: '5px',
			borderBottomRightRadius: '5px',
			borderTopLeftRadius: '5px',
			borderBottomLeftRadius: '5px',
			border: '1px solid #e0e0e0',
			marginLeft: '16px',
			marginTop: '16px',
		},
		'&.Mui-selected+.MuiToggleButtonGroup-grouped.Mui-selected': {
			marginLeft: '16px',
			marginTop: '16px',
			border: '1px solid #e0e0e0',
			backgroundColor: theme.palette.primary.light,
			'&:hover': {
				backgroundColor: theme.palette.secondary.light,
			}
		},

	
	},
}));


export const StyledToggleButton = styled(ToggleButton)(({originTheme}) => ({
    '&': {
        '&.Mui-selected': {
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.primary.light,
			'&:hover': {
				backgroundColor: theme.palette.secondary.light,
			},
        },
		
		
    },
}));