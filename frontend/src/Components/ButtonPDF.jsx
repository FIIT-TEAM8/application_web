import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Tooltip } from '@mui/material';
import { useUser } from "../Utils/UserContext";
import { useState } from 'react';

export default function ButtonPDF ({ articleId }) {
    // load array of all articles ids with function for adding and removing articles from PDF report
    const { articlesInPDFReport, addArticlePDFReport, removeArcticlePDFReport } = useUser();
    const [isInPDFReport, setIsInPDFReport] = useState(articlesInPDFReport.includes(articleId));

    const addedToReport = (articleId) => {
        // add article to PDF report and change state
        addArticlePDFReport(articleId);
        setIsInPDFReport(true);
    }

    const removedFromReport = (articleId) => {
        // remove article from PDF report and change state
        removeArcticlePDFReport(articleId);
        setIsInPDFReport(false);
    }

    // if user doesn't have this article in PDF report allow him to add it in report
    // otherwise allow him to remove it from report
    return (
        <>
            {isInPDFReport === false ? 
                <Tooltip title="Add to PDF report" placement="top" arrow>
                    <IconButton 
                        aria-label="Add to PDF report"
                        size="small"
                        onClick={() => addedToReport(articleId)}
                    >
                        <AddCircleOutlineIcon fontSize="inherit" />
                    </IconButton>
                </Tooltip>
                :
                <Tooltip title="Remove from PDF report" placement="top" arrow>
                    <IconButton 
                        aria-label="Remove from PDF report"
                        size="small"
                        onClick={() => removedFromReport(articleId)}
                    >
                        <RemoveCircleOutlineIcon fontSize="inherit" />
                    </IconButton>
                </Tooltip>
            }
        </>
    );
};