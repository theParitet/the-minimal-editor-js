import file from '../assets/pictures/file.svg';
import search from '../assets/pictures/search.svg';
import trash from '../assets/pictures/trash.svg';

export function SettingsContent({
    current,
    preferences,
    setPreferences,
    setData,
}) {
    switch (current) {
        case null:
            return (
                <p className="placeholder">
                    Choose what you want to tinker with...
                </p>
            );
        case 'Appearance':
            return (
                <>
                    <p>
                        These settings are currently applied to a portion of the
                        elements.
                    </p>

                    <h3>Theme</h3>
                    <div className="settings__options">
                        <label
                            className="btn-img btn-img--default btn-inset"
                            htmlFor="btn-is-inset1"
                        >
                            <img src={search} alt="" />
                        </label>
                        <label
                            className="btn-img btn-img--default"
                            htmlFor="btn-is-inset2"
                        >
                            <img src={search} alt="" />
                        </label>
                    </div>

                    <div className="settings__options">
                        <input
                            id="btn-is-inset1"
                            type="radio"
                            name="option"
                            onChange={() => {
                                const pref = {
                                    ...preferences,
                                    inset: true,
                                };
                                setPreferences(pref);
                                setData('pref', JSON.stringify(pref));
                            }}
                            checked={preferences.inset}
                        />
                        <input
                            id="btn-is-inset2"
                            type="radio"
                            name="option"
                            onChange={() => {
                                const pref = {
                                    ...preferences,
                                    inset: false,
                                };
                                setPreferences(pref);
                                setData('pref', JSON.stringify(pref));
                            }}
                            checked={!preferences.inset}
                        />
                    </div>

                    <div className="settings__options grid">
                        <h3>Padding</h3>
                        <h3>Smoothness</h3>
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.05}
                            onChange={e => {
                                const pref = {
                                    ...preferences,
                                    space: e.target.value,
                                };
                                setPreferences(pref);
                                setData('pref', JSON.stringify(pref));
                            }}
                            value={preferences.space}
                        />

                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.05}
                            onChange={e => {
                                const value = e.target.value;
                                const pref = {
                                    ...preferences,
                                    smoothness: value,
                                };
                                setPreferences(pref);
                                setData('pref', JSON.stringify(pref));
                            }}
                            value={preferences.smoothness}
                        />
                    </div>

                    <h3>Preview</h3>
                    <div
                        className={
                            'settings__options__preview ' +
                            (preferences.inset ? 'inset' : '')
                        }
                        style={{
                            display: 'block',
                            flexShrink: '0',
                        }}
                    >
                        <label
                            className="record"
                            style={{
                                margin: '0px auto',
                                width: '75%',
                                '--record-padding': `${preferences.space}rem`,
                                '--border-radius': `${preferences.smoothness}rem`,
                            }}
                        >
                            <button className="record__file">
                                <img src={file} alt="File icon" />
                                <p
                                    className={'record__title'}
                                    style={{
                                        fontSize: `${0.7 + preferences.space / 1.5}rem`,
                                    }}
                                >
                                    Lorem ipsum dolor
                                </p>
                            </button>
                            <button className="btn-img btn-img--danger record__trash">
                                <img src={trash} alt="Delete a file" />
                            </button>
                        </label>
                        <label
                            className="record selected"
                            style={{
                                margin: '0px auto',
                                width: '75%',
                                '--record-padding': `${preferences.space}rem`,
                                '--border-radius': `${preferences.smoothness}rem`,
                            }}
                        >
                            <button className="record__file">
                                <img src={file} alt="File icon" />
                                <p
                                    className={'record__title'}
                                    style={{
                                        fontSize: `${0.7 + preferences.space / 1.5}rem`,
                                    }}
                                >
                                    Lorem ipsum dolor
                                </p>
                            </button>
                            <button className="btn-img btn-img--danger record__trash">
                                <img src={trash} alt="Delete a file" />
                            </button>
                        </label>
                    </div>
                </>
            );
        case 'Storage':
            return (
                <>
                    <p className="placeholder">Coming soon...</p>
                </>
            );
        case 'About':
            return (
                <>
                    <p>
                        This is a project of a{' '}
                        <strong>client-side minimal editor</strong> for plain
                        text right in your browser.
                    </p>
                    <p>
                        You can check out the source code and contribute to the
                        project at the{' '}
                        <a
                            href="https://github.com/theParitet/the-minimal-editor-js"
                            target="_blank"
                        >
                            GitHub
                        </a>{' '}
                        repo.
                    </p>
                    <p>
                        If you find any bugs or want to contribute, feel free to
                        leave an issue or create a pull request.
                    </p>
                </>
            );
    }
}
