
function YearFilter({ years, selectedYear, onYearChange }) {
    return (
        <div className="year-filter">
            <select value={selectedYear} onChange={(e) => onYearChange(e.target.value)}>
                {years.map(year => (
                    <option key={year} value={year === 'Todos os anos' ? '' : year}>
                        {year}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default YearFilter;