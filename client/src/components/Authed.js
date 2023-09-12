import { useAuthState } from "react-firebase-hooks/auth";
import { useObject } from 'react-firebase-hooks/database';

import { ref, set } from "firebase/database";
import { v4 as uuidv4 } from 'uuid';

import { auth, db } from '../firebase';

import './Authed.css';

const statusToButtonText = {
    'Open': 'CLOSE',
    'Opening': 'CLOSE',
    'Closed': 'OPEN',
    'Closing': 'OPEN'
}

const Authed = () => {
    const [user, ,] = useAuthState(auth);

    const [snapshot, loading, error] = useObject(ref(db, 'gate-controller/status/current_status'));
   
    console.debug(user.displayName, user.email, user.photoURL);
    // Listen to gate status using firebase

    const onClick = () => {

        // Add status class

        set(
            ref(db, `gate-controller/commands/${uuidv4()}`),
            {
                type: 'open|close',
                user: {
                    name: user.displayName,
                    email: user.email,
                    photo: user.photoURL,
                },
                data: {}
            }
        );
    };

    const gateStatus = loading ? "Loading..." : snapshot.val();

    // Open / Closed / Opening / Closing

    return (
        <div className="grid-center">
            <div className="gate-button grid-center" onClick={onClick}>
                <span>{statusToButtonText[gateStatus]} GATE</span>
            </div>
            <div className="gate-status grid-center">
                <span>Gate Status</span>
                <span>{gateStatus}</span>
                <span className="error">{error}</span>
            </div>
        </div>
    );
};

export default Authed;