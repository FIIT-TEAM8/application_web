import StarBorderIcon from '@mui/icons-material/StarBorder';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Tooltip } from '@mui/material';
import { useUser } from "../Utils/UserContext";

export default function ButtonPDF ({ articleId }) {
    // load array of all articles ids with function for adding and removing articles from PDF report
    const { articlesInPDFReport, addArticleToPDFReport } = useUser();

    // if user doesn't have this article in PDF report allow him to add it in report
    // otherwise allow him to remove it from report
    return (
        <>
            {articlesInPDFReport.includes(articleId) == false ? 
                <Tooltip title="Add to PDF report" placement="top" arrow>
                    <IconButton 
                        aria-label="Add to PDF report"
                        size="small"
                        onClick={() => addArticleToPDFReport(articleId)}
                    >
                        <AddCircleOutlineIcon fontSize="inherit" />
                    </IconButton>
                </Tooltip>
                :
                <Tooltip title="Remove from PDF report" placement="top" arrow>
                    <IconButton 
                        aria-label="Remove from PDF report"
                        size="small"
                        onClick={() => addArticleToPDFReport(articleId)}
                    >
                        <RemoveCircleOutlineIcon fontSize="inherit" />
                    </IconButton>
                </Tooltip>
            }
        </>
    );
};