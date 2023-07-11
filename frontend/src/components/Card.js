import React, { useContext, useState, useEffect } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

export function Card(props) {
    // да, я тут специально не сделал деструктуризацию, так как просто потерял функцию когда переносил функцию лайка)
    // и для однообразности кода, не стал везде делать деструктуризацю))
    function handleClick() {
        props.onCardClick(props.card);
    }
    function handleDelete() {
        props.onCardDelete(props.card);
    }
    const userItem = useContext(CurrentUserContext);
    const isOwner = props.card.owner === userItem._id;

    const [isLike, setLike] = useState(false);

    useEffect(() => {
        if (props.likeCount.includes(userItem._id)) {
            setLike(true);
        } else {
            setLike(false);
        }
    }, [props.likeCount, userItem._id]);

    return (
        <li className="elements__element">
            <img
                className="elements__photo"
                src={props.link}
                alt={props.name}
                onClick={handleClick}
            />
            <div className="elements__info">
                <p className="elements__subtitle">{props.name}</p>
                <div className="card__like-wrapper">
                    <button
                        onClick={() => {
                            props.onCardLike(props.card);
                        }}
                        className={
                            isLike
                                ? "elements__button elements__button-active"
                                : "elements__button"
                        }
                    ></button>
                    <p className="cards__like-count">
                        {props.likeCount.length > 0
                            ? props.likeCount.length
                            : null}
                    </p>
                </div>
            </div>
            {isOwner && (
                <button
                    className="elements__delete"
                    onClick={handleDelete}
                ></button>
            )}
        </li>
    );
}