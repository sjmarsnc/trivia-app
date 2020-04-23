import React, { useEffect } from 'react';
import { ws } from '../components/socket';
import { useHistory } from 'react-router-dom';

import WaitingRoom from '../components/WaitingRoom';
import Button from '../components/Button';
import { useGameContext } from '../utils/GlobalState';
import { SET_USERS } from '../utils/actions';
import API from '../utils/API';

const Wait = () => {
    const [state, dispatch] = useGameContext();
    let history = useHistory();
    
    const { game, name, icon, color, users } = state;

    //general useEffect for first run
    useEffect(() => {
        ws.emit('join', { game, name, icon, color }, () => {});
        API.startQuiz(game)
            .then(result => {
                console.log("======marked question as started=========")
                console.log(result);
            })
    }, []);

    useEffect(() => {
        ws.on("gameData", ({ users }) => {
            API.getAllPlayers(game)
                .then(result => {
                    console.log("===== socket gameData received =======")
                    console.log(result.data);
                    dispatch({
                        type: SET_USERS,
                        post: {
                            users: result.data
                        }
                    })
                })
        })

        ws.on("startGame", ({ game, users }) => {
            history.push('/game');
        })
    }, []);

    const handleClick = (event) => {
        event.preventDefault();
        ws.emit("allHere", { game }, () => {});
    }

    
    return (
        <div>
            <h2>You're in game: {game}</h2>
            <WaitingRoom users={users}/>
            <Button type="submit" text="EVERYONE IS HERE" handleClick={(event) => handleClick(event)}/>
        </div>
    )
}

export default Wait;