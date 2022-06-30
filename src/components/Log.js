import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { dbService } from "../fbase";
import moment from "moment";

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

const ListHeader = styled.div`
    border-bottom: 3px solid #fff;
    padding-bottom: 10px;
    margin: 20px;

    text-align: center;

    & p {
        font-size: 25px;
    }
`;

const Log = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const q = query(collection(dbService, "logs"), orderBy("date", "desc"));
        
        onSnapshot(q, (querySnapshot) => {
            const logArray = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().date.toDate(),
            }));

            setData(logArray);
        });
    }, []);

    return (
        <div>
            <ListHeader>
                <p>활동 내역</p>
            </ListHeader>

            <Card>
                {data.map((log, index) => (
                    <div key={index}>
                        <p>
                            [{moment(log.date).format("YYYY-MM-DD")}] "{log.writer.replace(process.env.REACT_APP_USERAUTH_TAG, '')}" 님이
                            {log.type === "UserAdd" && `${log.name} 님을 등록 하였습니다.`}
                            {log.type === "UserModify" && `${log.name} 의 정보를 수정 하였습니다.`}
                            {log.type === "UserDelete" && `${log.name} 을 삭제 하였습니다.`}
                            {log.type === "UserOut" && `${log.name} 을 탈퇴 처리 하였습니다.`}
                            {log.type === "UserIn" && `${log.name} 을 복구 처리 하였습니다.`}
                            {log.type === "ProposalAdd" && "새로운 안건을 등록 하였습니다."}
                        </p>
                    </div>
                ))}

                {data.length === 0 &&
                    <p style={{ textAlign: "center" }}>활동내역이 없습니다.</p>
                }
            </Card>
        </div>
    );
};

export default Log;