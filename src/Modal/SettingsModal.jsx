import { useState } from 'react';
import { SettingsContent } from './SettingsContent';
import cross from '../assets/pictures/cross.svg';

export function SettingsModal({
    handleInert,
    preferences,
    setPreferences,
    setData,
}) {
    const [current, setCurrent] = useState(null);

    const content = ['Appearance', 'Storage', 'About'];

    return (
        <main id="modal-container">
            <div>
                <button
                    className="btn-img btn-img--default"
                    onClick={handleInert}
                >
                    <img src={cross} alt="" />
                </button>

                <div className="modal">
                    <div className="modal__options">
                        {content.map(option => {
                            return (
                                <button
                                    className={
                                        'modal__options__option' +
                                        (current === option ? ' active' : '')
                                    }
                                    onClick={() => setCurrent(option)}
                                    key={option}
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                    <div className="modal__content">
                        <h1 className="modal__content__title">{current}</h1>
                        <SettingsContent
                            current={current}
                            preferences={preferences}
                            setPreferences={setPreferences}
                            setData={setData}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
