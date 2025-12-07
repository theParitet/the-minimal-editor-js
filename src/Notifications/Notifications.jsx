import cross from '../assets/pictures/cross.svg';

// notification.description is used as a unique identifier
export function Notifications({ notifications, handleDeleteNotification }) {
    let repeat = [];
    const reversedNotifications = notifications.map((el, index) => {
        const newIndex = notifications.length - 1 - index;
        return notifications[newIndex];
    });

    console.log('given:', notifications, '\nreversed:', reversedNotifications);

    reversedNotifications.forEach(ntf => {
        const descriptions = repeat.map(r => r.description);
        if (!descriptions.includes(ntf.description)) {
            repeat.push({
                message: ntf.message,
                description: ntf.description,
                count: 1,
            });
        } else {
            repeat.some(record => {
                let { description } = record;
                if (description === ntf.description) {
                    record.count++;
                    return true;
                }
                return false;
            });
        }
    });

    const notificationsJSX = repeat.map(record => {
        return (
            <div className="notification" key={record.description}>
                <div>
                    <h1 className="notification__title">
                        {record.message}{' '}
                        {record.count !== 1 && (
                            <span className="notification__count">
                                {record.count}x
                            </span>
                        )}
                    </h1>
                    <p className="notification__description">
                        {record.description}
                    </p>
                </div>
                <button
                    className="btn-img btn-img--default notification__btn"
                    onClick={() => handleDeleteNotification(record.description)}
                >
                    <img src={cross} alt="" />
                </button>
            </div>
        );
    });

    return <div className="notification-container">{notificationsJSX}</div>;
}
