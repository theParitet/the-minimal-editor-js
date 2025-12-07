import { useState } from 'react';
import addFile from '../assets/pictures/add_file.svg';
import settings from '../assets/pictures/settings.svg';
import upload from '../assets/pictures/upload.svg';
import zen from '../assets/pictures/zen.svg';
import { Statuses } from '../Statuses/Statuses';

export function PanelControls({
    handleNewFile,
    handleImport,
    handleStatusesDelete,
    statuses,
    handleZen,
    handleSettings,
}) {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const handleCollapsed = () => setIsCollapsed(!isCollapsed);
    return (
        <section className="panel__controls">
            <div className="panel__controls__section">
                <button
                    className="btn-img btn-img--default"
                    onClick={handleNewFile}
                >
                    <img src={addFile} alt="Add file icon" />
                </button>
                <button
                    className={
                        !isCollapsed
                            ? 'btn-img btn-img--default active'
                            : 'btn-img btn-img--default'
                    }
                    onClick={handleCollapsed}
                >
                    <img src={upload} alt="Upload files icon" />
                </button>
            </div>

            {!isCollapsed ? (
                <Statuses
                    statuses={statuses}
                    handleStatusesDelete={handleStatusesDelete}
                    handleImport={handleImport}
                />
            ) : (
                ''
            )}

            {/* SEARCH BUTTON HERE */}

            <div className="panel__controls__section">
                <button
                    className="btn-img btn-img--default"
                    onClick={handleZen}
                >
                    <img src={zen} alt="Zen mode icon" />
                </button>
                <button
                    className="btn-img btn-img--default"
                    onClick={() => {
                        handleSettings();
                        setIsCollapsed(true);
                    }}
                >
                    <img src={settings} alt="Settings icon" />
                </button>
            </div>
        </section>
    );
}
