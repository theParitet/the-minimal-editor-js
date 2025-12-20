import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

import expand from './assets/pictures/expand.svg';
import zenIcon from './assets/pictures/zen.svg';
import githubIcon from './assets/pictures/github-mark-white.svg';

import './App.css';
import { Notifications } from './Notifications/Notifications';
import { EditorControls } from './Editor/EditorControls';
import { Editor } from './Editor/Editor';
import { PanelControls } from './Panel/PanelControls';
import { PanelFiles } from './Panel/PanelFiles';
import { SettingsModal } from './Modal/SettingsModal';

let importedId = 0;

const version = 'v0.1.1';

const readmeTitle = `⚙️ Your Minimal Editor ${version}`;
const readmeContent = `[info]
This is a web-based plain text editor right in your browser. No links, no formatting, no images, no distraction.

This is just the _first_ implementation of a minimal editor.

[features]
- Create, edit and delete text files
- Import and export the files
- Embrace zen mode for focused writing
- Data is preserved with the browser local storage (5-10 megabytes of memory)
- Configure the appearance to your liking in the settings
- ... More to come!

[aspirations]
The editor will be continuously improved. It will:
- become more performant and reliable by using asynchronous and persistent storage
- have better UX by offering searching and sorting, smart titles, extended file structure and better customization
- offer offline functionality

[more]
If you wish to learn more, you can find additional information on GitHub by following the link in the header or About section of the settings.`;
const readme = {
    id: -1,
    title: readmeTitle,
    content: readmeContent,
};

let data = JSON.parse(localStorage.getItem('saves'));
if (!data) {
    data = [readme];
}

let pref = JSON.parse(localStorage.getItem('pref'));
if (!pref) {
    pref = {
        inset: false,
        space: 0.25,
        smoothness: 0.5,
    };
}

let id;
const lastItem = parseInt(localStorage.getItem('last'));

if (lastItem || lastItem === 0) {
    id = lastItem;
}

export default function App() {
    const [fileId, setFileId] = useState(id);
    const [saves, setSaves] = useState(data);
    const [statuses, setStatuses] = useState([]);
    const [isPanelCollapsed, setIsPanelCollapsed] = useState(true);

    const [notifications, setNotifications] = useState([]);

    const [preferences, setPreferences] = useState(pref);
    const [inert, setInert] = useState(false);
    const [zen, setZen] = useState(false);

    const titleRef = useRef(null);
    const contentRef = useRef(null);

    const currentFile = findById(saves, fileId);

    function getNextId(givenSaves = saves) {
        let lastId = 0;

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
        const fileData = []; //title + error (if any)

        const tempSaves = saves.slice();
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

        const fileExtensionRegex = /(\.[a-zA-Z]{1,5})$/g;
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
                <a
                    className="btn-img btn-img--default"
                    href="https://github.com/theParitet/the-minimal-editor-js"
                    target="_blank"
                    style={{
                        position: 'absolute',
                        right: '.3rem',
                    }}
                >
                    <img width={24} src={githubIcon} />
                </a>
            </header>

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

            {notifications.length !== 0 && (
                <Notifications
                    notifications={notifications}
                    handleDeleteNotification={handleDeleteNotification}
                    inert={inert}
                />
            )}

            <main
                id="manager"
                className={
                    (!zen ? '' : ' zen') + (preferences.inset ? ' inset' : '')
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
