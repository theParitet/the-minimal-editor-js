import download from '../assets/pictures/download.svg';
import downloadInactive from '../assets/pictures/download_inactive.svg';

export function EditorControls({ hasChosenFile, handleExport }) {
    let className = 'btn-img';
    let img;
    if (!hasChosenFile) {
        className += ' inactive';
        img = downloadInactive;
    } else {
        className += ' btn-img--default';
        img = download;
    }
    return (
        <section className="editor__controls">
            <button className={className} onClick={handleExport}>
                <img src={img} alt="Download the file" />
            </button>
        </section>
    );
}
