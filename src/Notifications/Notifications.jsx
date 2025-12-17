import cross from '../assets/pictures/cross.svg';

export function Notifications({ notifications, handleDeleteNotification }) {
    const repeat = [];
    const keys = [];

    notifications.forEach(ntf => {
        if (!keys.includes(ntf.key)) {
            keys.push(ntf.key);
            repeat.push({
                ...ntf,
                count: 1,
            });
        } else {
            repeat.some(record => {
                if (record.key === ntf.key) {
                    record.count++;
                    return true;
                }
                return false;
            });
        }
    });

    console.log(notifications);
    const notificationsJSX = repeat.map(record => {
        return (
            <div className={'notification ' + record.type} key={record.key}>
                <div>
                    <h1 className="notification__title">
                        {record.title}{' '}
                        {record.count !== 1 && (
                            <span className="notification__count">
                                {record.count}x
                            </span>
                        )}
                    </h1>
                    {typeof record === 'string' ? (
                        <p className="notification__description">
                            {record.description}
                        </p>
                    ) : (
                        record.description
                    )}
                </div>
                <button
                    className="btn-img btn-img--default notification__btn"
                    onClick={() => handleDeleteNotification(record.key)}
                >
                    <img src={cross} alt="" />
                </button>
            </div>
        );
    });

    return <div className="notification-container">{notificationsJSX}</div>;
}
