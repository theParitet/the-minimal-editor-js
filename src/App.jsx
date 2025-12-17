import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

import expand from './assets/pictures/expand.svg';
import zenIcon from './assets/pictures/zen.svg';

import './App.css';
import { Notifications } from './Notifications/Notifications';
import { EditorControls } from './Editor/EditorControls';
import { Editor } from './Editor/Editor';
import { PanelControls } from './Panel/PanelControls';
import { PanelFiles } from './Panel/PanelFiles';
import { SettingsModal } from './Modal/SettingsModal';

// TODO: make an actual documentation directory for these TODOs...
// TODO: introduce context provider for the all of the main editor operations

let importedId = 0;

const version = 'v0.1.0'; // could be used later to ensure compatibility with outdated json of the saves
// localStorage.setItem('v', ... );

const readmeTitle = `⚙️ Your Minimal Editor ${version}`;
const readmeContent = `[info]
Quick info:
This is a plain text editor. No links, no formatting, no images.

The files are stored in your the browser memory (local storage). Local storage is able to hold about 5-10 MB of memory, which is enough to write a few decently-sized novels.

This is just the first implementation of a minimal editor that I decided to make when exploring React. Dipping my toes into the water, one may say.

[features]
Main features:
- Add & Delete files
- Files have a title and content
- Import and export text files
- Data is preserved with local storage
- ... More to come!

Additionally, the editor is being tested to work well across different devices and browsers.

[aspirations]
In future iterations of this editor, IndexedDB would be used instead, which allows significantly more space (exact size may vary) and is not blocking, making the saving operations asynchronous (unlike local storage).

StorageManager API would be later leveraged to ensure better client-side UX. PWA is also an option to explore, due to potential offline support.

Other features would be added to enhance this editor further.

[more]
If you wish to learn more, you can find additional information on GitHub:
https://github.com/theParitet/the-minimal-editor-js
(direct hyperlink link can be found in Settings (gear icon) > About)`;
const readme = {
    id: -1,
    title: readmeTitle,
    content: readmeContent,
};

// initialization
let data = JSON.parse(localStorage.getItem('saves'));
if (!data) {
    data = [readme];
}

let pref = JSON.parse(localStorage.getItem('pref'));
if (!pref) {
    pref = {
        button_is_inset: false,
        value_of_padding: 0.5, //rem
        corners: 0.5, //rem
    };
}

let id;
console.log('LAST ITEM:', localStorage.getItem('last'));
const lastItem = parseInt(localStorage.getItem('last'));

if (lastItem || lastItem === 0) {
    id = lastItem;
}

