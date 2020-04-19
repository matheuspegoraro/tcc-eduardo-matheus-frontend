import React, { useState } from 'react';

import Select from 'react-select';
import makeAnimated from 'react-select/animated';

function MultiSelect(props) {
    const [selectState, setSelectState] = useState(props);

    const animatedComponents = makeAnimated();

    return (
        <Select
            isMulti
            closeMenuOnSelect={false}
            components={animatedComponents}
            name={selectState.name}
            id={selectState.id}
            options={selectState.options}
            defaultValue={selectState.defaultValue}
            onChange={selectState.handleChange}
        />
    )
}

export default MultiSelect;