exports.unflatObject = (obj) => {
    const result = {};

    for (const key in obj) {
        const keys = key.split('.');
        let currentLevel = result;

        for (let i = 0; i < keys.length; i++) {
            const currentKey = keys[i];
            const isArray = /\[\d+\]$/.test(currentKey);
            const arrayDelimiter = ',';

            if (isArray) {
                const arrayKey = currentKey.replace(/\[\d+\]$/, '');
                const index = parseInt(keys[i].match(/\d+/)[0], 10);

                if (!currentLevel[arrayKey]) {
                    currentLevel[arrayKey] = [];
                }

                if (i === keys.length - 1) {
                    const values = obj[key].split(arrayDelimiter);
                    currentLevel[arrayKey][index] = values.length > 1 ? values.map(value => value.trim()) : values[0].trim();
                } else {
                    if (!currentLevel[arrayKey][index]) {
                        currentLevel[arrayKey][index] = {};
                    }
                }

                currentLevel = currentLevel[arrayKey][index];
            } else {
                if (!currentLevel[currentKey]) {
                    if (i === keys.length - 1) {
                        const values = obj[key].split(arrayDelimiter);
                        currentLevel[currentKey] = values.length > 1 ? values.map(value => value.trim()) : values[0].trim();
                    } else {
                        currentLevel[currentKey] = {};
                    }
                }
                currentLevel = currentLevel[currentKey];
            }
        }
    }

    return result;
}