export default function App() {
    const [fileId, setFileId] = useState(id); // should use local storage to check last saves
    const [saves, setSaves] = useState(data); // should set the state based on the local storage
    const [statuses, setStatuses] = useState([]);
    const [isPanelCollapsed, setIsPanelCollapsed] = useState(true);

    const [notifications, setNotifications] = useState([]);

    const [preferences, setPreferences] = useState(pref);
    const [inert, setInert] = useState(false);
    const [zen, setZen] = useState(false);

    const titleRef = useRef(null);
    const contentRef = useRef(null);

    const currentFile = findById(saves, fileId);

    console.log('>>>>>>>>>>>>>>>>>>RERENDER');
    console.log('current id:', fileId);
    console.log('current file:', currentFile);
    console.log('saves:', saves);

    function getNextId(givenSaves = saves) {
        let lastId = 0;
        console.log(givenSaves);

        const ids = givenSaves.map(save => save.id);
        ids.forEach(id => {
            if (id > lastId) {
                lastId = id + 1;
            } else if (id === lastId) {
                lastId++;
            }
        });
        return lastId;
    }

    const handleNewFile = () => {
        const copy = saves.slice();
        const nextId = getNextId();
        copy.push({
            id: nextId,
            title: '',
            content: '',
        });

        setSaves(copy);
        setFileId(nextId);
        setTimeout(() => {
            titleRef.current.focus();
        }, 1);

        setData('saves', JSON.stringify(copy));
        setData('last', nextId);
    };

    const handleContentChange = e => {
        if (fileId || fileId === 0) {
            const modifiedSaves = saves.map(save => {
                if (save.id !== fileId) {
                    return save;
                } else {
                    const text = e.target.value + '';
                    return {
                        ...save,
                        content: text,
                    };
                }
            });
            setSaves(modifiedSaves);
            setData('saves', JSON.stringify(modifiedSaves));
        }
    };

    const handleTitleChange = e => {
        if (fileId || fileId === 0) {
            let title = e.target.value;

            const modifiedSaves = saves.map(save => {
                if (save.id !== fileId) {
                    return save;
                } else {
                    return {
                        ...save,
                        title: title,
                    };
                }
            });

            setSaves(modifiedSaves);
            setData('saves', JSON.stringify(modifiedSaves));
        }
    };

    const handleAddReadme = () => {
        if (!findById(saves, -1)) {
            const copy = saves.slice();
            copy.push(readme);
            setSaves(copy);
            setData('saves', JSON.stringify(copy));
        }
        setFileId(-1);
        setData('last', -1);
    };

    function changeFile(id) {
        setFileId(id);
        setData('last', id);
        setIsPanelCollapsed(true);
    }

    function deleteFile(id) {
        if (id === fileId) {
            setFileId(null);
            setData('last', null);
        }

        const modifiedSaves = saves.filter(save => save.id !== id);
        setSaves(modifiedSaves);
        setData('saves', JSON.stringify(modifiedSaves));
    }

    const handleStatusesDelete = () => {
        setStatuses([]);
    };

    const handleImport = async e => {
        const initFiles = e.target.files;
        // const newFiles = [];
        const fileData = []; //title + error (if any)

        const tempSaves = saves.slice();
        // trying to push every new file
        for (const file of initFiles) {
            let title = file.name;

            try {
                const content = await file.text();

                const nextId = getNextId(tempSaves);
                const fileObj = {
                    id: nextId,
                    title: title,
                    content: content,
                };

                tempSaves.push(fileObj);

                setData(
                    'saves',
                    JSON.stringify(tempSaves),
                    {
                        key: `FILELOAD::FAIL::${title}`,
                        type: 'danger',
                        title: 'Unable to Load File',
                        description: (
                            <p className="notification__description">
                                The{' '}
                                <strong>
                                    <code>{title}</code>
                                </strong>{' '}
                                file could not be loaded due to the insufficient
                                space in the browser memory (taking up more than
                                5MB).
                            </p>
                        ),
                    },
                    true
                );
                setData('last', nextId, 0, true);
                setFileId(nextId);

                fileData.push({
                    title: title,
                    error: '',
                });
            } catch (err) {
                tempSaves.pop();

                console.error(err);
                fileData.push({
                    title: title,
                    error: err.message,
                });
            }
        }

        const copy = statuses.slice();
        copy.push({
            id: importedId++,
            files: fileData,
        });
        setStatuses(copy);

        setSaves(tempSaves);
        setData('saves', JSON.stringify(tempSaves));
    };

    const handleExport = () => {
        const blob = new Blob([currentFile.content], { type: 'text/*' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);

        const fileName = currentFile.title;

        const fileExtensionRegex = /(\.[a-zA-Z]{1,5})$/g; // probably close
        const isLegitFileExtension = fileExtensionRegex.test(fileName);
        const extension = isLegitFileExtension ? '' : '.txt';
        const exportedFileName = fileName
            ? fileName + extension
            : 'New File' + currentFile.id + extension;

        link.download = exportedFileName;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(link.href);
    };

    function addNotification(notification) {
        if (typeof notification === 'number') {
            let numKey = notification;
            switch (notification) {
                case 0:
                    notification = {
                        type: 'danger',
                        title: 'Unable to Save Changes',
                        description:
                            'Browser storage exceeded (more than 5MB of memory). Unable to write more data.',
                    };
                    break;
                case 5:
                    notification = {
                        type: 'warning',
                        title: 'Storage is not Persistent',
                        description:
                            'You are limited to the browser storage that is susceptible to erasing.',
                    };
                    break;
                case 7:
                    notification = {
                        type: 'info',
                        title: 'Test Info',
                        description: (
                            <p className="notification__description">
                                This is a test info message.
                            </p>
                        ),
                    };
                    break;
                default:
                    notification = {
                        type: 'danger',
                        title: 'Unknown Error',
                        description: (
                            <p className="notification__description">
                                Unknown error. If being continuously
                                encountered,{' '}
                                <a
                                    href="https://github.com/theParitet/the-minimal-editor-js/issues"
                                    target="_blank"
                                >
                                    submit an issue
                                </a>{' '}
                                on GitHub.
                            </p>
                        ),
                    };
                    break;
            }
            notification.key = `PREDEFINED::${numKey}`;
        }
        setNotifications(prev => [notification, ...prev]);
    }

    const handleDeleteNotification = key => {
        const copy = notifications.slice();
        setNotifications(copy.filter(notification => notification.key !== key));
    };

    function setData(key, data, notification = 0, throwError = false) {
        try {
            localStorage.setItem(key, data);
            return true;
        } catch (e) {
            addNotification(notification);
            if (throwError) {
                throw new Error(e.name);
            }
            return false;
        }
    }

    console.log('RERENDER<<<<<<<<<<<<<<<<<<');

    return (
        <>
            <header className="header" inert={inert}>
                <h1 className="header__hero">
                    The <span className="header__hero--highlight">Minimal</span>{' '}
                    Editor
                </h1>
                <button className="header__btn" onClick={handleAddReadme}>
                    Learn more
                </button>
            </header>

            {/* modal (settings) */}
            {inert &&
                createPortal(
                    <SettingsModal
                        handleInert={() => setInert(!inert)}
                        preferences={preferences}
                        setPreferences={setPreferences}
                        setData={setData}
                    />,
                    document.body
                )}
            {/* inert */}

            {notifications.length !== 0 && (
                <Notifications
                    notifications={notifications}
                    handleDeleteNotification={handleDeleteNotification}
                    inert={inert}
                />
            )}
            {/* notifications (managing overflow) */}

            <main
                id="manager"
                className={
                    (!zen ? '' : ' zen') +
                    (preferences.button_is_inset ? ' inset' : '')
                }
                inert={inert}
            >
                {zen && (
                    <button className="btn-zen" onClick={() => setZen(!zen)}>
                        <img src={zenIcon} alt="" />
                    </button>
                )}

                <article
                    id="panel"
                    className={
                        !isPanelCollapsed
                            ? 'manager__panel'
                            : 'manager__panel collapsed'
                    }
                >
                    <PanelControls
                        statuses={statuses}
                        handleNewFile={handleNewFile}
                        handleImport={handleImport}
                        handleStatusesDelete={handleStatusesDelete}
                        handleZen={() => {
                            setZen(!zen);
                            setIsPanelCollapsed(true);
                        }}
                        handleSettings={() => {
                            setInert(!inert);
                            setIsPanelCollapsed(true);
                        }}
                    />
                    <PanelFiles
                        id={fileId}
                        saves={saves}
                        changeFile={changeFile}
                        deleteFile={deleteFile}
                        preferences={preferences}
                    />
                    <button
                        className="manager__panel__expand-btn"
                        onClick={() => {
                            setIsPanelCollapsed(!isPanelCollapsed);
                        }}
                    >
                        <img
                            src={expand}
                            alt=""
                            style={
                                !isPanelCollapsed ? { rotate: '180deg' } : {}
                            }
                        />
                    </button>
                </article>

                <article id="editor" className="manager__editor">
                    <EditorControls
                        hasChosenFile={currentFile ? true : false}
                        handleExport={handleExport}
                    />
                    <Editor
                        isPanelCollapsed={isPanelCollapsed}
                        file={currentFile}
                        titleRef={titleRef}
                        contentRef={contentRef}
                        handleTitleChange={handleTitleChange}
                        handleContentChange={handleContentChange}
                    />
                </article>
            </main>
        </>
    );
}

function findById(arr, id) {
    return arr.find(el => el.id === id);
}
