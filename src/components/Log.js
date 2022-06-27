import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { dbService } from "../fbase";

const Card = styled.div`    
    margin: 20px;

    border: none;
    box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
    border-radius: 5px;
    
    padding: 15px;

    color: #000;
    font-size: 20px;
    line-height: 1.3;

    position: relative;

    background-color: #fff;

    position: relative;

    & > p {
        white-space: pre-wrap;
        position: relative;
    }
`;

const Log = ({ type }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const q = query(collection(dbService, "log"), where("type1", "==", type), orderBy("date", "desc"));
        
        onSnapshot(q, (querySnapshot) => {
            const logArray = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setData(logArray);
        });
    }, []);

    return (
        <Card>
            {data.map((log, index) => (
                <div key={index}>

                    
                    <p>
                        [{log.date}] "{log.writer.replace(process.env.REACT_APP_USERAUTH_TAG, '')}" 님이 유저 "{log.name}" 님을
                        {log.type2 === "UserAdd" && "추가 하였습니다."}
                        {log.type2 === "UserModify" && "수정 하였습니다."}
                        {log.type2 === "UserDelete" && "삭제 하였습니다."}
                    </p>
                </div>
            ))}
        </Card>
    );
};

export default Log;