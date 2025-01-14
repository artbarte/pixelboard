export function normalizeSparseArray(array: any[][]) {
    // Find the first outer index with a defined value
    const minOuterIndex = array.findIndex(row => row !== undefined && row !== null);

    if (minOuterIndex === -1) {
        // If the array has no data, return an empty array
        return [];
    }

    // Shift the outer array to remove empty slots
    const shiftedOuter = array.slice(minOuterIndex);

    // Find the minimum inner index for all rows that have data
    const minInnerIndex = Math.min(
        ...shiftedOuter
            .filter(row => Array.isArray(row)) // Only consider defined rows
            .map(row =>
                row.findIndex(cell => cell !== undefined && cell !== null)
            )
            .filter(index => index !== -1) // Ignore rows that are fully empty
    );

    // Normalize inner arrays by removing leading gaps
    const normalizedArray = shiftedOuter.map(row => {
        if (Array.isArray(row)) {
            return row.slice(minInnerIndex);
        }
        return row; // For undefined or non-array rows, keep as-is
    });

    return normalizedArray;
}
