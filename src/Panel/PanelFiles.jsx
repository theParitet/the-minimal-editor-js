import { File } from './File';

export function PanelFiles({ saves, id, changeFile, deleteFile, preferences }) {
    return (
        <section className="panel__files">
            {saves.length ? (
                saves.map(save => {
                    const isSelected = save.id === id;
                    return (
                        <File
                            key={save.id}
                            isSelected={isSelected}
                            title={save.title}
                            preferences={preferences}
                            handleFileChange={() => changeFile(save.id)}
                            handleFileDelete={() => deleteFile(save.id)}
                        />
                    );
                })
            ) : (
                <p
                    style={{
                        textAlign: 'center',
                        color: '#aaa',
                    }}
                >
                    Nothing here yet...
                </p>
            )}
        </section>
    );
}
