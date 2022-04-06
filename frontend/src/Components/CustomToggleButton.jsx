import { ToggleButton } from "@mui/material";
import { useState, useEffect } from "react";


export default function CustomToggleButton({buttonValue, onSelect}){

    const [selected, setSelected] = useState(false);


    useEffect(() => {
        onSelect(buttonValue, selected);
    }, [selected]);


    return (
        <ToggleButton
            size="small"
            value="check"
            selected={selected}
            onChange={() => {
                setSelected(!selected);
            }}
            >
            {buttonValue}
        </ToggleButton>
    );
}