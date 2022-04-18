export const emptyFilters = {
    'from': {
        'value': '',
        'defaultValue': '',
    },
    'to': {
        'value': '',
        'defaultValue': '',
    },
    'regions': [],
    'keywords': [],
}

export function getYears (firstYear, lastYear) {
    let numYears = lastYear - firstYear + 1
    let years = new Array(numYears);
    
    for (let i = 0; i < numYears; i++) {
        let year = firstYear + i;
        years[i] = year.toString();
    }
    return years;
}