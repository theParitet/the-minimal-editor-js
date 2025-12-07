import file from '../assets/pictures/file.svg';
import trash from '../assets/pictures/trash.svg';

export function File({
    title,
    isSelected,
    handleFileChange,
    handleFileDelete,
    preferences,
}) {
    let classNameTitle = title ? 'record__title' : 'record__title empty';
    let classNameRecord = isSelected ? 'record selected' : 'record';

    return (
        <div
            className={classNameRecord}
            style={{
                '--record-padding': `${preferences.value_of_padding}rem`,
                '--border-radius': `${preferences.corners}rem`,
            }}
        >
            <button className={'record__file'} onClick={handleFileChange}>
                <img src={file} alt="File icon" />
                <p className={classNameTitle}>{title || 'Empty Title'}</p>
            </button>
            <button
                className="btn-img btn-img--danger record__trash"
                onClick={handleFileDelete}
            >
                <img src={trash} alt="Delete a file" />
            </button>
        </div>
    );
}
