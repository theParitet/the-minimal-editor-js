import { Status } from './Status';

export function Statuses({ statuses, handleImport, handleStatusesDelete }) {
    const StatusesJSX = statuses.map(status => {
        return <Status fileData={status.files} key={status.id} />;
    });
    const placeholderJSX = <p className="placeholder">No imports yet...</p>;

    return (
        <div className="statuses-container">
            <div className="statuses-container__controls">
                <label htmlFor="file-reader" className="btn btn--default">
                    Import
                </label>
                <input
                    id="file-reader"
                    onChange={handleImport}
                    multiple={true}
                    type="file"
                    accept="text/*"
                />

                <button
                    className="btn btn--default"
                    onClick={handleStatusesDelete}
                >
                    Clear
                </button>
            </div>
            <div className="statuses-container__imports">
                {statuses.length ? StatusesJSX : placeholderJSX}
            </div>
        </div>
    );
}
