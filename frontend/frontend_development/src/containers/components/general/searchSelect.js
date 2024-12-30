import React, { useState, useRef } from 'react';

const SearchSelect = ({ dataList, displayKey, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isInputFocused, setInputFocused] = useState(false);
    const dropdownRef = useRef(null);
    const blurTimeoutRef = useRef(null);

    const handleSearchChange = (e) => {
        console.log(dataList)
        setSearchTerm(e.target.value);
    };

    const handleDataClick = (dataItem) => {
        setSearchTerm(dataItem[displayKey]);
        onSelect(dataItem);
    };

    const filteredData = dataList.filter((item) => {
        const itemValue = item[displayKey];
        if (!itemValue) return false;
        return itemValue.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div style={{ position: 'relative' }}>
            <input
                type="text"
                placeholder={`Search for ${displayKey}...`}
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setInputFocused(true)}
                onBlur={() => {
                    if (blurTimeoutRef.current) {
                        clearTimeout(blurTimeoutRef.current);
                    }
                    blurTimeoutRef.current = setTimeout(() => {
                        setInputFocused(false);
                    }, 200);
                }}
            />

            {isInputFocused && (
                <div
                    className="data-list"
                    ref={dropdownRef}
                    style={{ position: 'absolute', zIndex: 1, backgroundColor: 'white', border: '1px solid #ccc' }}
                    onMouseDown={(e) => e.preventDefault()}
                >
                    {filteredData.map((item) => (
                        <div
                            key={item[displayKey]}
                            onClick={() => handleDataClick(item)}
                        >
                            {item[displayKey]}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchSelect;
