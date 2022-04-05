import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Tooltip } from '@mui/material';
import { useUser } from "../Utils/UserContext";
import { useState } from 'react';

export default function ButtonPDF ({ articleId, searchTerm }) {
    const { articlesInReport, addArticleReport, removeArcticleReport } = useUser();
    const [isInReport, setIsInReport] = useState(articlesInReport.some(article => article.id === articleId));

    const handleAddArticle = (articleId, searchTerm) => {
        addArticleReport({
            "id": articleId,
            "searchTerm": searchTerm,
            "timeAdded": new Date().toLocaleString() // example: Tue, 05 Apr 2022 06:30:57 GMT
        });
        setIsInReport(true);
    }

    const handleRemoveArticle = (articleId) => {
        removeArcticleReport(articleId);
        setIsInReport(false);
    }

    // if user doesn't have this article in PDF report, allow him to add it
    // otherwise allow him to remove article from report
    return (
        <>
            {isInReport === false ? 
                <Tooltip 
                    title="Add to PDF report"
                    placement="top"
                    TransitionProps={{ timeout: 500 }}
                    arrow
                >
                    <IconButton 
                        aria-label="Add to PDF report"
                        size="small"
                        onClick={() => handleAddArticle(articleId, searchTerm)}
                    >
                        <AddCircleOutlineIcon fontSize="inherit" />
                    </IconButton>
                </Tooltip>
                :
                <Tooltip title="Remove from PDF report" placement="top" TransitionProps={{ timeout: 500 }} arrow>
                    <IconButton 
                        aria-label="Remove from PDF report"
                        size="small"
                        onClick={() => handleRemoveArticle(articleId)}
                    >
                        <RemoveCircleOutlineIcon fontSize="inherit" />
                    </IconButton>
                </Tooltip>
            }
        </>
    );
};