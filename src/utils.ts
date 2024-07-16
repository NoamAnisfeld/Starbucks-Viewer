export function visibleErrorMessage(error: unknown) {
    console.error(error);
    alert(
        error && typeof error === 'object' && 'message' in error
            ? 'Error: \n' + error.message
            : 'Unexpected error'
    );
}
